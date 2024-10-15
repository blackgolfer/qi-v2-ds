import * as schema from "qi/common/cli_spec_schema";
import * as fs from "node:fs";
import * as R from "ramda";
import { get } from "node:http";

const user_spec = JSON.parse(fs.readFileSync("./test.json", "utf8"));
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

const spec = {
  cmd: {
    param_cmd: user_spec.cmd.param_cmd,
    user_cmd: user_spec.cmd.user_cmd,
    system_cmd: system_cmd,
  },
  prompt: user_spec.prompt,
};

//---------------------------------------------------------------------------
// Validate the user-provided spec against the schema.
//---------------------------------------------------------------------------
const validateSpec = (spec, validator) =>
  validator(spec) ? "Pass!" : validator.errors;
const v= schema.init();
// the order in `s` must match the schema in `v`
const s = [
  R.path(["cmd", "param_cmd", 0, "params", 0])(spec), // param
  spec.cmd.system_cmd.quit, // system.value
  spec.cmd.system_cmd, // system.command
  spec.cmd.param_cmd, // param.command
  spec.cmd.user_cmd, // user.command
  user_spec, // user.spec
  spec.cmd, // command
  spec // main
];
console.log(R.map((a) => validateSpec(a[1], a[0]), R.zip(v, s)));

const getParamProp = (p, { cmd: { param_cmd = [] } }) =>
  param_cmd.reduce((result, { name, params = [] }) => {
    const props = params
      .filter(R.has(p))
      .map(({ name, [p]: value }) => [name, value]);
    return props.length
      ? { ...result, [name]: Object.fromEntries(props) }
      : result;
  }, {});

const specProperties = {
  user_cmds: ({ cmd: { user_cmd = [] } }) => user_cmd.map(({ name }) => name),
  param_cmds: ({ cmd: { param_cmd = [] } }) =>
    param_cmd.map(({ name }) => name),
  system_cmds: (spec) => R.keys(spec.cmd.system_cmd),
  options: (spec) => getParamProp("option", spec),
  usages: (spec) => getParamProp("usage", spec),
  titles: (spec) => getParamProp("title", spec),
};

const master_info = R.map((p) => p(spec))(specProperties);
console.log(master_info);

const getHelpMessage = (spec) => {
  const getCommandTitles = (commands) =>
    commands.map(({ name, title }) => ` - ${name}: ${title}`);

  const getUserCmdTitles = () => getCommandTitles(spec.cmd?.user_cmd || []);
  const getParamCmdTitles = () => getCommandTitles(spec.cmd?.param_cmd || []);
  const getSystemCmdTitles = () => {
    const systemCommands = Object.entries(spec.cmd.system_cmd).map(
      ([key, { title }]) => ` - ${key}: ${title}`
    );
    return systemCommands;
  };

  return [
    "System commands:",
    ...getSystemCmdTitles(),
    "Param commands:",
    ...getParamCmdTitles(),
    "Commands without param:",
    ...getUserCmdTitles(),
  ].join("\n");
};

console.log(getHelpMessage(spec));

const commandUsage = (cmd) => {
  const getParamUsage = (cmd, param) => master_info.usages[cmd][param];

  const buildCommandOptions = (cmd) => {
    return Object.entries(master_info.options["table_op"])
      .map(
        ([key, value]) =>
          ` -${value.short}, --${key}: ${getParamUsage(cmd, key)}`
      )
      .join("\n  ");
  };

  return `${cmd} [run|set|ls] [args]
  run: execute the command with the given arguments
  set: set the parameters according to the arguments
  ls:  list the parameter currently set
  args:
  ${buildCommandOptions(cmd)}
  If args are not specified, the last set value will be used.
  If an arg has never been set, then the default value will be used.`;
};

console.log(commandUsage("table_op"));
