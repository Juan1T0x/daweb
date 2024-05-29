const Station = require("../models/Station");
const Bicycle = require("../models/Bicycle");
const { Op } = require("sequelize");

// Alta de estación - Gestor
exports.createStation = async (req, res) => {
  const { nombre, codigoPostal, capacidad } = req.body;
  try {
    const newStation = await Station.create({
      nombre,
      codigoPostal,
      capacidad,
    });
    res.status(201).json({ success: true, data: newStation });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al crear la estación." });
  }
};

exports.getAllStations = async (req, res) => {
  const { nombre, codigoPostal, bicicletasDisponibles } = req.query;

  let whereClause = {};

  if (nombre) {
    whereClause.nombre = { [Op.like]: `%${nombre}%` };
  }
  if (codigoPostal) {
    whereClause.codigoPostal = codigoPostal;
  }

  try {
    let stations = await Station.findAll({
      where: whereClause,
      include: [{ model: Bicycle, as: "bicycles" }],
    });

    if (bicicletasDisponibles) {
      stations = stations.filter(
        (station) => station.bicycles.length >= parseInt(bicicletasDisponibles)
      );
    }

    res.status(200).json({ success: true, data: stations });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener las estaciones." });
  }
};

// Eliminación de estación - Gestor
exports.deleteStation = async (req, res) => {
  const { id } = req.params;
  try {
    const station = await Station.findByPk(id, {
      include: [{ model: Bicycle, as: "bicycles" }],
    });
    if (!station) {
      return res
        .status(404)
        .json({ success: false, message: "Estación no encontrada." });
    }
    if (station.bicycles.length > 0) {
      return res.status(400).json({
        success: false,
        message: "La estación tiene bicycles asociadas.",
      });
    }
    await station.destroy();
    res
      .status(200)
      .json({ success: true, message: "Estación eliminada correctamente." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar la estación." });
  }
};

// Actualización de estación - Gestor
exports.updateStation = async (req, res) => {
  const { id } = req.params;
  const { nombre, codigoPostal, capacidad } = req.body;
  try {
    const station = await Station.findByPk(id);
    if (!station) {
      return res
        .status(404)
        .json({ success: false, message: "Estación no encontrada." });
    }
    station.nombre = nombre || station.nombre;
    station.codigoPostal = codigoPostal || station.codigoPostal;
    station.capacidad = capacidad || station.capacidad;
    await station.save();
    res.status(200).json({ success: true, data: station });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar la estación." });
  }
};

// Obtener estación por ID - Usuario
exports.getStationById = async (req, res) => {
  const { id } = req.params;
  try {
    const station = await Station.findByPk(id, {
      include: [{ model: Bicycle, as: "bicycles" }],
    });
    if (!station) {
      return res
        .status(404)
        .json({ success: false, message: "Estación no encontrada." });
    }
    res.status(200).json({ success: true, data: station });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener la estación." });
  }
};

// Obtener bicycles de una estación - Gestor
exports.getBicyclesByStationId = async (req, res) => {
  const { id } = req.params;
  try {
    const station = await Station.findByPk(id, {
      include: [{ model: Bicycle, as: "bicycles" }],
    });
    if (!station) {
      return res
        .status(404)
        .json({ success: false, message: "Estación no encontrada." });
    }
    res.status(200).json({ success: true, data: station.bicycles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las bicycles de la estación.",
    });
  }
};
