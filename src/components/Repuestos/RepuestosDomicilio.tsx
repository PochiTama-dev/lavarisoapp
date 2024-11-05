import React, { useState, useEffect, ReactNode } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonButton, IonButtons, IonToast } from "@ionic/react";
import HeaderGeneral from "../Header/HeaderGeneral";
import { useOrden } from "../../Provider/Provider";
import { modificarStockCamioneta, getRepuestosOrdenById } from "./FetchsRepuestos";
import "./Repuestos.css";

interface Repuesto {
 id: any;
 id_repuesto: any;
 nombre: ReactNode;
 cantidad: number;
 StockPrincipal: any;
 id_camioneta: any;
}

const RepuestosDomicilio: React.FC = () => {
 const history = useHistory();
 const [repuestosOrden, setRepuestosOrden] = useState<Repuesto[]>([]);
 const [showToast, setShowToast] = useState(false);
 const { selectedRepuestos, setSelectedRepuestos, repuestosCamioneta, setRepuestosCamioneta, cargarRepuestosCamioneta } = useOrden();
 const location = useLocation();
 const [ordenId, setOrdenId] = useState<number | null>(null);

 useEffect(() => {
  const fetchRepuestosOrdenData = async () => {
   if (ordenId) {
    try {
     const repuestosOrdenData = await getRepuestosOrdenById(ordenId);
     setRepuestosOrden(repuestosOrdenData);
    } catch (error) {
     console.error("Error al obtener los repuestos de la orden:", error);
    }
   }
  };
  fetchRepuestosOrdenData();
 }, [ordenId]);

 
 const handleAddRepuesto = (index: number) => {
  const repuestoToAdd = repuestosCamioneta[index];
  if (repuestoToAdd.cantidad <= 0) {
   console.log("No se puede agregar, la cantidad es cero.");
   return;
  }

  const exists = selectedRepuestos.find((repuesto) => repuesto.id === repuestoToAdd.id);

  if (!exists) {   //@ts-ignore
   setSelectedRepuestos((prev) => [...prev, { ...repuestoToAdd, cantidad: 1 }]);
  } else {   //@ts-ignore
   setSelectedRepuestos((prev) => prev.map((repuesto) => (repuesto.id === repuestoToAdd.id ? { ...repuesto, cantidad: repuesto.cantidad + 1 } : repuesto)));
  }

  setRepuestosCamioneta((prevState) => prevState.map((repuesto) => (repuesto.id === repuestoToAdd.id ? { ...repuesto, cantidad: repuesto.cantidad - 1 } : repuesto)));
 };

 const handleRemoveRepuesto = (id: number) => {
  const repuestoToRemove = selectedRepuestos.find((repuesto) => repuesto.id === id);

  if (!repuestoToRemove) {
   console.error("Repuesto no encontrado.");
   return;
  }

  setRepuestosCamioneta((prevState) => prevState.map((repuesto) => (repuesto.id === id ? { ...repuesto, cantidad: repuesto.cantidad + 1 } : repuesto)));

  if (repuestoToRemove.cantidad > 1) {
    //@ts-ignore
   setSelectedRepuestos((prev) => prev.map((repuesto) => (repuesto.id === repuestoToRemove.id ? { ...repuesto, cantidad: repuesto.cantidad - 1 } : repuesto)));
  } else {
   //@ts-ignore
    setSelectedRepuestos((prev) => prev.filter((repuesto) => repuesto.id !== repuestoToRemove.id));
  }
 };

 const handleConfirmar = async () => {
 
   history.goBack();
 
 };

 const renderRepuestos = () => (
  <>
<div className='container-listado-respuestos'>
    <IonList className='listado-respuestos'>
        {repuestosCamioneta && repuestosCamioneta.length > 0 ? (
            repuestosCamioneta.map((repuesto, index) => (
                <IonItem key={index}>
                    <IonLabel>
                        {repuesto.StockPrincipal?.nombre ? repuesto.StockPrincipal.nombre : repuesto.nombre}
                    </IonLabel>
                    <IonButtons slot='end'>
                        <IonLabel className={repuesto.cantidad > 0 ? "repuesto-incrementado" : ""}>
                            {repuesto.cantidad}
                        </IonLabel>
                        <IonButton onClick={() => handleAddRepuesto(index)}>+</IonButton>
                        <IonButton onClick={() => handleRemoveRepuesto(repuesto.id)}>-</IonButton>
                    </IonButtons>
                </IonItem>
            ))
        ) : (
            <IonItem>
                <IonLabel>No hay repuestos disponibles.</IonLabel>
            </IonItem>
        )}
    </IonList>
</div>

   <IonItem className='listado-seleccionados'>
    <IonLabel className='subtitle-listado-seleccionados'>Seleccionado:</IonLabel>
   </IonItem>
   <IonList>
    {selectedRepuestos && selectedRepuestos.length > 0 ? (
     selectedRepuestos.map((repuesto, index) => (
      <IonItem key={index}>
             {repuesto.StockPrincipal?.nombre ? repuesto.StockPrincipal.nombre : repuesto.nombre}
       <IonLabel style={{marginLeft:'20px'}}> x{repuesto.cantidad}</IonLabel>
      </IonItem>
     ))
    ) : (
     <IonItem>
      <IonLabel>No se han seleccionado repuestos.</IonLabel>
     </IonItem>
    )}
   </IonList>
  </>
 );

 return (
  <>
   <IonHeader>
    <HeaderGeneral />
   </IonHeader>
   <IonContent className='general-content'>
    <IonButton onClick={handleConfirmar}>Confirmar</IonButton>
    {renderRepuestos()}
    <IonToast isOpen={showToast} onDidDismiss={() => setShowToast(false)} message='Repuesto eliminado correctamente.' duration={1000} />
   </IonContent>
  </>
 );
};

export default RepuestosDomicilio;
