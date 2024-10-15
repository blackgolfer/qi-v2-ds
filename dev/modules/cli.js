import readline from "node:readline";
import { parseArgs } from "node:util";
import * as R from "ramda";
import * as schema from "./cli_spec_schema.js";

const {
  compose,
  filter,
  has,
  keys,
  map,
  mapObjIndexed,
  mergeDeepRight,
  reduce,
} = R;

const propWith = (p, name) => filter((a) => a[p] == name);
// example:
// const classWith = (name) => propWith('class',name);

const paramCommandWith = (name) =>
  compose(filter(has(name)), R.path(["cmd", "param_cmd"]));

const makeOptions = compose(
  map((a) => a.option),
  paramCommandWith("option")
);

const pickCmd = (spec) =>
  mergeDeepRight(
    R.path(["cmd", "param_cmd"])(spec),
    R.path(["cmd", "system_cmd"])(spec)
  );

const makeHelp = (title) =>
  compose(
    reduce((a, b) => a + b, title), // aggregate the titles into help message
    R.values, // forms the list of titles from commands
    mapObjIndexed((v, k, o) => "- " + k + ": " + v + "\n "),
    map((a) => a.title) // extract the title field for each command
  );

const system_cmd = {
  "?": {
    title: "help information",
    class: "info",
  },
  status: {
    title: "show the current parameters",
    class: "info",
  },
  quit: {
    title: "quit cli",
    class: "exec",
  },
  run: {
    title: "execute the registered function",
    class: "exec",
  },
};

const mainSpec = (user_spec) => {
  return {
    cmd: {
      param_cmd: user_spec.cmd.param_cmd,
      system_cmd: system_cmd,
    },
    prompt: user_spec.prompt,
  };
};

class SpecHandler {
  constructor(user_spec) {
    const schema_validators = schema.init(user_spec);
    if (!schema_validators.is_user_spec(user_spec))
      throw new Error(schema_validators.is_user_spec.errors);
    this._spec = mainSpec(user_spec);
    if (!schema_validators.is_main_spec(this._spec))
      throw new Error(schema_validators.is_main_spec.errors);
    this._help_info =
      "Valid commands are\n " +
      makeHelp("Editing commands\n ")(this._spec.cmd.param_cmd) +
      makeHelp("Common commands\n ")(this._spec.cmd.system_cmd);
    this._options = makeOptions(this._spec);
    this._param_cmds = compose(keys, paramCommandWith("option"))(this._spec);
    this._usages = compose(
      map((a) => a.usage),
      paramCommandWith("usage")
    )(this._spec);
    this._ranges = compose(
      map((a) => a.range),
      paramCommandWith("range")
    )(this._spec);
    this._prompt = this._spec.prompt;
  }

/*************  ✨ Codeium Command 🌟  *************/
  help() {
    return this._help_info;
  }
  usages(cmd) {
    return this._usages[cmd] ?? "";
  }

  options() {
    // this is used in parseArgs
    return this._options;
  }

  param_cmds() {
    return this._param_cmds;
  }

  validate(cmd, v) {
    // validate command value if the cmd has range defined,
    // a range is the scope of the corresponding value
    let r = this._ranges[cmd];
    if (r != undefined) {
      if (R.indexOf(v, r) == -1) {
        return false;
      }
    }
    return true;
  }

  prompt() {
    return this._prompt;
  }
}
export default class {
  constructor(spec) {
    /*
    if (!isImplementation(arg, ParameterRunInputInterface))
      throw new Error("arg does not implement the ParameterRunInputInterface");
    */
    this.spec_handler = new SpecHandler(spec);
    this.param_cmds = this.spec_handler.param_cmds();
    let options = this.spec_handler.options();
    const m = parseArgs({ options, args: process.argv.slice(2) });
    this.parameters = m.values;
  }
  async run(method) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: this.spec_handler.prompt(),
    });
    rl.prompt();
    rl.on("line", async (line) => {
      let cmd = "";
      let arg = "";
      try {
        const inputs = line.trim().split(' ').filter((a)=>a!='');
        cmd = inputs[0];
        // only allow one argument, other arguments are ignored
        inputs.length > 1 ? (arg = inputs[1]) : (arg = "");
        if (cmd == "run") {
          // run command
          try {
            await method(this.parameters);
          } catch (error) {
            console.log(`${error.message}`);
          }
        } else if (cmd == "status") {
          // quit command showing the current parameter valaues
          console.log(this.parameters);
        } else if (cmd == "?") {
          // help command
          console.log(this.spec_handler.help());
        } else if (cmd == "quit") {
          // quit command
          rl.close();
        } else {
          // commands for setting parameters
          let index = this.param_cmds.indexOf(cmd);
          if (index == -1) {
            throw new Error(
              `Error: unknown command\n${this.spec_handler.help()}`
            );
          } else {
            //let cmd = this.param_cmds[index];
            if (arg == "") {
              rl.question(
                `The value of ${cmd} is ${this.parameters[cmd]}, input new value for ${cmd}: `,
                (v) => {
                  this.parameters[cmd] = v;
                  rl.prompt();
                }
              );
            } else {
              this.parameters[cmd] = arg;
            }
          }
        }
      } catch (error) {
        console.log(`${error.message}`);
      }
      rl.prompt();
    }).on("close", () => {
      console.log("So long...");
      process.exit(0);
    });
  }
}
