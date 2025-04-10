import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonButton, IonContent, IonHeader, IonIcon } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import Map from './Map';
import HeaderGeneral from '../Header/HeaderGeneral';
import './ConfirmacionOrden.css';
import { Orden, LocationState, obtenerPresupuesto, entregaPago } from './fetchs';
import { useOrden } from '../../Provider/Provider';
import { copyOutline, checkmarkCircleOutline, mapOutline } from 'ionicons/icons';
import GlobalRefresher from '../Refresher/GlobalRefresher';

function ConfirmacionOrdenComponent() {
  const [position, setPosition] = useState({ latitude: -33.9913, longitude: -64.3435 });
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [direccionCopiada, setDireccionCopiada] = useState(false);
  const [isFacturado, setIsFacturado] = useState(false);  
  const history = useHistory();
  const location = useLocation<LocationState>();
  const orden = location.state?.orden;
  const { ordenActiva, pagos, cargarPagos } = useOrden();
  const [tecnico, setTecnico] = useState(Object);
  const [isPagoCompleted, setIsPagoCompleted] = useState(false); 
  const entregaPago = async () => {
    const idEntrega = ordenActiva?.Entrega?.id;  
    try {
      const response = await fetch(`https://lv-back.online/pagos/entrega/${idEntrega}`);
      const pagos = await response.json();
      if (pagos[0] !== undefined) {
         setIsPagoCompleted(true);  
        return pagos;
      } else {
         setIsPagoCompleted(false); 
        return false;
      }
    } catch (error) {
      console.error("Error, medio de pago no encontrado.", error);
      setIsPagoCompleted(false);
      return false;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setPosition({ latitude: ordenActiva.Cliente.latitud, longitude: ordenActiva.Cliente.longitud });
      } catch (error) {
        console.error('Error obteniendo la ubicación', error);
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
          const pagosOrden = pagos.filter((pago) => pago.id_orden === ordenActiva.id);
          if (pagosOrden.length > 0) {
            setIsFacturado(true); // Si existen pagos asociados, la orden se considera facturada
          } else {
            setIsFacturado(false);
          }
        } else {
          setIsFacturado(false);
        }
      }
      await entregaPago(); // Llamamos a la función para verificar los pagos
      const userId = localStorage.getItem('empleadoId');
      const user = await obtenerEmpleado(userId);
      setTecnico(user);
    };
    initialize()
    fetchData();
  }, [ordenActiva, pagos]);
  
  const obtenerEmpleado = async (id: string | null) => {
    try {
      const response = await fetch(`https://lv-back.online/empleados/${id}`);
      const empleado = await response.json();
      if (empleado) {
         return empleado;
      } else {
         return false;
      }
    } catch (error) {
      console.error('Error, empleado no encontrado.', error);
    }
  };

  const handleButtonClick = (path: string, orden: Orden | null) => {
    if (ordenActiva) {
      history.push({ pathname: path, state: { orden } });
    } else {
      console.error('Orden no válida');
    }
  };

  const renderButtons = () => {
    if (!ordenActiva) return null;

 
    const isDiagnosticoCompleted = ordenActiva?.diagnostico;
    const isPresupuestoCompleted = ordenActiva?.Presupuesto;
    const isEntregaCompleted = ordenActiva?.Entrega;
    
    const isLiquidaciónCompleted = async () => {
      const pagos = await entregaPago(); // Llamar a la función asincrónica
      return pagos !== false; // Si la respuesta no es false, entonces la liquidación está completada
    };
    
    return (
      <>
        <IonButton onClick={() => handleButtonClick('/diagnostico', orden)}>
          Diagnóstico
          {isDiagnosticoCompleted && <IonIcon style={{ marginLeft: '10px' }} icon={checkmarkCircleOutline} color="success" />}
        </IonButton>
    
        <IonButton onClick={() => handleButtonClick('/presupuesto', orden)}>
          Presupuestar
          {isPresupuestoCompleted && <IonIcon style={{ marginLeft: '10px' }} icon={checkmarkCircleOutline} color="success" />}
        </IonButton>
    
        <IonButton onClick={() => handleButtonClick('/entrega', orden)}>
          Entrega
          {isEntregaCompleted && <IonIcon style={{ marginLeft: '10px' }} icon={checkmarkCircleOutline} color="success" />}
        </IonButton>
    
        {/* Mostrar botón de "Ver Remito" si isEntregaCompleted es true */}
        {isPresupuestoCompleted && (
          <IonButton onClick={() => handleButtonClick('/remito', orden)}>
            Ver Remito
          </IonButton>
        )}
      </>
    );
    
  };

  const copiarDireccion = () => {
    const direccion = ordenActiva?.Cliente.direccion;
    if (direccion) {
      navigator.clipboard
        .writeText(direccion)
        .then(() => {
          setDireccionCopiada(true);
          setTimeout(() => setDireccionCopiada(false), 2000);  
        })
        .catch((err) => {
          console.error('Error al copiar la dirección: ', err);
        });
    }
  };

  const handleGoogle = (ruta: { latitud: any; longitud: any; }) => {
    if (!ruta || !ruta.latitud || !ruta.longitud) {
      console.error('Coordenadas inválidas:', ruta);
      return;
    }

    const baseUrl = 'https://www.google.com/maps/dir/';
    const destino = `${ruta.latitud},${ruta.longitud}`;
    const origen = `${tecnico.latitud},${tecnico.longitud}`; 

    const fullUrl = `${baseUrl}${""}/${destino}/${""}`;
    window.open(fullUrl, '_blank');
  };
 
  return (
    <GlobalRefresher>
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
              <h2>#{ordenActiva.id}</h2>
            </div>
            <div className='confirmacion-orden-medium-box'>
              <h3>
                <strong>Datos del cliente</strong>
              </h3>
              <div>
                <h4>
                  <strong>Nombre:</strong> {ordenActiva.Cliente.nombre}
                </h4>

           {/*      <h4>
                  <strong>N° Cliente:</strong> {ordenActiva.Cliente.numero_cliente}
                </h4> */}
               

               <h4>
                  <strong>Producto:</strong> {ordenActiva.equipo}
                </h4>


                <h4>
                  <strong>Observaciones:</strong> {ordenActiva.observaciones}
                </h4>

                <h4>
                  <strong>Dirección:</strong> {ordenActiva.Cliente.direccion}
                  <button onClick={copiarDireccion}>
                    <IonIcon icon={copyOutline} slot='start' />
                  </button>
                  {direccionCopiada && <span style={{ color: 'green', marginLeft: '10px' }}>Dirección copiada!</span>}
                </h4>
                <div  className='button-maps'>

<button style={{fontSize:'18px'}} onClick={() => handleGoogle(ordenActiva.Cliente)} >
 <img style={{width:'26px',   margin:'-10px 5px -5px 0px'}} src="./assets/maps.png" alt="" />
  Abrir en Maps
</button>
</div> 
              
              </div>
              {!loading && <Map position={position} zoom={13} />}
              {renderButtons()}
            </div>
          </div>
        )}
        <div className='confirmacion-orden-bottom-box'>
          <h4>Cotización</h4>
          <h3>${ordenActiva?.Presupuesto?.total ?? '0'}</h3>
   {/*        <button>Cerrar orden</button> */}
        </div>
      </IonContent>
    </GlobalRefresher>
  );
}

export default ConfirmacionOrdenComponent;
