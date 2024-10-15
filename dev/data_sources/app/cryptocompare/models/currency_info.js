const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('currency_info', {
    currency_code: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    currency: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'currency_info',
    schema: 'public',
    timestamps: false
  });
};
