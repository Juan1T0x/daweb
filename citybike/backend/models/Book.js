const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Bicycle = require("./Bicycle");

const Book = sequelize.define("Book", {
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
    type: DataTypes.DATE,
    allowNull: false,
  },
  horaInicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30, // Duración predeterminada de 30 minutos
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "reservado", // Otros estados pueden ser "cancelado" o "alquilado"
  },
});

User.hasMany(Book, { foreignKey: "userId" });
Bicycle.hasMany(Book, { foreignKey: "bicycleId" });
Book.belongsTo(User, { foreignKey: "userId" });
Book.belongsTo(Bicycle, { foreignKey: "bicycleId" });

module.exports = Book;
