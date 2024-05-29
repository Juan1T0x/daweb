// routes/stationRoutes.js
const express = require("express");
const router = express.Router();
const stationController = require("../controllers/stationController");

router.post("/stations", stationController.createStation);
router.get("/stations", stationController.getAllStations);
router.delete("/stations/:id", stationController.deleteStation);
router.put("/stations/:id", stationController.updateStation);
router.get("/stations/:id", stationController.getStationById);
router.get("/stations/:id/bicycles", stationController.getBicyclesByStationId);

module.exports = router;
