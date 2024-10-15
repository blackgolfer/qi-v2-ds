const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('crypto_prices', {
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
    volume_crypto: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    volume_btc: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    currency_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'crypto_prices',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "crypto_prices_currency_code_time_idx",
        fields: [
          { name: "currency_code" },
          { name: "time", order: "DESC" },
        ]
      },
      {
        name: "crypto_prices_time_idx",
        fields: [
          { name: "time", order: "DESC" },
        ]
      },
    ]
  });
};
