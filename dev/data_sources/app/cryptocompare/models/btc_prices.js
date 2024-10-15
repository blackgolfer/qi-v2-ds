const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('btc_prices', {
    time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    opening_price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    highest_price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    lowest_price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    closing_price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    volume_btc: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    volume_currency: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    currency_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'btc_prices',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "btc_prices_opening_price_time_idx",
        fields: [
          { name: "opening_price" },
          { name: "time", order: "DESC" },
        ]
      },
      {
        name: "btc_prices_time_idx",
        fields: [
          { name: "time", order: "DESC" },
        ]
      },
    ]
  });
};
