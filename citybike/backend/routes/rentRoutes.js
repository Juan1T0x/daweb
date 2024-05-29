// routes/rentRoutes.js
const express = require("express");
const router = express.Router();
const rentController = require("../controllers/rentController");

router.post("/bookings", rentController.reservarBicicleta);
router.post("/confirm/:bookId", rentController.confirmarReserva);
router.post("/cancel/:bookId", rentController.cancelarReserva);
router.get("/active/:userId", rentController.obtenerReservaOAlquilerActivo);
router.get("/previous/:userId", rentController.obtenerAlquileresPrevios);
router.post("/rent", rentController.alquilarBicicleta);
router.post("/end/:rentId", rentController.terminarAlquiler);
router.delete(
  "/history/:userId",
  rentController.borrarHistorialAlquileresCompletados
);

module.exports = router;
