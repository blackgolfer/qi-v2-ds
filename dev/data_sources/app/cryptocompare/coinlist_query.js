import { connection } from "qi/data_sources/database/postgres_connection";
import { task_wrapper } from "qi/common/utils";
import { coinList } from "./models/coin_list.js"
import Sequelize from "sequelize";
import path from "path";

const sequelize = await task_wrapper(
  connection,
  path.resolve("./config/timescaledb.env")
)();

const coin_list = coinList(sequelize,Sequelize);
/* raw query */
let messages = await sequelize.query(
  "select * from coin_lists where symbol='BTC'"
);
console.log(messages);

/* query with model object */
messages = await coin_list.findOne({ where: { id: 18 } });
console.log(messages);
