'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MainCompanies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MainCompanies.init({
    maincompany_id: DataTypes.INTEGER,
    maincompany_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MainCompanies',
  });
  return MainCompanies;
};