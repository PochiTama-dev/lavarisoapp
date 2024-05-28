import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { IonButton, IonContent, IonHeader } from "@ionic/react";
import { Geolocation } from '@capacitor/geolocation';
import Map from "./Map";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./ConfirmacionOrden.css";

function ConfirmacionOrdenComponent({ estadoOrden = 'visita' }) {
  const [position, setPosition] = useState({
    latitude: -33.9913,
    longitude: -64.3435,
  });

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const numeroOrden = "#25645";
  const orden = {
    cliente: "Martín Inchausti",
    telefono: 112345678,
    legajo: "0123456",
    direccion: "Corrientes 654",
    precio: 17800,
  };

  useEffect(() => {
    async function initialize() {
      try {
        const coordenadas = await Geolocation.getCurrentPosition();
        console.log(coordenadas);
        
        setPosition({
          latitude: coordenadas.coords.latitude,
          longitude: coordenadas.coords.longitude,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error obteniendo la ubicación", error);
        setLoading(false);
      }
    }

    initialize();
  }, []);

  const handleButtonClick = (path) => {
    history.push(path);
  };

  return (
    <IonContent className="confirmacion-orden-container">
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      <div className="confirmacion-orden-top-box">
        <h1>
          <strong>Orden activa</strong>
        </h1>
        <h3>{numeroOrden}</h3>
      </div>
      <div className="confirmacion-orden-medium-box">
        <h3>
          <strong>Datos del cliente</strong>
        </h3>
        <h4>
          <strong>Nombre:</strong> {orden.cliente}
        </h4>
        <h4>
          <strong>Teléfono:</strong> {orden.telefono}
        </h4>
        <h4>
          <strong>Legajo:</strong> {orden.legajo}
        </h4>
        <h4>
          <strong>Dirección:</strong> {orden.direccion}
        </h4>
        <div>
          {!loading && <Map position={position} zoom={13} />}
        </div>
        {(estadoOrden == 'entrega') && (
          <>
            <IonButton onClick={() => handleButtonClick("/entrega")}>Entrega</IonButton>
            <IonButton onClick={() => handleButtonClick("/facturacion")}>Facturación</IonButton>
          </>
        )}
        {(estadoOrden == 'visita') && (
          <>
            <IonButton onClick={() => handleButtonClick("/diagnostico")}>Diagnóstico</IonButton>
            <IonButton onClick={() => handleButtonClick("/presupuesto")}>Presupuestar</IonButton>
            <IonButton onClick={() => handleButtonClick("/chat")}>Chat</IonButton>
          </>
        )}
      </div>
      <div className="confirmacion-orden-bottom-box">
        <h4>Cotización</h4>
        <h3>${orden.precio}</h3>
        <button>Cerrar orden</button>
      </div>
    </IonContent>
  );
}

export default ConfirmacionOrdenComponent;
