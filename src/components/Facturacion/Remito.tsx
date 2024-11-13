import React, { useEffect, useState } from "react";
import "./Remito.css";
import { IonContent } from "@ionic/react";
import { useOrden } from "../../Provider/Provider";
import { useHistory } from 'react-router-dom';
 
const RemitoOrden = () => {
  const { ordenActiva } = useOrden(); // Obtenemos la ordenActiva directamente del contexto
  const [mediosDePago, setMediosDePago] = useState([]);
  const [medioDePagoNombre, setMedioDePagoNombre] = useState("");
  const history = useHistory();
  useEffect(() => {
    if (ordenActiva && ordenActiva.Presupuesto && ordenActiva.Presupuesto.id_medio_de_pago) {
      console.log("Método de pago:", ordenActiva.Presupuesto.id_medio_de_pago);
    } else {
      console.log("No se encontró id_medio_de_pago en la ordenActiva");
    }
  }, [ordenActiva]);
console.log("ordenActiva", ordenActiva)
  useEffect(() => {
    const fetchMediosDePago = async () => {
      try {
        const response = await fetch("https://lv-back.online/opciones/pago");
        const data = await response.json();
        console.log("Medios de pago disponibles:", data);
        if (data && data.length > 0) {
          setMediosDePago(data);
          const medio = data.find(
            (m: { id: any; }) => m.id === ordenActiva?.Presupuesto?.id_medio_de_pago
          );
          console.log("Medio de pago encontrado:", medio);
          if (medio) {
            setMedioDePagoNombre(medio.medio_de_pago || "");
          }
        }
      } catch (error) {
        console.error(
          "Error, no se encontraron medios de pago en la base de datos....",
          error
        );
      }
    };

    if (ordenActiva?.Presupuesto?.id_medio_de_pago) {
      fetchMediosDePago();
    } else {
      console.log("No se encontró un id_medio_de_pago en la ordenActiva.");
    }
  }, [ordenActiva?.Presupuesto?.id_medio_de_pago]);

  if (!ordenActiva) {
    return <div>No hay datos de ordenActiva disponibles.</div>;
  }

  const {
    id ,
    Cliente = {},
    Empleado = {},
    equipo = "",
    modelo = "",
    antiguedad = "",
    diagnostico = "",
   motivo="",
    Presupuesto = {},
  } = ordenActiva;

  const handlePrint = () => {
    window.print();
  };
  const handleRedirect = () => {
    if (location.pathname !== '/domicilio') {
      history.push('/domicilio'); // Usar `history.push` para redirigir
    }
  };
  return (
 
    <IonContent className="remito">
      <div className="remito-container">
        <div className="remito-container-content">
          <div className="remito-container-table">
            <div>
              <h2>Remito</h2>
            </div>
            <div>
              <h4>
                No. <strong>#{id  || ""}</strong>
              </h4>
              <h4>
                Fecha <strong>{new Date().toLocaleDateString()}</strong>
              </h4>
              <h4>
                CUIT <strong>30-7 1188779-9</strong>
              </h4>
              <h4>IVA RESPONSABLE INSCRIPTO</h4>
            </div>
          </div>
          <div className="remito-container-table">
            <div>
              <h2>Datos del Cliente</h2>
            </div>
            <div>
              <h4>
               Nombre: <strong>{Cliente.nombre || ""} {Cliente.apellido || ""}</strong>  
              </h4>
              
              <h4>
                CUIL: <strong>{Cliente.cuil || ""}</strong>
              </h4>
            </div>
            <div>
            <h4>    Dirección:  <strong>{Cliente.direccion || ""}</strong> </h4>
            </div>
        
          </div>
          <svg
            width="1829"
            height="5"
            viewBox="0 0 1829 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="-2.18557e-07"
              y1="2.5"
              x2="1829"
              y2="2.49984"
              stroke="#8EA3BF"
              strokeWidth="5"
            />
          </svg>
          <div className="remito-container-table">
            <div>
              <h2>Detalles de la Orden</h2>
            </div>
            <div className="remito-details">
              <h4>
                <strong>Equipo:</strong> {equipo || ""}
              </h4>
              <h4>
                <strong>Modelo:</strong> {modelo || ""}
              </h4>
              <h4>
                <strong>Diagnóstico:</strong> {diagnostico || ""}
              </h4>
              <h4>
                <strong>Presupuesto:</strong> {motivo || ""}
              </h4>
            </div>
            <svg
              width="1829"
              height="5"
              viewBox="0 0 1829 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="-2.18557e-07"
                y1="2.5"
                x2="1829"
                y2="2.49984"
                stroke="#8EA3BF"
                strokeWidth="5"
              />
            </svg>
            <div>
              <h2>Detalles de pago</h2>
              <h4>
                Método de pago <strong>{medioDePagoNombre || ""}</strong>
              </h4>
              <h4>
                TOTAL: <strong>${Presupuesto.total || ""}</strong>
              </h4>
            </div>
            <div className="remito-container-firmas">
          <div className="firma-cliente">
            <h4>Firma del Cliente:</h4>
            {ordenActiva.Entrega.firma_cliente ? (
              <img
                src={`${ordenActiva.Entrega.firma_cliente}`}
                alt="Firma del Cliente"
                className="firma-imagen"
              />
            ) : (
              <p>Firma no disponible</p>
            )}
          </div>
          <div className="firma-empleado">
            <h4>Firma del Empleado:</h4>
            {ordenActiva.Entrega.firma_empleado ? (
              <img
                src={`${ordenActiva.Entrega.firma_empleado}`}
                alt="Firma del Empleado"
                className="firma-imagen"
              />
            ) : (
              <p>Firma no disponible</p>
            )}
          </div>
        </div>
            <svg
              width="1829"
              height="5"
              viewBox="0 0 1829 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="-2.18557e-07"
                y1="2.5"
                x2="1829"
                y2="2.49984"
                stroke="#8EA3BF"
                strokeWidth="5"
              />
            </svg>
            <div className="remito-button-container">
              <button style={{width:'100%'}} onClick={handlePrint}>Imprimir</button>
            </div>
            <div className="remito-button-container">
            <button style={{width:'100%'}} onClick={handleRedirect}>Volver</button>
            </div>
        
          </div>
          
        </div>
      </div>
    </IonContent>
    
  );
};

export default RemitoOrden;
