import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

const Stations = () => {
  const { user } = useContext(AuthContext);
  const [stations, setStations] = useState([]);
  const [filters, setFilters] = useState({
    nombre: "",
    codigoPostal: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStations();
  }, [filters]);

  useEffect(() => {
    if (sortConfig.key) {
      sortStations();
    }
  }, [sortConfig]);

  const fetchStations = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(
        `http://localhost:3000/api/stations?${query}`
      );
      if (response.ok) {
        const data = await response.json();
        const stationsWithAvailableBikes = data.data.map((station) => {
          const bicicletasDisponibles = station.bicycles.filter(
            (bicycle) => bicycle.estado === "disponible"
          ).length;
          return { ...station, bicicletasDisponibles };
        });
        setStations(stationsWithAvailableBikes);
      } else {
        alert("Error al obtener las estaciones");
      }
    } catch (error) {
      console.error(error);
      alert("Error al obtener las estaciones");
    }
  };

  const sortStations = () => {
    let sortedStations = [...stations];
    sortedStations.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    setStations(sortedStations);
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const onChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const viewStationDetails = (id) => {
    navigate(`/stations/${id}`);
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Estaciones</h2>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={filters.nombre}
            onChange={onChange}
            placeholder="Nombre de la estación"
          />
        </div>
        <div className="form-group">
          <label htmlFor="codigoPostal">Código Postal</label>
          <input
            type="text"
            className="form-control"
            id="codigoPostal"
            name="codigoPostal"
            value={filters.codigoPostal}
            onChange={onChange}
            placeholder="Código Postal"
          />
        </div>

        <div className="mt-4">
          <h3>Listado de Estaciones</h3>
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => requestSort("id")}>
                  ID
                  {sortConfig.key === "id"
                    ? sortConfig.direction === "ascending"
                      ? " ↑"
                      : " ↓"
                    : null}
                </th>
                <th onClick={() => requestSort("nombre")}>
                  Nombre
                  {sortConfig.key === "nombre"
                    ? sortConfig.direction === "ascending"
                      ? " ↑"
                      : " ↓"
                    : null}
                </th>
                <th onClick={() => requestSort("codigoPostal")}>
                  Código Postal
                  {sortConfig.key === "codigoPostal"
                    ? sortConfig.direction === "ascending"
                      ? " ↑"
                      : " ↓"
                    : null}
                </th>
                <th onClick={() => requestSort("bicicletasDisponibles")}>
                  Bicicletas Disponibles
                  {sortConfig.key === "bicicletasDisponibles"
                    ? sortConfig.direction === "ascending"
                      ? " ↑"
                      : " ↓"
                    : null}
                </th>
              </tr>
            </thead>
            <tbody>
              {stations.length > 0 ? (
                stations.map((station) => (
                  <tr
                    key={station.id}
                    onClick={() => viewStationDetails(station.id)}
                  >
                    <td>{station.id}</td>
                    <td>{station.nombre}</td>
                    <td>{station.codigoPostal}</td>
                    <td>{station.bicicletasDisponibles}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No se encontraron estaciones</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stations;
