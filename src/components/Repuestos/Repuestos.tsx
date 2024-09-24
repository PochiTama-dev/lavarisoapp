// Repuestos.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonButton, IonButtons, IonToast } from "@ionic/react";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./Repuestos.css";
import { useOrden } from "../../pages/Orden/ordenContext";
import { fetchRepuestos, getRepuestosOrdenById, modificarStockPrincipal, modificarStockCamioneta } from "./FetchsRepuestos";

interface Repuesto {
    id: any;
    nombre: ReactNode;
    cantidad: number;
    StockPrincipal: any;
    id_repuesto: any;
    
  }

interface RepuestosProps {
 estadoOrden?: "taller" | "visita";
}

interface LocationState {
 ordenSeleccionada: any;
}

const Repuestos: React.FC<RepuestosProps> = ({ estadoOrden }) => {
 const history = useHistory();
 const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
 const [showToast, setShowToast] = useState(false);
 const { selectedRepuestos, setSelectedRepuestos, selectedRepuestosTaller, setSelectedRepuestosTaller } = useOrden();
 const location = useLocation<LocationState>();

 const currentEstadoOrden = estadoOrden || localStorage.getItem("estadoOrden") || "taller";
 const [ordenId, setOrdenId] = useState<number | null>(null);

 useEffect(() => {
  if (location.state?.ordenSeleccionada) {
   setOrdenId(location.state.ordenSeleccionada.id);
   setSelectedRepuestos([]);
   setSelectedRepuestosTaller([]);
  }
 }, [location.state]);

useEffect(() => {
  const fetchRepuestosData = async () => {
    const idEmpleado = localStorage.getItem("empleadoId") || "";  
    try {
      const repuestosData = await fetchRepuestos(currentEstadoOrden, idEmpleado);
      setRepuestos(repuestosData);
    } catch (error) {
      console.error("Error al obtener repuestos:", error);
    }
  };

  fetchRepuestosData();
}, [currentEstadoOrden]);






 const updateRepuestoCantidad = async (id: number, nuevaCantidad: number) => {
  const repuestoActualizado = { cantidad: nuevaCantidad };

  try {
   if (currentEstadoOrden === "visita") {
    await modificarStockCamioneta(id, repuestoActualizado);
   } else {
    await modificarStockPrincipal(id, repuestoActualizado);
   }
  } catch (error) {
   console.error("Error al actualizar la cantidad del repuesto:", error);
  }
 };

 const handleAddRepuesto = (index: number) => {
  const repuestoToAdd = repuestos[index];
  if (repuestoToAdd.cantidad <= 0) {
   console.log("No se puede agregar, la cantidad es cero.");
   return;
  }

  const exists =
   currentEstadoOrden === "taller"
    ? selectedRepuestosTaller.find((repuesto) => repuesto.id_repuesto == repuestoToAdd.id_repuesto)
    : selectedRepuestos.find((repuesto) => repuesto.id_repuesto == repuestoToAdd.id_repuesto);

  const updatedSelectedRepuestos = currentEstadoOrden === "taller" ? setSelectedRepuestosTaller : setSelectedRepuestos;

  if (!exists) {
    // @ts-ignore
   updatedSelectedRepuestos((prev) => [...prev, { ...repuestoToAdd, cantidad: 1 }]);
  } else {
    // @ts-ignore
   updatedSelectedRepuestos((prev) => prev.map((repuesto) => (repuesto.id_repuesto === repuestoToAdd.id_repuesto ? { ...repuesto, cantidad: repuesto.cantidad + 1 } : repuesto)));
  }

  updateRepuestoCantidad(repuestoToAdd.id, repuestoToAdd.cantidad - 1);

  setRepuestos((prevState) => prevState.map((repuesto) => (repuesto.id_repuesto === repuestoToAdd.id_repuesto ? { ...repuesto, cantidad: repuesto.cantidad - 1 } : repuesto)));
 };







 



 const handleRemoveRepuesto = (id_repuesto: number) => {
  const repuestoToRemove =
   currentEstadoOrden === "taller" ? selectedRepuestosTaller.find((repuesto) => repuesto.id_repuesto == id_repuesto) : selectedRepuestos.find((repuesto) => repuesto.id_repuesto == id_repuesto);

  if (!repuestoToRemove) {
   console.error("Repuesto no encontrado.");
   return;
  }

  const updatedSelectedRepuestos = currentEstadoOrden === "taller" ? setSelectedRepuestosTaller : setSelectedRepuestos;

  const repuestoOriginal = repuestos.find((repuesto) => repuesto.id_repuesto === id_repuesto);
  if (!repuestoOriginal) {
   console.error("El repuesto no se encuentra en la lista de stock disponible.");
   return;
  }

  updateRepuestoCantidad(repuestoToRemove.id, repuestoOriginal.cantidad + 1);

  setRepuestos((prevState) => prevState.map((repuesto) => (repuesto.id_repuesto === id_repuesto ? { ...repuesto, cantidad: repuesto.cantidad + 1 } : repuesto)));

  if (repuestoToRemove.cantidad > 1) {
    // @ts-ignore
   updatedSelectedRepuestos((prev) => prev.map((repuesto) => (repuesto.id_repuesto === repuestoToRemove.id_repuesto ? { ...repuesto, cantidad: repuesto.cantidad - 1 } : repuesto)));
  } else {
    // @ts-ignore
   updatedSelectedRepuestos((prev) => prev.filter((repuesto) => repuesto.id_repuesto !== repuestoToRemove.id_repuesto));
  }
 };



 const handleConfirm = () => {
  if (currentEstadoOrden === "taller") {
   history.push("/tallerorden");
  } else {
   history.goBack();
  }
 };

 const renderRepuestos = () => (
  <>
   <div className='container-listado-respuestos'>
    <IonList className='listado-respuestos'>
     {repuestos.map((repuesto, index) => (
      <IonItem key={index}>
       <IonLabel>{currentEstadoOrden === "visita" ? repuesto.StockPrincipal.nombre : repuesto.nombre}</IonLabel>
       <IonButtons slot='end'>
        <IonLabel className={repuesto.cantidad > 0 ? "repuesto-incrementado" : ""}>{repuesto.cantidad}</IonLabel>
        <IonButton onClick={() => handleAddRepuesto(index)}>+</IonButton>
        <IonButton onClick={() => handleRemoveRepuesto(repuesto.id_repuesto)}>-</IonButton>
       </IonButtons>
      </IonItem>
     ))}
    </IonList>
   </div>
   <IonItem className='listado-seleccionados'>
    <IonLabel className='subtitle-listado-seleccionados'>Seleccionado:</IonLabel>
   </IonItem>
   <IonList>
    {(currentEstadoOrden === "taller" ? selectedRepuestosTaller : selectedRepuestos).map((repuesto, index) => (
     <IonItem key={index}>
      <IonLabel>{currentEstadoOrden === "visita" ? repuesto.StockPrincipal.nombre : repuesto.nombre}</IonLabel>
      <IonLabel>{repuesto.cantidad}</IonLabel>
     </IonItem>
    ))}
   </IonList>
   <IonButton onClick={handleConfirm}>Confirmar Selección</IonButton>
   <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message='Repuestos confirmados con éxito.' duration={2000} />
  </>
 );

 return (
  <IonContent>
   <IonHeader>
    <HeaderGeneral />
   </IonHeader>
   {renderRepuestos()}
  </IonContent>
 );
};

export default Repuestos;
