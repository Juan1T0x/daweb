// models/Rent.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Bicycle = require("./Bicycle");

const Rent = sequelize.define("Rent", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
    allowNull: false,
  },
  bicycleId: {
    type: DataTypes.INTEGER,
    references: {
      model: Bicycle,
      key: "id",
    },
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  horaInicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  duracion: {
    type: DataTypes.INTEGER,
    defaultValue: 30, // Duración por defecto de 30 minutos
  },
  estado: {
    type: DataTypes.STRING,
    defaultValue: "activo", // Estado del alquiler
  },
});

User.hasMany(Rent, { foreignKey: "userId" });
Bicycle.hasMany(Rent, { foreignKey: "bicycleId" });
Rent.belongsTo(User, { foreignKey: "userId" });
Rent.belongsTo(Bicycle, { foreignKey: "bicycleId" });

module.exports = Rent;
