// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Stations from "./pages/Stations";
import Bicycles from "./pages/Bicycles";
import Rentals from "./pages/Rentals";
import Logout from "./pages/Logout";
import StationDetail from "./pages/StationDetail";
import StationsAdmin from "./pages/StationsAdmin";
import BicyclesAdmin from "./pages/BicyclesAdmin";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/stations" element={<Stations />} />
      <Route path="/bicycles" element={<Bicycles />} />
      <Route path="/rentals" element={<Rentals />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/stations/:id" element={<StationDetail />} />
      <Route path="/admin/stations" element={<StationsAdmin />} />
      <Route path="/admin/bicycles" element={<BicyclesAdmin />} />
    </Routes>
  );
};

export default App;
