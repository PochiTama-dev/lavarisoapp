import React, { useEffect, useState } from "react";
import "./Remito.css";
import { IonContent } from "@ionic/react";
import { useOrden } from "../../Provider/Provider";
import { useHistory } from "react-router-dom";

import GaleriaFotos from "./GaleriaFotos";
import { getFotosNumeroOrden } from "../Fotos/fetchs";
import logo from "/assets/logo-service.png";
interface Repuesto {
 id: number;
 nombre: string;
 cantidad: number;
}
const RemitoOrden = () => {
 const { ordenActiva } = useOrden();
 const [mediosDePago, setMediosDePago] = useState([]);
 const [medioDePagoNombre, setMedioDePagoNombre] = useState("");
 const [fotosDiagnostico, setFotosDiagnostico] = useState([]);
 const [fotosEntrega, setFotosEntrega] = useState([]);
 const history = useHistory();

 const [repuestosOrden, setRepuestosOrden] = useState<Repuesto[]>([]);
 useEffect(() => {
  const fetchFotos = async () => {
   try {
    const fotosOrden = await getFotosNumeroOrden(ordenActiva.id);

    const fotosEntrega = fotosOrden.filter((foto: { isEntrega: any }) => foto.isEntrega);
    const fotosDiagnostico = fotosOrden.filter((foto: {
      isFactura: any; isEntrega: any 
}) => !foto.isEntrega && !foto.isFactura);

    console.log("Fotos de la Entrega:", fotosEntrega);
    console.log("Fotos del Diagnóstico:", fotosDiagnostico);

    setFotosEntrega(fotosEntrega);
    setFotosDiagnostico(fotosDiagnostico);
   } catch (error) {
    console.error("Error al obtener las fotos de la orden:", error);
   }
  };

  fetchFotos();
 }, [ordenActiva]);

 const getRepuestosOrdenById = async (id: any) => {
  const API_URL = "https://lv-back.online/orden/repuestos";

  try {
   const response = await fetch(`${API_URL}/${id}`);
   if (!response.ok) throw new Error("Error al obtener los repuestos de la orden");
   const data = await response.json();
   return data;
  } catch (error) {
   console.error(error);
   throw error;
  }
 };

 useEffect(() => {
  const fetchRepuestos = async () => {
   try {
    if (ordenActiva?.id) {
     const repuestos = await getRepuestosOrdenById(ordenActiva.id);
     console.log("Repuestos de la orden:", repuestos);
     setRepuestosOrden(repuestos);
    }
   } catch (error) {
    console.error("Error al cargar los repuestos de la orden:", error);
   }
  };

  fetchRepuestos();
 }, [ordenActiva]);

 useEffect(() => {
  if (ordenActiva && ordenActiva.Presupuesto && ordenActiva.Presupuesto.id_medio_de_pago) {
   console.log("Método de pago:", ordenActiva.Presupuesto.id_medio_de_pago);
  } else {
   console.log("No se encontró id_medio_de_pago en la ordenActiva");
  }
 }, [ordenActiva]);
 console.log("ordenActiva", ordenActiva);
 useEffect(() => {
  const fetchMediosDePago = async () => {
   try {
    const response = await fetch("https://lv-back.online/opciones/pago");
    const data = await response.json();
    console.log("Medios de pago disponibles:", data);
    if (data && data.length > 0) {
     setMediosDePago(data);
     const medio = data.find((m: { id: any }) => m.id === ordenActiva?.Presupuesto?.id_medio_de_pago);
     console.log("Medio de pago encontrado:", medio);
     if (medio) {
      setMedioDePagoNombre(medio.medio_de_pago || "");
     }
    }
   } catch (error) {
    console.error("Error, no se encontraron medios de pago en la base de datos....", error);
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

 const { id, Cliente = {}, Empleado = {}, equipo = "", modelo = "", antiguedad = "", diagnostico = "", motivo = "", Presupuesto = {} } = ordenActiva;

 const handlePrint = () => {
  window.print();
 };
 const handleRedirect = () => {
  if (location.pathname !== "/domicilio") {
   history.push("/domicilio");
  }
 };
 return (
  <IonContent className='remito'>
 
   <div className='remito-container'>
    <div className='remito-container-content'>
 
     <div className='remito-container-table'>
  
      <div>
        <div className='remito-head'>
        <img src={logo} alt="" /> 
       <h4 style={{marginBottom: "10px"}}>
        Orden <strong>#{id || ""}</strong>
     
       </h4>
       <h4>
        <strong>  {  new Date(ordenActiva.Entrega.created_at).toLocaleDateString() }</strong>
       </h4>

        </div>
        <h4 style={{marginBottom: "-15px"}}>
        Juan Garcia Martinez 65 local 3
       </h4>
       <h4 style={{marginBottom: "-15px"}}>
        CUIL/CUIT: 30-71794576-6
       </h4>
       <h4 style={{marginBottom: "-15px"}}>www.gruposervice.ar</h4>
       <h4  > TEL: 351-7061881</h4>
      </div>
     </div>
 
     <div className='remito-container-table'>
      <div>
       <h2>Cliente:</h2>
      </div>
      
       <h4>
        Nombre:{" "}
        <strong>
         {Cliente.nombre || ""} {Cliente.apellido || ""}
        </strong>
       </h4>
       <h4>
        CUIL: <strong>{Cliente.cuil || ""}</strong>
       </h4>
  
       <h4>
    
        Dirección: <strong>{Cliente.direccion || ""}</strong>{" "}
       </h4>
     
     </div>
 
     <div className='remito-container-table'>
      <div>
       <h2>Orden:</h2>
      </div>
      <div className='remito-details'>
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
        <strong>Reparaciones:</strong> {motivo || ""}
       </h4>
       <h4>
        <strong>Repuestos:</strong>
       </h4>
       <div>
        {repuestosOrden.map((repuesto) => (
         //@ts-ignore
         <h4 key={repuesto.id}>
          {repuesto.nombre} - Cantidad: {repuesto.cantidad}
         </h4>
        ))}
       </div>
      </div>
      </div>
 
       <div className="remito-container-table"> 
      <div className='remito-container-firmas'>
       <div className='firma-cliente'>
        <h4>Firmas del Cliente:</h4>
        <div
         style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          gap: "5px",
         }}
        >
         <div style={{ borderRight: "1px solid black" }}>
          <h6>Presupuesto:</h6>

          {ordenActiva.Presupuesto.firma_cliente ? <img src={`${ordenActiva.Presupuesto.firma_cliente}`} alt='Firma del Cliente' className='firma-imagen' /> : <p>Firma no disponible</p>}
         </div>
         <div>
          <h6>Entrega:</h6>

          {ordenActiva.Entrega?.firma_cliente ? <img src={`${ordenActiva.Entrega.firma_cliente}`} alt='Firma del Cliente' className='firma-imagen' /> : <p>Firma no disponible</p>}
         </div>
        </div>
       </div>

       <div className='firma-empleado'>
        <h4>Firmas del Empleado:</h4>
        <div
         style={{
          display: "flex",
          flexDirection: "row",
          width: "90%",
          gap: "5px",
         }}
        >
         <div style={{ borderRight: "1px solid black" }}>
          <h6>Presupuesto:</h6>
          {ordenActiva.Presupuesto.firma_empleado ? <img src={`${ordenActiva.Presupuesto.firma_empleado}`} alt='Firma del Empleado' className='firma-imagen' /> : <p>Firma no disponible</p>}
         </div>
         <div>
          <h6>Entrega:</h6>
          {ordenActiva.Entrega?.firma_empleado ? <img src={`${ordenActiva.Entrega.firma_empleado}`} alt='Firma del Empleado' className='firma-imagen' /> : <p>Firma no disponible</p>}
         </div>
        </div>
       </div>
      </div>
 

     </div>
     {(fotosDiagnostico.length > 0 || fotosEntrega.length > 0) && (
  <div className="remito-container-table"> 
    <h2>Fotos del Diagnóstico</h2>
    <GaleriaFotos fotos={fotosDiagnostico} />
    
    <h2>Fotos de la Entrega</h2>
    <GaleriaFotos fotos={fotosEntrega} />
  </div>
)}


      <div className="remito-container-table"> 
   
   <h2>Pago:</h2>
   <h4>
    Método de pago: <strong>{medioDePagoNombre || ""}</strong>
   </h4>
   <h4>
    TOTAL: <strong>${Presupuesto.total || ""}</strong>
   </h4>
   </div>
      <div className='remito-button-container'>
       <button onClick={handlePrint}>
        Enviar
       </button>
      </div>
      <div className='remito-button-container'>
       <button  onClick={handleRedirect}>
        Volver
       </button>
      </div>  


    </div>
   </div>
  </IonContent>
 );
};

export default RemitoOrden;
