// routes/bicycleRoutes.js
const express = require("express");
const router = express.Router();
const bicycleController = require("../controllers/bicycleController");

router.post("/bicycles", bicycleController.createBicycle);
router.get("/bicycles", bicycleController.getAllBicycles);
router.get(
  "/bicycles/station/:stationId",
  bicycleController.getBicyclesByStation
);
router.put("/bicycles/:id", bicycleController.updateBicycle);
router.delete("/bicycles/:id", bicycleController.deleteBicycle);
router.get("/bicycles/:id/station", bicycleController.getStationByBicycle);
router.get("/bicycles/available", bicycleController.getAvailableBicycles);

module.exports = router;
