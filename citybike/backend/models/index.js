const Station = require("./Station");
const Bicycle = require("./Bicycle");

// Definir relaciones bidireccionales
Station.hasMany(Bicycle, { foreignKey: "stationId", as: "bicycles" });
Bicycle.belongsTo(Station, { foreignKey: "stationId", as: "station" });

module.exports = {
  Station,
  Bicycle,
};
