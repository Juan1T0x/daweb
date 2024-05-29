// controllers/bicycleController.js
const Bicycle = require("../models/Bicycle");
const Station = require("../models/Station");

// Alta de bicicleta - Gestor
exports.createBicycle = async (req, res) => {
  const { marca, modelo, estado, stationId } = req.body;
  try {
    const station = await Station.findByPk(stationId, {
      include: [{ model: Bicycle, as: "bicycles" }],
    });
    if (!station) {
      return res
        .status(404)
        .json({ success: false, message: "Estación no encontrada." });
    }
    if (station.bicycles.length >= station.capacidad) {
      return res.status(400).json({
        success: false,
        message: "No hay espacio disponible en la estación.",
      });
    }
    const newBicycle = await Bicycle.create({
      marca,
      modelo,
      estado,
      stationId,
    });
    res.status(201).json({ success: true, data: newBicycle });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al crear la bicicleta." });
  }
};

exports.getAllBicycles = async (req, res) => {
  try {
    const bicycles = await Bicycle.findAll();
    res.status(200).json({ success: true, data: bicycles });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener las bicycles." });
  }
};

exports.getBicyclesByStation = async (req, res) => {
  const { stationId } = req.params;
  try {
    const bicycles = await Bicycle.findAll({ where: { stationId } });
    res.status(200).json({ success: true, data: bicycles });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las bicycles por estación.",
    });
  }
};

exports.updateBicycle = async (req, res) => {
  const { id } = req.params;
  const { marca, modelo, estado, stationId } = req.body;
  try {
    const bicycle = await Bicycle.findByPk(id);
    if (!bicycle) {
      return res
        .status(404)
        .json({ success: false, message: "Bicicleta no encontrada." });
    }

    bicycle.marca = marca;
    bicycle.modelo = modelo;
    bicycle.estado = estado;
    bicycle.stationId = stationId;

    await bicycle.save();

    res.status(200).json({ success: true, data: bicycle });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al actualizar la bicicleta." });
  }
};

// Baja de bicicleta - Gestor
exports.deleteBicycle = async (req, res) => {
  const { id } = req.params;
  try {
    const bicycle = await Bicycle.findByPk(id);
    if (!bicycle) {
      return res
        .status(404)
        .json({ success: false, message: "Bicicleta no encontrada." });
    }

    await bicycle.destroy();

    res
      .status(200)
      .json({ success: true, message: "Bicicleta eliminada correctamente." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar la bicicleta." });
  }
};

exports.getStationByBicycle = async (req, res) => {
  const { id } = req.params;
  try {
    const bicycle = await Bicycle.findByPk(id, {
      include: {
        model: Station,
        attributes: ["id", "nombre", "codigoPostal", "capacidad"],
      },
    });
    if (!bicycle) {
      return res
        .status(404)
        .json({ success: false, message: "Bicicleta no encontrada." });
    }
    res.status(200).json({ success: true, data: bicycle.Station });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la estación de la bicicleta.",
    });
  }
};

// Obtener bicycles disponibles - Usuario
exports.getAvailableBicycles = async (req, res) => {
  try {
    const availableBicycles = await Bicycle.findAll({
      where: { estado: "disponible" },
    });
    res.status(200).json({ success: true, data: availableBicycles });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Error al obtener las bicycles disponibles.",
      });
  }
};
