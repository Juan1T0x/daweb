// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const stationRoutes = require("./routes/stationRoutes");
const bicycleRoutes = require("./routes/bicycleRoutes");
const rentRoutes = require("./routes/rentRoutes");
const userRoutes = require("./routes/userRoutes");
const models = require("./models");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // Analiza las solicitudes entrantes con cuerpos JSON

// Rutas
app.use("/api", authRoutes);
app.use("/api", stationRoutes);
app.use("/api", bicycleRoutes);
app.use("/api", rentRoutes);
app.use("/api", userRoutes);

// Sincronizar la base de datos y arrancar el servidor
sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((err) => console.error("Error al sincronizar la base de datos:", err));
