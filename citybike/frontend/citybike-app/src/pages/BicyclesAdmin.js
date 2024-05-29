import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Nav from "../components/Nav";

const BicyclesAdmin = () => {
  const { user } = useContext(AuthContext);
  const [stations, setStations] = useState([]);
  const [bicycles, setBicycles] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    marca: "",
    modelo: "",
    estado: "disponible",
    stationId: "",
  });

  useEffect(() => {
    fetchStations();
    fetchBicycles();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/stations");
      if (response.ok) {
        const data = await response.json();
        setStations(data.data);
      } else {
        alert("Error al obtener las estaciones");
      }
    } catch (error) {
      console.error(error);
      alert("Error al obtener las estaciones");
    }
  };

  const fetchBicycles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/bicycles");
      if (response.ok) {
        const data = await response.json();
        setBicycles(data.data);
      } else {
        alert("Error al obtener las bicicletas");
      }
    } catch (error) {
      console.error(error);
      alert("Error al obtener las bicicletas");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = formData.id
      ? `http://localhost:3000/api/bicycles/${formData.id}`
      : "http://localhost:3000/api/bicycles";
    const method = formData.id ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert(
          `Bicicleta ${formData.id ? "actualizada" : "creada"} correctamente`
        );
        fetchBicycles();
        resetForm();
      } else {
        alert(`Error al ${formData.id ? "actualizar" : "crear"} la bicicleta`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error al ${formData.id ? "actualizar" : "crear"} la bicicleta`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta bicicleta?"))
      return;

    try {
      const response = await fetch(`http://localhost:3000/api/bicycles/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Bicicleta eliminada correctamente");
        fetchBicycles();
      } else {
        alert("Error al eliminar la bicicleta");
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la bicicleta");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (bicycle) => {
    setFormData(bicycle);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      marca: "",
      modelo: "",
      estado: "disponible",
      stationId: "",
    });
  };

  const handleStationChange = async (e) => {
    const stationId = e.target.value;
    setFormData({ ...formData, stationId });
    try {
      const response = await fetch(
        `http://localhost:3000/api/bicycles/station/${stationId}`
      );
      if (response.ok) {
        const data = await response.json();
        setBicycles(data.data);
      } else {
        alert("Error al obtener las bicicletas de la estación");
      }
    } catch (error) {
      console.error(error);
      alert("Error al obtener las bicicletas de la estación");
    }
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Gestión de Bicicletas</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="marca">Marca</label>
            <input
              type="text"
              className="form-control"
              id="marca"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="modelo">Modelo</label>
            <input
              type="text"
              className="form-control"
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              className="form-control"
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <option value="disponible">Disponible</option>
              <option value="reservada">Reservada</option>
              <option value="alquilada">Alquilada</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="stationId">Estación</label>
            <select
              className="form-control"
              id="stationId"
              name="stationId"
              value={formData.stationId}
              onChange={handleStationChange}
              required
            >
              <option value="">Seleccionar Estación</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.nombre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            {formData.id ? "Actualizar Bicicleta" : "Añadir Bicicleta"}
          </button>
          {formData.id && (
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={resetForm}
            >
              Volver a Crear Bicicleta
            </button>
          )}
        </form>
        <div className="mt-4">
          <h3>Listado de Bicicletas</h3>
          {bicycles.length > 0 ? (
            <ul className="list-group">
              {bicycles.map((bicycle) => (
                <li key={bicycle.id} className="list-group-item">
                  {bicycle.marca} - {bicycle.modelo} - {bicycle.estado}
                  <button
                    className="btn btn-warning ml-2"
                    onClick={() => handleEdit(bicycle)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => handleDelete(bicycle.id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron bicicletas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BicyclesAdmin;
