import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isCargaArchivosEnabled, setIsCargaArchivosEnabled] = useState(true);
  const { login } = useContext(AuthContext); // Obtener la función login del contexto de autenticación
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        alert("Inicio de sesión exitoso");
        navigate("/home");
      } else {
        alert("Error al iniciar sesión");
      }
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión");
    }
  };

  const cargarArchivos = async () => {
    try {
      const response = await fetch("/data.json");
      const data = await response.json();

      // Cargar estaciones
      for (const station of data.stations) {
        const stationResponse = await fetch("http://localhost:3000/api/stations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(station),
        });
        if (!stationResponse.ok) {
          console.error(`Error al crear la estación: ${station.nombre}`);
        }
      }

      // Cargar usuarios
      for (const user of data.users) {
        const userResponse = await fetch("http://localhost:3000/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        if (!userResponse.ok) {
          console.error(`Error al crear el usuario: ${user.email}`);
        }
      }

      // Cargar bicicletas
      for (const bicycle of data.bicycles) {
        const bicycleResponse = await fetch("http://localhost:3000/api/bicycles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bicycle),
        });
        if (!bicycleResponse.ok) {
          console.error(`Error al crear la bicicleta: ${bicycle.marca} ${bicycle.modelo}`);
        }
      }

      alert("Datos cargados exitosamente");
      setIsCargaArchivosEnabled(false);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      alert("Error al cargar los datos");
    }
  };

  return (
    <div>
      <div className="container">
        <h2>Login</h2>
        <form id="loginForm" onSubmit={onSubmit}>
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
            <p>
              ¿Aún no tienes cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={cargarArchivos}
            disabled={!isCargaArchivosEnabled}
            style={{ marginLeft: "10px" }}
          >
            Cargar Archivos
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;