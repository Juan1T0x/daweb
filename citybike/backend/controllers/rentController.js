// controllers/alquilerController.js
const Rent = require("../models/Rent");
const Book = require("../models/Book");
const User = require("../models/User");
const Bicycle = require("../models/Bicycle");
const Station = require("../models/Station");

// Función para formatear la fecha y hora
const formatDateTime = (date) => {
  return date.toISOString().slice(0, 19).replace("T", " ");
};

// Reservar una bicycle - User
exports.reservarBicicleta = async (req, res) => {
  const { userId, bicycleId, fecha, horaInicio, duracion } = req.body;
  try {
    const alquilerExistente = await Rent.findOne({
      where: { userId, estado: "activo" },
    });
    const reservaExistente = await Book.findOne({
      where: { userId, estado: "activa" },
    });
    if (alquilerExistente || reservaExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya tienes una reserva o alquiler activo.",
      });
    }

    const bicycle = await Bicycle.findByPk(bicycleId);
    if (!bicycle) {
      return res
        .status(404)
        .json({ success: false, message: "Bicycle no encontrada." });
    }
    if (bicycle.estado !== "disponible") {
      return res.status(400).json({
        success: false,
        message: "La bicycle no está disponible para reserva.",
      });
    }

    // Crear nueva reserva
    const nuevaReserva = await Book.create({
      userId,
      bicycleId,
      fecha: formatDateTime(new Date(fecha)),
      horaInicio: formatDateTime(new Date(horaInicio)),
      duracion,
      estado: "activa", // Cambiado a "activa" para ser consistente con el estado de reserva
    });

    // Cambiar el estado de la bicycle a "reservada"
    bicycle.estado = "reservada";
    await bicycle.save();

    res.status(201).json({ success: true, data: nuevaReserva });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al reservar la bicycle." });
  }
};

// Confirmar una reserva para alquiler
exports.confirmarReserva = async (req, res) => {
  const { bookId } = req.params;
  const { fecha, horaInicio, duracion } = req.body;

  try {
    const reserva = await Book.findByPk(bookId);
    if (!reserva) {
      return res
        .status(404)
        .json({ success: false, message: "Book no encontrada." });
    }

    const bicycle = await Bicycle.findByPk(reserva.bicycleId);
    if (!bicycle) {
      return res
        .status(404)
        .json({ success: false, message: "Bicycle no encontrada." });
    }

    if (bicycle.estado !== "reservada") {
      return res
        .status(400)
        .json({ success: false, message: "La bicycle no está reservada." });
    }

    // Crear nuevo alquiler con los datos proporcionados por el usuario
    const nuevoAlquiler = await Rent.create({
      userId: reserva.userId,
      bicycleId: reserva.bicycleId,
      fecha: formatDateTime(new Date(fecha)),
      horaInicio: formatDateTime(new Date(horaInicio)),
      duracion,
      estado: "activo",
    });

    // Cambiar el estado de la reserva a confirmada
    reserva.estado = "confirmada";
    await reserva.save();

    // Cambiar el estado de la bicycle a alquilada
    bicycle.estado = "alquilada";
    await bicycle.save();

    res.status(201).json({ success: true, data: nuevoAlquiler });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al confirmar la reserva." });
  }
};

// Cancelar una reserva
exports.cancelarReserva = async (req, res) => {
  const { bookId } = req.params;
  try {
    const reserva = await Book.findByPk(bookId);
    if (!reserva) {
      return res
        .status(404)
        .json({ success: false, message: "Book no encontrada." });
    }

    // Verificar que la reserva está activa
    if (reserva.estado !== "activa") {
      return res.status(400).json({
        success: false,
        message: "Solo se pueden cancelar reservas activas.",
      });
    }

    // Cambiar el estado de la reserva a cancelada
    reserva.estado = "cancelada";
    await reserva.save();

    res
      .status(200)
      .json({ success: true, message: "Book cancelada correctamente." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al cancelar la reserva." });
  }
};

// Obtener reserva/alquiler activo
exports.obtenerReservaOAlquilerActivo = async (req, res) => {
  const { userId } = req.params;
  try {
    const reservaActiva = await Book.findOne({
      where: { userId, estado: "activa" },
    });
    if (reservaActiva) {
      return res.status(200).json({ success: true, data: reservaActiva });
    }

    const alquilerActivo = await Rent.findOne({
      where: { userId, estado: "activo" },
    });
    if (alquilerActivo) {
      return res.status(200).json({ success: true, data: alquilerActivo });
    }

    res.status(404).json({
      success: false,
      message: "No hay reservas o alquileres activos.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la reserva o alquiler activo.",
    });
  }
};

// Obtener lista de alquileres previos
exports.obtenerAlquileresPrevios = async (req, res) => {
  const { userId } = req.params;
  try {
    const alquileresPrevios = await Rent.findAll({
      where: { userId, estado: "completado" },
    });
    res.status(200).json({ success: true, data: alquileresPrevios });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al obtener los alquileres previos.",
    });
  }
};

exports.alquilarBicicleta = async (req, res) => {
  const { userId, bicycleId, fecha, horaInicio, duracion } = req.body;

  try {
    const alquilerExistente = await Rent.findOne({
      where: { userId, estado: "activo" },
    });
    const reservaExistente = await Book.findOne({
      where: { userId, estado: "activa" },
    });
    if (alquilerExistente || reservaExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya tienes una reserva o alquiler activo.",
      });
    }

    const bicycle = await Bicycle.findByPk(bicycleId);
    if (!bicycle) {
      return res
        .status(404)
        .json({ success: false, message: "Bicycle no encontrada." });
    }

    if (bicycle.estado === "reservada" || bicycle.estado === "alquilada") {
      return res.status(400).json({
        success: false,
        message: "La bicycle ya está reservada o alquilada.",
      });
    }

    // Crear nuevo alquiler
    const nuevoAlquiler = await Rent.create({
      userId,
      bicycleId,
      fecha: formatDateTime(new Date(fecha)),
      horaInicio: formatDateTime(new Date(horaInicio)),
      duracion,
      estado: "activo",
    });

    // Cambiar el estado de la bicycle a alquilada
    bicycle.estado = "alquilada";
    bicycle.stationId = null; // Quitar la bicycle de la estación
    await bicycle.save();

    res.status(201).json({ success: true, data: nuevoAlquiler });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al alquilar la bicycle." });
  }
};

exports.terminarAlquiler = async (req, res) => {
  const { rentId } = req.params;
  const { stationId } = req.body;

  try {
    const alquiler = await Rent.findByPk(rentId);
    if (!alquiler) {
      return res
        .status(404)
        .json({ success: false, message: "Alquiler no encontrado." });
    }

    const bicicleta = await Bicycle.findByPk(alquiler.bicycleId);
    if (!bicicleta) {
      return res
        .status(404)
        .json({ success: false, message: "Bicicleta no encontrada." });
    }

    const estacion = await Station.findByPk(stationId, {
      include: [{ model: Bicycle, as: "bicycles" }],
    });
    if (!estacion) {
      return res
        .status(404)
        .json({ success: false, message: "Estación no encontrada." });
    }
    if (estacion.bicycles.length >= estacion.capacidad) {
      return res.status(400).json({
        success: false,
        message: "No hay espacio disponible en la estación.",
      });
    }

    // Terminar alquiler
    alquiler.estado = "completado";
    await alquiler.save();

    // Cambiar el estado de la bicicleta a disponible y asignarla a la estación
    bicicleta.estado = "disponible";
    bicicleta.stationId = stationId;
    await bicicleta.save();

    res
      .status(200)
      .json({ success: true, message: "Alquiler terminado correctamente." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error al terminar el alquiler." });
  }
};

exports.borrarHistorialAlquileresCompletados = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await Rent.destroy({
      where: {
        userId,
        estado: "completado",
      },
    });

    if (result > 0) {
      res.status(200).json({
        success: true,
        message: "Historial de alquileres completados borrado correctamente.",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No se encontraron alquileres completados para borrar.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al borrar el historial de alquileres completados.",
    });
  }
};
