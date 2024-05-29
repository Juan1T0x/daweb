import React, { useState, useEffect, useContext } from "react";
import Nav from "../components/Nav";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    birthdate: "",
    password: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFormData({
          nombre: data.data.nombre,
          apellidos: data.data.apellidos,
          email: data.data.email,
          birthdate: formatDate(data.data.birthdate),
          password: "", // Mantener el campo de contraseña en blanco
        });
      } else {
        alert("Error al obtener la información del usuario.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al obtener la información del usuario.");
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return [year, month, day].join("-");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("Información del usuario actualizada correctamente.");
      } else {
        alert("Error al actualizar la información del usuario.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la información del usuario.");
    }
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Perfil del usuario</h2>
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
            <label htmlFor="apellidos">Apellidos</label>
            <input
              type="text"
              className="form-control"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="birthdate">Fecha de Nacimiento</label>
            <input
              type="date"
              className="form-control"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña (opcional)"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Actualizar Perfil
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
