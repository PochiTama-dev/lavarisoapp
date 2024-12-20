 
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonContent, IonHeader } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import Map from './Map';
import HeaderGeneral from '../Header/HeaderGeneral';
import './ConfirmacionOrden.css';
import { useLocation } from 'react-router-dom';
import { useOrden } from '../../pages/Orden/ordenContext';
import socket from '../services/socketService';
 
function ConfirmacionOrdenComponent() {
  const [position, setPosition] = useState({
    latitude: -33.9913,
    longitude: -64.3435,
  });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const history = useHistory();
  const location = useLocation();
  const { orden } = location.state as { orden: any };
 //@ts-ignore
  const { cargarOrdenes, selectedRepuestos, ordenActiva, setOrdenActiva ,  } = useOrden();
console.log(ordenActiva)

 
  const obtenerPresupuesto = async (id_orden: any) => {
    try {
      const response = await fetch(`https://lv-back.online/presupuestos?ordenId=${id_orden}`);
      const presupuestos = await response.json();
      const presupuesto = presupuestos.find((presupuesto: any) => presupuesto.id_orden === id_orden);
      if (presupuesto) {
        console.log(`Se encontró un presupuesto asociado al id_orden ${id_orden}`);
        return presupuesto;
      } else {
        console.log(`No se encontró ningún presupuesto con el id_orden ${id_orden}`);
        return null;
      }
    } catch (error) {
      console.error('Error, presupuesto no encontrado.', error);
      return null;
    }
  };

 
useEffect(() => {
 
  const initialize = async () => {
    try {
      if (orden && orden.Cliente) {
        setPosition({
          latitude: orden.Cliente.latitud,
          longitude: orden.Cliente.longitud,
        });
      }
      const presupuesto = await obtenerPresupuesto(orden.id);
      setTotal(presupuesto ? presupuesto.total : 0); // Total a 0 si no hay presupuesto
      setLoading(false);
    } catch (error) {
      console.error("Error obteniendo la ubicación o presupuesto:", error);
      setLoading(false);
    }
  };

  // Escuchar notificaciones del socket
  socket.on('todasNotificaciones', (data) => {
    console.log('Notificación recibida en Confirmación de Orden:', data);
  });

  // Llamar a la función de inicialización
  initialize();

  // Limpiar el evento del socket al desmontar el componente
  return () => {
    socket.off('todasNotificaciones');
  };
}, [orden]);


  const handleButtonClick = (path: any, orden = null) => {
    if (orden) {
      history.push({
        pathname: path,
        state: { orden },
      });
    } else {
      history.push(path);
    }
  };

  const handleSocket = () => {
    socket.emit('todasNotificaciones', { mensaje: 'Mensaje desde Confirmación de Orden' });
  };
  return (
    <IonContent className='confirmacion-orden-container'>
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>

      {orden && (
        <div>
          <div className='confirmacion-orden-top-box'>
            <h1>
              <strong>Orden activa</strong>
            </h1>
            <h3>#{orden.id}</h3>
          </div>
          <div className='confirmacion-orden-medium-box'>
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
            <div>{!loading && <Map position={position} zoom={13} />}</div>
            {orden && orden.Presupuesto && orden.id_tipo_estado === 1 && (orden.Presupuesto.id_estado_presupuesto === 5 || orden.Presupuesto.id_estado_presupuesto === 4) ? (
              <>
                <IonButton onClick={() => handleButtonClick('/entrega', orden)}>Entrega</IonButton>
                {/* <IonButton onClick={() => handleButtonClick('/facturacion', orden)}>Facturación</IonButton> */}
              </>
            ) : (
              <>
                <IonButton onClick={() => handleButtonClick('/diagnostico', orden)}>Diagnóstico</IonButton>
                <IonButton onClick={() => handleButtonClick('/presupuesto', orden)}>Presupuestar</IonButton>
                <IonButton onClick={() => handleButtonClick('/chat', orden)}>Chat</IonButton>
              </>
            )}
          </div>
        </div>
      )}

      <div className='confirmacion-orden-bottom-box'>
        <h4>Cotización</h4>
        <h3>${total}</h3>
        <button>Cerrar orden</button>
        <button onClick={handleSocket}>Enviar algo al Sokcet</button>
      </div>
    </IonContent>
  );
}

export default ConfirmacionOrdenComponent;
