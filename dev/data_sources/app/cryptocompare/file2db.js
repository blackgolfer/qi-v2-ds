import { connection } from "../../db/modules/postgres_connection.js";
import { task_wrapper } from "../../db/modules/utils.js";
import Sequelize, { Model } from "sequelize";
import { readFileSync } from "fs";
import path from "path";
// obtaining the fully configured connection function
const connection_fct = task_wrapper(
  connection,
  path.resolve("../../db/timescaledb/config/timescaledb.env")
);

function coinList(sequelize, DataTypes) {
  const coin_list = sequelize.define(
    "coin_list",
    {
      cid: {
        type: DataTypes.STRING,
      },
      symbol: {
        type: DataTypes.STRING,
      },
      full_name: {
        type: DataTypes.STRING,
      },
      created_on: {
        type: DataTypes.DATE,
      },
      is_trading: {
        type: DataTypes.BOOLEAN,
      },
      total_coins_mined: {
        type: DataTypes.FLOAT,
      },
      is_used_in_defi: {
        type: DataTypes.BOOLEAN,
      },
      is_used_in_nft: {
        type: DataTypes.BOOLEAN,
      },
      platform_type: {
        type: DataTypes.STRING,
      },
      build_on: {
        type: DataTypes.STRING,
      },
    },
    {
      modelName: "coin_list",
      tableName: "coin_lists",
    },
    {
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
  coin_list.associate = function (models) {
    // associations can be defined here
  };
  return coin_list;
}

const cl_data = JSON.parse(readFileSync("./coinlist.json", "utf8"))["Data"];
const sequelize = await connection_fct();
const CoinListModel = coinList(sequelize, Sequelize);
sequelize
  .sync({ force: true })
  .then(async () => {
    for (const key in cl_data) {
      let data = cl_data[key];
      /* The name and full_name of the following symbols have problem with utf8 */
      if (
        data["Symbol"] != "DBR" &&
        data["Symbol"] != "ZCN" &&
        data["Symbol"] != "OPET" &&
        data["Symbol"] != "ESW" &&
        data["Symbol"] != "FB" &&
        data["Symbol"] != "GOZ" &&
        data["Symbol"] != "ARTEQ" &&
        data["Symbol"] != "SPFC" &&
        data["Symbol"] != "GALO" &&
        data["Symbol"] != "KOINB" &&
        data["Symbol"] != "FKSK" &&
        data["Symbol"] != "ANKA" &&
        data["Symbol"] != "TBFT" &&
        data["Symbol"] != "SCHRODI" &&
        data["Symbol"] != "ALBART" &&
        data["Symbol"] != "OLYMPE" &&
        data["Symbol"] != "PIERRE" &&
        data["Symbol"] != "CRI"
      )
        await CoinListModel.create({
          cid: data["Id"],
          symbol: data["Symbol"],
          full_name: data["FullName"],
          created_on: data["ContentCreatedOn"],
          is_trading: data["IsTrading"],
          total_coins_mined: data["TotalCoinsMined"],
          is_used_in_defi: data["IsUsedInDefi"],
          is_used_in_nft: data["IsUsedInNft"],
          platform_type: data["PlatformType"],
          build_on: data["BuiltOn"],
        });
    }
  })
  .then(async () => await sequelize.close())
  .catch((error) => console.error(error));
