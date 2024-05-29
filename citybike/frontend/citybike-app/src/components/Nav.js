import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Nav = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Citybike
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/home">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile">
              Perfil
            </Link>
          </li>
          {user && user.role === "admin" ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/stations">
                  Estaciones (Admin)
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/bicycles">
                  Bicicletas (Admin)
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/stations">
                  Estaciones
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/rentals">
                  Alquileres
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <Link className="nav-link" to="/logout">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
