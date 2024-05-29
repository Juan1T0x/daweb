import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";

const Rentals = () => {
  const { user } = useContext(AuthContext);
  const [reservas, setReservas] = useState([]);
  const [alquileres, setAlquileres] = useState([]);
  const [active, setActive] = useState(null);
  const [bicicletaId, setBicicletaId] = useState("");
  const [stationId, setStationId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveReservationOrRent();
    fetchPreviousRents();
  }, []);

  const fetchActiveReservationOrRent = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/active/${user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setActive(data.data);
      } else {
        setActive(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPreviousRents = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/previous/${user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setAlquileres(data.data);
      } else {
        setAlquileres([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReservation = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          bicycleId: bicicletaId,
          fecha: new Date(),
          horaInicio: new Date(),
          duracion: 30,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setActive(data.data);
        alert("Bicicleta reservada correctamente");
      } else {
        alert("Error al reservar la bicicleta");
      }
    } catch (error) {
      console.error(error);
      alert("Error al reservar la bicicleta");
    }
  };

  const handleCancelReservation = async (bookId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/cancel/${bookId}`,
        {
          method: "POST",
        }
      );
      if (response.ok) {
        alert("Reserva cancelada correctamente");
        setActive(null);
        fetchActiveReservationOrRent();
      } else {
        alert("Error al cancelar la reserva");
      }
    } catch (error) {
      console.error(error);
      alert("Error al cancelar la reserva");
    }
  };

  const handleConfirmReservation = async (bookId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/confirm/${bookId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fecha: new Date(),
            horaInicio: new Date(),
            duracion: 30,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setActive(data.data);
        alert("Reserva confirmada correctamente");
        fetchActiveReservationOrRent();
      } else {
        alert("Error al confirmar la reserva");
      }
    } catch (error) {
      console.error(error);
      alert("Error al confirmar la reserva");
    }
  };

  const handleRentBicycle = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/rent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          bicycleId: bicicletaId,
          fecha: new Date(),
          horaInicio: new Date(),
          duracion: 60,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setActive(data.data);
        alert("Bicicleta alquilada correctamente");
      } else {
        alert("Error al alquilar la bicicleta");
      }
    } catch (error) {
      console.error(error);
      alert("Error al alquilar la bicicleta");
    }
  };

  const handleEndRent = async (rentId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/end/${rentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stationId }),
      });
      if (response.ok) {
        alert("Alquiler terminado correctamente");
        setActive(null);
        fetchPreviousRents();
        fetchActiveReservationOrRent();
      } else {
        alert("Error al terminar el alquiler");
      }
    } catch (error) {
      console.error(error);
      alert("Error al terminar el alquiler");
    }
  };

  const handleClearHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/history/${user.id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert("Historial de alquileres borrado correctamente");
        fetchPreviousRents();
      } else {
        alert("Error al borrar el historial de alquileres");
      }
    } catch (error) {
      console.error(error);
      alert("Error al borrar el historial de alquileres");
    }
  };

  return (
    <div>
      <Nav />
      <div className="container">
        <h2>Alquileres y Reservas</h2>
        <div className="form-group">
          <label htmlFor="bicicletaId">ID de la Bicicleta</label>
          <input
            type="text"
            className="form-control"
            id="bicicletaId"
            name="bicicletaId"
            value={bicicletaId}
            onChange={(e) => setBicicletaId(e.target.value)}
            placeholder="ID de la bicicleta"
          />
        </div>
        <button className="btn btn-primary" onClick={handleReservation}>
          Reservar Bicicleta
        </button>
        <button className="btn btn-secondary" onClick={handleRentBicycle}>
          Alquilar Bicicleta
        </button>

        {active && active.estado === "activa" && (
          <div>
            <h3>Reserva Activa</h3>
            <p>Bicicleta ID: {active.bicycleId}</p>
            <button
              className="btn btn-danger"
              onClick={() => handleCancelReservation(active.id)}
            >
              Cancelar Reserva
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleConfirmReservation(active.id)}
            >
              Confirmar Reserva para Alquiler
            </button>
          </div>
        )}

        {active && active.estado === "activo" && (
          <div>
            <h3>Alquiler Actual</h3>
            <p>Bicicleta ID: {active.bicycleId}</p>
            <p>Fecha: {active.fecha}</p>
            <p>Hora de Inicio: {active.horaInicio}</p>
            <p>Duración: {active.duracion} minutos</p>
            <p>Estado: {active.estado}</p>
            <div className="form-group">
              <label htmlFor="stationId">ID de la Estación</label>
              <input
                type="text"
                className="form-control"
                id="stationId"
                name="stationId"
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                placeholder="ID de la estación"
              />
            </div>
            <button
              className="btn btn-success"
              onClick={() => handleEndRent(active.id)}
            >
              Terminar Alquiler
            </button>
          </div>
        )}

        <div className="mt-4">
          <h3>Historial de Alquileres</h3>
          {alquileres.length > 0 ? (
            <ul className="list-group">
              {alquileres.map((alquiler) => (
                <li key={alquiler.id} className="list-group-item">
                  Bicicleta ID: {alquiler.bicycleId} - Estado: {alquiler.estado}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tienes alquileres previos</p>
          )}
        </div>
        <button className="btn btn-danger mt-3" onClick={handleClearHistory}>
          Borrar Historial de Alquileres
        </button>
      </div>
    </div>
  );
};

export default Rentals;
