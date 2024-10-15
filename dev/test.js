import * as R from "ramda";
import * as fs from "node:fs";
import { parseArgs } from "node:util";
import * as schema from "qi/common/cli_spec_schema";

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
    reduce(
      (a, b) => a + b,
      title
    ), // aggregate the titles into help message
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
      map((a)=>a.usage),
      paramCommandWith("usage")
    )(this._spec);
    this._ranges = compose(
      map((a=>a.range)),
      paramCommandWith("range")
    )(this._spec);
    this._prompt = this._spec.prompt;
  }

  help() {
    return this._help_info;
  }

  usages(cmd) {
    return this._usages[cmd] == undefined ? "" : this._usages[cmd];
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

try {
  const spec = JSON.parse(fs.readFileSync("./test.json", "utf8"));

  const handler = new SpecHandler(spec);
  console.log("---------------------------options-----------------------------");
  let options = handler.options();
  console.log("options: ",options);
  // process command line options
  const m = parseArgs({ options, args: process.argv.slice(2) });
  console.log("-----------------parameter and its validation-------------------");
  const parameters = m.values;
  // validate parameter values
  console.log("The result of parameters validations:");
  mapObjIndexed((v, k, o) => console.log(`${k}: `, handler.validate(k, v)))(
    parameters
  );
  console.log("parameters: ",parameters);
  // param_cmd
  console.log("--------------------------param_cmd----------------------------");
  const param_cmd = handler.param_cmds();
  console.log("param_cmd =",param_cmd);
  // usages
  console.log("---------------------------usage------------------------------");
  map((a) => console.log(`${a}: `,handler.usages(a)), param_cmd);
  // validate

  // help
  console.log("----------------------------help------------------------------");
  console.log(handler.help());
} catch (error) {
  console.error(error.message);
}
