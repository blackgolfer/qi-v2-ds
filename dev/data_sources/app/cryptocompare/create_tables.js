import { connection } from "../../db/modules/postgres_connection.js";
import { task_wrapper } from "../../db/modules/utils.js";
import path from "path";
// obtaining the fully configured connection function
const connection_fct = task_wrapper(
  connection,
  path.resolve("../../db/timescaledb/config/timescaledb.env")
);

import { readFileSync } from "fs";
var sql_string = readFileSync("./schema.sql", "utf8");
// - connection_fct() executes the connection to postgres database,
// its return is a Promise Sequelize object.
// - using this sequelize object to make a raw sql query from sql_string.
connection_fct().then((sequelize) => sequelize.query(sql_string));
