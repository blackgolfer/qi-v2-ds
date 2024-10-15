var DataTypes = require("sequelize").DataTypes;
var _btc_prices = require("./btc_prices");
var _crypto_prices = require("./crypto_prices");
var _currency_info = require("./currency_info");
var _eth_prices = require("./eth_prices");

function initModels(sequelize) {
  var btc_prices = _btc_prices(sequelize, DataTypes);
  var crypto_prices = _crypto_prices(sequelize, DataTypes);
  var currency_info = _currency_info(sequelize, DataTypes);
  var eth_prices = _eth_prices(sequelize, DataTypes);


  return {
    btc_prices,
    crypto_prices,
    currency_info,
    eth_prices,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
