// src/pages/Bicycles.js
import React from "react";
import Nav from "../components/Nav";

const Bicycles = () => {
  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Bicicletas</h2>
        <p>Lista de bicicletas disponibles para alquiler.</p>
        <div id="bicycleList"></div>
      </div>
    </div>
  );
};

export default Bicycles;
