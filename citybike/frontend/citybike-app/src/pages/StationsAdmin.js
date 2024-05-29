import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Nav from "../components/Nav";

const StationAdmin = () => {
  const { user } = useContext(AuthContext);
  const [stations, setStations] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    fechaAlta: "",
    codigoPostal: "",
    capacidad: "",
  });

  useEffect(() => {
    fetchStations();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = formData.id
      ? `http://localhost:3000/api/stations/${formData.id}`
      : "http://localhost:3000/api/stations";
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
          `Estación ${formData.id ? "actualizada" : "creada"} correctamente`
        );
        fetchStations();
        resetForm();
      } else {
        alert(`Error al ${formData.id ? "actualizar" : "crear"} la estación`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error al ${formData.id ? "actualizar" : "crear"} la estación`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta estación?"))
      return;

    try {
      const response = await fetch(`http://localhost:3000/api/stations/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Estación eliminada correctamente");
        fetchStations();
      } else {
        alert("Error al eliminar la estación");
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la estación");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (station) => {
    setFormData({
      id: station.id,
      nombre: station.nombre,
      fechaAlta: station.fechaAlta.slice(0, 10), // Ensure the date format is YYYY-MM-DD
      codigoPostal: station.codigoPostal,
      capacidad: station.capacidad,
    });
  };

  const resetForm = () => {
    setFormData({
      id: "",
      nombre: "",
      fechaAlta: "",
      codigoPostal: "",
      capacidad: "",
    });
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Gestión de Estaciones</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="fechaAlta">Fecha de Alta</label>
            <input
              type="date"
              className="form-control"
              id="fechaAlta"
              name="fechaAlta"
              value={formData.fechaAlta}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="codigoPostal">Código Postal</label>
            <input
              type="text"
              className="form-control"
              id="codigoPostal"
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="capacidad">Capacidad</label>
            <input
              type="number"
              className="form-control"
              id="capacidad"
              name="capacidad"
              value={formData.capacidad}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {formData.id ? "Actualizar Estación" : "Crear Estación"}
          </button>
          {formData.id && (
            <button
              type="button"
              className="btn btn-secondary ml-2"
              onClick={resetForm}
            >
              Volver a Crear Estación
            </button>
          )}
        </form>
        <div className="mt-4">
          <h3>Listado de Estaciones</h3>
          {stations.length > 0 ? (
            <ul className="list-group">
              {stations.map((station) => (
                <li key={station.id} className="list-group-item">
                  {station.nombre} - {station.codigoPostal}
                  <button
                    className="btn btn-warning ml-2"
                    onClick={() => handleEdit(station)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => handleDelete(station.id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No se encontraron estaciones</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationAdmin;
