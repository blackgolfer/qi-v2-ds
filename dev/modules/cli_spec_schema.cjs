'use strict';

var Ajv = require('ajv');
require('ramda/src/internal/_objectAssign');

// Define schemas in a consistent and structured manner
const schemas = {
  Param: {
    $id: "qi://common/cli/param.schema",
    type: "object",
    properties: {
      name: { type: "string" },
      option: {
        type: "object",
        properties: {
          type: { type: "string" },
          short: { type: "string" },
          default: { type: "string" },
        },
        required: ["type", "short", "default"],
      },
      range: { type: "array", items: { type: "string" } },
      title: { type: "string" },
      usage: { type: "string" },
      class: { type: "string" },
    },
    required: ["name", "option", "title", "usage", "class"],
  },
  /*
    anyOf: [
      { required: ["name", "title", "usage", "class"] },
      { required: ["name", "option", "title", "usage", "class"] },
    ],
  },
  */
  QICliSystemValue: {
    $id: "qi://common/cli/system.value.schema",
    type: "object",
    required: ["title", "usage", "class"],
    properties: {
      title: { type: "string" },
      usage: { type: "string" },
      class: { type: "string" },
    },
  },
  QICliSystemCommand: {
    $id: "qi://common/cli/system.command.schema",
    type: "object",
    required: ["quit", "?", "param"],
    properties: {
      quit: { $ref: "system.value.schema" },
      "?": { $ref: "system.value.schema" },
      param: { $ref: "system.value.schema" },
    },
  },
  QICliParamCommand: {
    $id: "qi://common/cli/param.command.schema",
    type: "array",
    items: {
      type: "object",
      required: ["name", "params"],
      properties: {
        name: { type: "string" },
        title: { type: "string" },
        usage: { type: "string" },
        params: { type: "array", items: { $ref: "param.schema" } },
      },
    },
  },
  QICliUserCommand: {
    $id: "qi://common/cli/user.command.schema",
    type: "array",
    items: {
      type: "object",
      required: ["name", "title", "class"],
      properties: {
        name: { type: "string" },
        title: { type: "string" },
        usage: { type: "string" },
        class: { type: "string" },
      },
    },
  },
  QICliUserSpec: {
    $id: "qi://common/cli/user.spec.schema",
    type: "object",
    required: ["cmd", "prompt"],
    properties: {
      cmd: {
        type: "object",
        minProperties: 1,
        properties: {
          param_cmd: { $ref: "param.command.schema" },
          user_cmd: { $ref: "user.command.schema" },
        },
      },
      prompt: { type: "string" },
    },
  },
  QICliCommand: {
    $id: "qi://common/cli/command.schema",
    type: "object",
    anyOf: [
      { required: ["system_cmd", "param_cmd"] },
      { required: ["system_cmd", "user_cmd"] },
      { required: ["system_cmd", "param_cmd", "user_cmd"] },
    ],
    properties: {
      system_cmd: { $ref: "system.command.schema" },
      param_cmd: { $ref: "param.command.schema" },
      user_cmd: { $ref: "user.command.schema" },
    },
  },
  QICliMain: {
    $id: "qi://common/cli/main.schema",
    type: "object",
    required: ["cmd", "prompt"],
    properties: {
      cmd: { $ref: "command.schema" },
      prompt: { type: "string" },
    },
  },
};

const ajv = new Ajv();

const install = (schema) => ajv.compile(schema);

// given the dependencies, the order of the `schemas` is important
const init = () =>
  Object.fromEntries(
    Object.entries(schemas).map(([name, schema]) => [name, install(schema)])
  );

exports.init = init;
exports.install = install;
