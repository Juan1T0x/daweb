import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

const StationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);

  useEffect(() => {
    fetchStationDetail();
  }, []);

  const fetchStationDetail = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/stations/${id}`);
      if (response.ok) {
        const data = await response.json();
        setStation(data.data);
      } else {
        alert("Error al obtener la estación");
      }
    } catch (error) {
      console.error(error);
      alert("Error al obtener la estación");
    }
  };

  if (!station) {
    return <p>Cargando...</p>;
  }

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Detalles de la Estación</h2>
        <p>Nombre: {station.nombre}</p>
        <p>Código Postal: {station.codigoPostal}</p>
        <p>Capacidad: {station.capacidad}</p>
        <h3>Bicicletas</h3>
        {station.bicycles.length > 0 ? (
          <ul className="list-group">
            {station.bicycles.map((bicycle) => (
              <li key={bicycle.id} className="list-group-item">
                ID: {bicycle.id} - Modelo: {bicycle.modelo} - Estado:{" "}
                {bicycle.estado}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay bicicletas en esta estación</p>
        )}
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/stations")}
        >
          Volver a Estaciones
        </button>
      </div>
    </div>
  );
};

export default StationDetail;
