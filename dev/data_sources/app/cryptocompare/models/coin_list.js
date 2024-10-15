/* coin_lists table model */
export function coinList(sequelize, DataTypes) {
  const coin_list = sequelize.define(
    "coin_list",
    {
      cid: {
        type: DataTypes.STRING,
      },
      symbol: {
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

/* 
  Alternatively, we can define the table model as follows:
  first, we need to change the import Sequelize to
  import Sequelize, { Model } from "sequelize";
  then, we need wrap the following code into a function similar
  to the code above.
*/
/*
class CoinListModel extends Model {}
CoinListModel.init(
  {
    cid: {
      type: Sequelize.STRING,
    },
    symbol: {
      type: Sequelize.STRING,
    },
    created_on: {
      type: Sequelize.DATE,
    },
    is_trading: {
      type: Sequelize.BOOLEAN,
    },
    total_coins_mined: {
      type: Sequelize.FLOAT,
    },
    is_used_in_defi: {
      type: Sequelize.BOOLEAN,
    },
    is_used_in_nft: {
      type: Sequelize.BOOLEAN,
    },
    platform_type: {
      type: Sequelize.STRING,
    },
    build_on: {
      type: Sequelize.STRING,
    },
  },
  { sequelize, modelName: "coin_list", tableName: "coin_lists" },
  { charset: "utf8", collate: "utf8_general_ci" }
);

*/