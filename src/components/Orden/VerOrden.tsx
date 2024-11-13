import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IonButton, IonContent, IonHeader, IonIcon } from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import Map from "./Map";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./ConfirmacionOrden.css";
import { Orden, LocationState, obtenerPresupuesto, entregaPago } from "./fetchs";
import { useOrden } from "../../Provider/Provider";   
import { copyOutline, checkmarkCircleOutline } from "ionicons/icons";  
import GlobalRefresher from "../Refresher/GlobalRefresher";

function ConfirmacionOrdenComponent() {
  const [position, setPosition] = useState({ latitude: -33.9913, longitude: -64.3435 });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [direccionCopiada, setDireccionCopiada] = useState(false);  
  const [isFacturado, setIsFacturado] = useState(false); // Nuevo estado para verificar facturación
  const history = useHistory();
  const location = useLocation<LocationState>();
  const orden = location.state?.orden;
  const { ordenActiva, pagos, cargarPagos } = useOrden();
 
  useEffect(() => {
    const initialize = async () => {
      try {
        setPosition({ latitude: ordenActiva.Cliente.latitud, longitude: ordenActiva.Cliente.longitud });
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
  
        // Verificamos si hay pagos asociados con la orden
        if (pagos && pagos.length > 0) {
          const pagosOrden = pagos.filter(pago => pago.id_orden === ordenActiva.id);
          if (pagosOrden.length > 0) {
            setIsFacturado(true); // Si existen pagos asociados, la orden se considera facturada
          } else {
            setIsFacturado(false);
          }
        } else {
          setIsFacturado(false);
        }
      }
    };
  
    initialize();
    fetchData();
  }, [ordenActiva, pagos]);

  const handleButtonClick = (path: string, orden: Orden | null) => {
    if (ordenActiva) {
      history.push({ pathname: path, state: { orden } });
    } else {
      console.error("Orden no válida");
    }
  };
 
 
  const renderButtons = () => {
    if (!ordenActiva) return null;

    const { id_tipo_estado, Presupuesto } = ordenActiva || {}; // Usamos un fallback vacío en caso de que `ordenActiva` sea null o undefined
    const isDiagnosticoCompleted = ordenActiva?.diagnostico; // Opcional, si no existe `diagnostico` será undefinednpm
    const isPresupuestoCompleted = ordenActiva?.Presupuesto; // Opcional, si no existe `Presupuesto` será undefined
    const isEntregaCompleted = ordenActiva?.Entrega; // Opcional, si no existe `Entrega` será undefined
    const isFacturado = ordenActiva?.Entrega?.id; // Opcional, si no existe `Entrega` o `id`, será undefined
    
    return (
      <>
        <IonButton onClick={() => handleButtonClick("/diagnostico", orden)}>
          Diagnóstico
          {isDiagnosticoCompleted && <IonIcon style={{ marginLeft: '10px' }} icon={checkmarkCircleOutline} color="success" />}
        </IonButton>

        <IonButton onClick={() => handleButtonClick("/presupuesto", orden)}>
          Presupuestar
          {isPresupuestoCompleted && <IonIcon style={{ marginLeft: '10px' }} icon={checkmarkCircleOutline} color="success" />}
        </IonButton>

        <IonButton onClick={() => handleButtonClick("/entrega", orden)}>
          Entrega
          {isEntregaCompleted && <IonIcon style={{ marginLeft: '10px' }} icon={checkmarkCircleOutline} color="success" />}
        </IonButton>

        <IonButton onClick={() => handleButtonClick("/facturacion", orden)}>
          Facturación
        
        </IonButton>
      </>
    );
  };

  const copiarDireccion = () => {
    const direccion = ordenActiva?.Cliente.direccion;
    if (direccion) {
      navigator.clipboard.writeText(direccion).then(() => {
        setDireccionCopiada(true);
        setTimeout(() => setDireccionCopiada(false), 2000); // Reset mensaje 2 segundos
      }).catch((err) => {
        console.error("Error al copiar la dirección: ", err);
      });
    }
  };

  return (
    <GlobalRefresher>
      <IonContent className="confirmacion-orden-container">
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>
        {ordenActiva && (
          <div>
            <div className="confirmacion-orden-top-box">
              <h1><strong>Orden activa</strong></h1>
              <h2>#{ordenActiva.id}</h2>
            </div>
            <div className="confirmacion-orden-medium-box">
              <h3><strong>Datos del cliente</strong></h3>
              <div>
                <h4><strong>Nombre:</strong> {ordenActiva.Cliente.nombre}</h4>
             
                <h4><strong>N° Cliente:</strong> {ordenActiva.Cliente.numero_cliente}</h4>
                <h4>
                  <strong>Dirección:</strong> {ordenActiva.Cliente.direccion}
                  <button onClick={copiarDireccion}>
                    <IonIcon icon={copyOutline} slot="start" />
                  </button>
                  {direccionCopiada && <span style={{ color: "green", marginLeft: "10px" }}>Dirección copiada!</span>}
                </h4>
              </div>
              {!loading && <Map position={position} zoom={13} />}
              {renderButtons()}
            </div>
          </div>
        )}
        <div className="confirmacion-orden-bottom-box">
          <h4>Cotización</h4>
          <h3>${ordenActiva?.Presupuesto?.total ?? "0"}</h3>
          <button>Cerrar orden</button>
        </div>
      </IonContent>
    </GlobalRefresher>
  );
}

export default ConfirmacionOrdenComponent;
