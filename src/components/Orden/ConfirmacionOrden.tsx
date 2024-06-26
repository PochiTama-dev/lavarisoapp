import { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { IonButton, IonContent, IonHeader } from "@ionic/react";
import { Geolocation } from '@capacitor/geolocation';
import Map from "./Map";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./ConfirmacionOrden.css";
import { useLocation } from 'react-router-dom';

function ConfirmacionOrdenComponent( ) {
  const [position, setPosition] = useState({
    latitude: -33.9913,
    longitude: -64.3435,
  });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const { orden } = location.state as { orden: any };

  
  
  const obtenerPresupuesto = async (numero_orden : any) => {
    try {
      const response = await fetch(`https://lv-back.online/presupuestos/${numero_orden}`);
      const presupuesto = await response.json();
      if (presupuesto) {
        console.log(`Se encontró un presupuesto asociado al id ${numero_orden}`);
        return presupuesto;
      } else {
        console.log(`No se encontró ningún presupuesto con el id ${numero_orden}`);
        return false;
      }
    } catch (error) {
      console.error("Error, presupuesto no encontrado.", error);
      return false;
    }
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

    const fetchData = async () => {
      const presupuesto = await obtenerPresupuesto(orden.id);
      if (presupuesto) {
        setTotal(presupuesto.total);
      }
    };

    fetchData();
  }, [orden.id]);
console.log("ORDENN", orden)
  const handleButtonClick = (path : any, orden = null) => {
    if (orden) {
      history.push({
        pathname: path,
        state: { orden },
      });
    } else {
      history.push(path);
    }
  };

  console.log(orden);
  return (
    <IonContent className="confirmacion-orden-container">
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>

      {orden && (
        <div>
          <div className="confirmacion-orden-top-box">
            <h1>
              <strong>Orden activa</strong>
            </h1>
            <h3>#{orden.numero_orden}</h3>
          </div>
          <div className="confirmacion-orden-medium-box">
            <h3>
              <strong>Datos del cliente</strong>
            </h3>
            <div>
              <h4>
                <strong>Nombre:</strong> {orden.Cliente.nombre}
              </h4>
              <h4>
                <strong>Teléfono:</strong> {orden.Cliente.telefono}
              </h4>
              <h4>
                <strong>N° Cliente:</strong> {orden.Cliente.numero_cliente}
              </h4>
              <h4>
                <strong>Dirección:</strong> {orden.Cliente.direccion}
              </h4>
            </div>
            <div>
              {!loading && <Map position={position} zoom={13} />}
            </div>
            {orden && orden.Presupuesto && orden.Presupuesto.id_estado_presupuesto == 4 ? (
  <>
 <IonButton onClick={() => handleButtonClick("/entrega", orden)}>Entrega</IonButton>
 <IonButton onClick={() => handleButtonClick("/facturacion", orden)}>Facturación</IonButton>
  </>
) : (
  <>
   <IonButton onClick={() => handleButtonClick("/diagnostico", orden)}>Diagnóstico</IonButton>
                <IonButton onClick={() => handleButtonClick("/presupuesto", orden)}>Presupuestar</IonButton>
                <IonButton onClick={() => handleButtonClick("/chat", orden)}>Chat</IonButton>
  </>
)}

 

          </div>
        </div>
      )}

      <div className="confirmacion-orden-bottom-box">
        <h4>Cotización</h4>
        <h3>${total}</h3>
        <button>Cerrar orden</button>
      </div>
    </IonContent>
  );
}

export default ConfirmacionOrdenComponent;
