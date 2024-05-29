import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Nav from "../components/Nav";
import MapView from "../components/MapView";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Nav />
      <div className="container">
        <h1>Bienvenido a CityBike</h1>
        {user && (
          <p>
            Tu rol es <strong>{user.role}</strong>
          </p>
        )}
        <MapView />
      </div>
    </div>
  );
};

export default Home;
