const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Station = require("./Station");

const Bicycle = sequelize.define("Bicycle", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  marca: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stationId: {
    type: DataTypes.INTEGER,
    references: {
      model: Station,
      key: "id",
    },
  },
});

module.exports = Bicycle;
