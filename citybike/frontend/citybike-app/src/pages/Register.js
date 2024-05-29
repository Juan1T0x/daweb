// src/pages/Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    birthdate: "",
    role: "user",
  });

  const { nombre, apellidos, email, password, birthdate, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        alert("Usuario registrado exitosamente");
      } else {
        alert("Error al registrar el usuario");
      }
    } catch (error) {
      console.error(error);
      alert("Error al registrar el usuario");
    }
  };

  return (
    <div>
      <div className="container">
        <h2>Registro</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={onChange}
              placeholder="Nombre"
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
              value={apellidos}
              onChange={onChange}
              placeholder="Apellidos"
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
              value={email}
              onChange={onChange}
              placeholder="Email"
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
              value={password}
              onChange={onChange}
              placeholder="Contraseña"
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
              value={birthdate}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Rol</label>
            <div>
              <input
                type="radio"
                id="user"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={onChange}
              />
              <label htmlFor="user">Usuario</label>
            </div>
            <div>
              <input
                type="radio"
                id="admin"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={onChange}
              />
              <label htmlFor="admin">Administrador</label>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Registrarse
          </button>
        </form>
        <p className="mt-3">
          ¿Ya tienes cuenta? <Link to="/">Volver al login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
