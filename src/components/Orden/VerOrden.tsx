import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IonButton, IonContent, IonHeader } from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import Map from "./Map";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./ConfirmacionOrden.css";
import { Orden, LocationState, obtenerPresupuesto } from "./fetchs";
import { useOrden } from "../../Provider/Provider";  // Importar el hook
 
function ConfirmacionOrdenComponent() {
 const [position, setPosition] = useState({ latitude: -33.9913, longitude: -64.3435 });
 const [loading, setLoading] = useState(true);
 const [total, setTotal] = useState(0);
 const history = useHistory();
 const location = useLocation<LocationState>();
 const orden = location.state?.orden;
 const { ordenActiva} = useOrden();

 useEffect(() => {
  const initialize = async () => {
   try {
    const { coords } = await Geolocation.getCurrentPosition();
    setPosition({ latitude: coords.latitude, longitude: coords.longitude });
   } catch (error) {
    console.error("Error obteniendo la ubicación", error);
   } finally {
    setLoading(false);
   }
  };

  const fetchData = async () => {
   if (ordenActiva) {
    const presupuesto = await obtenerPresupuesto(ordenActiva.id);
    setTotal(presupuesto ? presupuesto.total : 0);
   }
  };

  initialize();
  fetchData();
 }, [ordenActiva]);

 const handleButtonClick = (path: string, orden: Orden | null) => {
  if (ordenActiva) {
   history.push({ pathname: path, state: { orden } });
  } else {
   console.error("Orden no válida");
  }
 };

 const renderButtons = () => {
  if (!ordenActiva) return null;

  const { id_tipo_estado, Presupuesto } = ordenActiva;
  const isEntregaFacturacion = id_tipo_estado === 1 && (Presupuesto?.id_estado_presupuesto === 5 || Presupuesto?.id_estado_presupuesto === 4);

  return (
   <>
    {isEntregaFacturacion ? (
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
   </>
  );
 };
 
 return (
  <IonContent className='confirmacion-orden-container'>
   <IonHeader>
    <HeaderGeneral />
   </IonHeader>
   {ordenActiva && (
    <div>
     <div className='confirmacion-orden-top-box'>
      <h1>
       <strong>Orden activa</strong>
      </h1>
      <h3>#{ordenActiva.id}</h3>
     </div>
     <div className='confirmacion-orden-medium-box'>
      <h3>
       <strong>Datos del cliente</strong>
      </h3>
      <div>
       <h4>
        <strong>Nombre:</strong> {ordenActiva.Cliente.nombre}
       </h4>
       <h4>
        <strong>Teléfono:</strong> {ordenActiva.Cliente.telefono}
       </h4>
       <h4>
        <strong>N° Cliente:</strong> {ordenActiva.Cliente.numero_cliente}
       </h4>
       <h4>
        <strong>Dirección:</strong> {ordenActiva.Cliente.direccion}
       </h4>
      </div>
      {!loading && <Map position={position} zoom={13} />}
      {renderButtons()}
     </div>
    </div>
   )}
   <div className='confirmacion-orden-bottom-box'>
    <h4>Cotización</h4>
    <h3>${ordenActiva.Presupuesto.total}</h3>
    <button>Cerrar orden</button>
   </div>
  </IonContent>
 );
}

export default ConfirmacionOrdenComponent;
