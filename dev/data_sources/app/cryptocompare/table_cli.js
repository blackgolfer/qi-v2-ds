/*
  cli for updating tables
*/
import * as fs from "node:fs";

import * as operator from "./table_ops.js";
import ParameterRunInterface from "qi/common/cli";

function validate_operation_name(op_name) {
  if (
    op_name == "file2file" ||
    op_name == "table2table" ||
    op_name == "file2url" ||
    op_name == "table2url" ||
    op_name == "url2url"
  ) {
    throw new Error(`${op_name} is not allowed`);
  }
}

const operation = (source, target) => {
  return `${source}2${target}`;
};

const model2table_name = (m) => m + "s";

const method_for_run = async (parameters) => {
  let op_name = operation(parameters.source, parameters.target);
  validate_operation_name(op_name);
  switch (op_name) {
    case "url2file":
      await operator.url2file(model2table_name(parameters.model));
      break;
    case "url2table":
      await operator.url2table(
        parameters.action,
        model2table_name(parameters.model)
      );
      break;
    case "file2table":
      await operator.file2table(
        parameters.action,
        model2table_name(parameters.model)
      );
      break;
    case "table2file":
      await operator.table2file(model2table_name(parameters.model));
      break;
    default:
      throw new Error(`${op_name} has not been implemented yet`);
  }
};

const spec = JSON.parse(fs.readFileSync("./config/cli.json", "utf8"));

let cli = new ParameterRunInterface(spec);
await cli.run(method_for_run);
