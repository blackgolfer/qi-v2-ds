/*
  This is a set of operations around database table.

  We model the operations as follows:
   1. an operation has a source and a target.
   2. an operation has an action (create, update, etc.)
  So we need the following concepts:
   1. source: url, file or db
   2. target: table (in a db) or file
   3. action: create, find_or_create, update

*/
import * as cc from "qi/data_sources/restapi/cryptocompare";
import * as fs from "fs";
import Sequelize, { Model } from "sequelize";
import * as R from "ramda";
import { coinList } from "./models/coin_list.js";
import { connection } from "qi/data_sources/database/postgres_connection";
import { task_wrapper } from "qi/common/utils";
import * as config from "./config.js";

const sequelize = await task_wrapper(connection, config.postgres_config_path)();
const CoinListModel = coinList(sequelize, Sequelize);

//-------------------------------------------------------------------------------------------------------------
// atomic operations
//  - url to json
//  - table to json
//  - file to json
//  - json to table
//  - json to file
//-------------------------------------------------------------------------------------------------------------
// ToDo: implement action dependency
const coin_list_row = (data, action) => {
  return {
    cid: data["Id"],
    symbol: data["Symbol"],
    created_on: data["ContentCreatedOn"],
    is_trading: data["IsTrading"],
    total_coins_mined: data["TotalCoinsMined"],
    is_used_in_defi: data["IsUsedInDefi"],
    is_used_in_nft: data["IsUsedInNft"],
    platform_type: data["PlatformType"],
    build_on: data["BuiltOn"],
  };
};

const cc_methods = new Map([["coin_lists", cc.coinList]]);
const table_models = new Map([["coin_lists", CoinListModel]]);
const row_function = new Map([["coin_lists", coin_list_row]]);

async function url2json(table_name) {
  return cc
    .init(config.cryptocompare_url_path, config.cryptocompare_api_key_path)
    .then(async () => {
      try {
        let response = await cc_methods.get(table_name)();
        return response["Data"];
      } catch (error) {
        throw new Error(error);
      }
    });
}

const table2json = async (table_name) => {
  try {
    let model = table_models.get(table_name);
    let results = await model.findAll();
    return results;
  } catch (error) {
    throw new Error(error.message);
  }
};

const file2json = (table_name) => {
  return JSON.parse(
    fs.readFileSync(`${config.data_path}/${table_name}.json`, "utf8")
  );
};

const json2table = async (response, action, table_name) => {
  let model = table_models.get(table_name);
  let row = row_function.get(table_name);
  if (action == "create") await model.sync({ force: true });
  for (const key in response) {
    let data = response[key];
    /* injesting data into the table */
    if (action == "create") {
      await model.create(row(data, "create"));
    } else if (action == "find_or_create")
      await model.findOrCreate(row(data, "find_or_create"), {
        where: { symbol: data["Symbol"] },
      });
    else if (action == "update")
      await model.update(row(data, "update"), {
        where: { symbol: data["Symbol"] },
      });
    else throw new Error("Unkonwn action in function json2table");
  }
};

const json2file = async (response, table_name) => {
  fs.writeFile(
    `${config.data_path}/${table_name}.json`,
    JSON.stringify(response),
    (err) => {
      if (err) throw new Error(err);
      console.log(
        `data saved to ${config.data_path}/${table_name}.json successfully`
      );
    }
  );
};

//-------------------------------------------------------------------------------------------------------------
// (composite) operatons
//  - url to table: url2json(table_name).then((respons)=>json2table(response,action,table_model))
//  - file to table: file2json(filename).then(async (data)=>return json2table(data,action,table_model))
//  - table to file: table2json(table_model).then((data)=>return json2file(data))
//  - url to file: url2json(table_name).then(async (response)=>return json2file(response,filename))
//-------------------------------------------------------------------------------------------------------------
export const file2table = async (action, table_name) => {
  let response = file2json(table_name);
  await json2table(response, action, table_name);
};

export const url2file = async (table_name) => {
  return url2json(table_name).then((response) =>
    json2file(response, table_name)
  );
};

export const url2table = async (action, table_name) => {
  return url2json(table_name).then((response) =>
    json2table(response, action, table_name)
  );
};

export const table2file = async (table_name) => {
  return table2json(table_name).then((results) =>
    json2file(results, table_name)
  );
};

export const query = async (model,q) => {
  return q;
  //let results = await model.query(q);
  //return results;
};