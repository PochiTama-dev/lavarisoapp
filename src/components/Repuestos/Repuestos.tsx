import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
} from "@ionic/react";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./Repuestos.css";
import { useOrden } from "../../pages/Orden/ordenContext";
interface Repuesto {
  id: any;
  descripcion: string;
  nombre: string;
  cantidad: number;
}

interface RepuestosProps {
  estadoOrden?: "taller" | "visita";
}

interface LocationState {
  ordenSeleccionada: any; 
}

const Repuestos: React.FC<RepuestosProps> = ({ estadoOrden = "taller" }) => {
  const history = useHistory();
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [selectedRepuestos, setSelectedRepuestos] = useState<Repuesto[]>([]);
  const location = useLocation<LocationState>();
  
  const { ordenSeleccionada } = useOrden();
console.log(ordenSeleccionada)
  useEffect(() => {
    const fetchRepuestos = async () => {
      try {
        const responseRepuestos = await fetch("https://lv-back.online/repuestos/lista");
        const repuestosData: Repuesto[] = await responseRepuestos.json();
        
        const responseStock = await fetch("https://lv-back.online/stock/taller/lista");
        const stockData = await responseStock.json();
        
        if (repuestosData.length > 0 && stockData.length > 0) {
          // Combina los datos de repuestos con el stock
          const combinedData = repuestosData.map(repuesto => {
            const stockItem = stockData.find((item: { id: any; }) => item.id === repuesto.id);
            return {
              ...repuesto,
              cantidad: stockItem ? stockItem.cantidad : 0
            };
          });

          setRepuestos(combinedData);
          console.log(combinedData)
        } else {
          console.log("No se encontraron repuestos o stock en la base de datos.");
        }
      } catch (error) {
        console.error("Error al cargar repuestos o stock:", error);
      }
    };

    fetchRepuestos();
  }, []);
  const handleAddRepuesto = (index: number) => {
    const newRepuestos = [...repuestos];
    newRepuestos[index].cantidad -= 1;
    setRepuestos(newRepuestos);

    const nombre = newRepuestos[index].descripcion;
    const foundIndex = selectedRepuestos.findIndex((r) => r.descripcion === nombre);
    if (foundIndex !== -1) {
      const updatedRepuesto = { ...selectedRepuestos[foundIndex] };
      updatedRepuesto.cantidad += 1;
      const updatedSelected = [...selectedRepuestos];
      updatedSelected[foundIndex] = updatedRepuesto;
      setSelectedRepuestos(updatedSelected);
    } else {
      setSelectedRepuestos([
        ...selectedRepuestos,
        { ...newRepuestos[index], cantidad: 1 },
      ]);
    }
  };
  const handleRemoveRepuesto = (index: number) => {
    const newRepuestos = [...repuestos];
    const nombre = newRepuestos[index].nombre;
  
  
    let updatedSelected = [...selectedRepuestos];
    const foundIndex = selectedRepuestos.findIndex((r) => r.nombre === nombre);
    if (foundIndex !== -1) {
      const updatedRepuesto = { ...selectedRepuestos[foundIndex] };
      updatedRepuesto.cantidad -= 1;
      if (updatedRepuesto.cantidad === 0) {
        updatedSelected.splice(foundIndex, 1);
      } else {
        updatedSelected[foundIndex] = updatedRepuesto;
      }
      setSelectedRepuestos(updatedSelected);
    }
  
    // Decrement quantity in repuestos after updating selectedRepuestos
    if (newRepuestos[index].cantidad > 0) {
      newRepuestos[index].cantidad += 1;
      setRepuestos(newRepuestos);
    }
  };
  

  const renderRepuestos = () => (
    <>
      <div className="container-listado-respuestos">
        <IonList className="listado-respuestos">
          {repuestos.map((repuesto, index) => (
            <IonItem key={index}>
              <IonLabel>{repuesto.descripcion}</IonLabel>
              <IonButtons slot="end">
                <IonLabel
                  className={repuesto.cantidad > 0 ? "repuesto-incrementado" : ""}
                >
                  {repuesto.cantidad}
                </IonLabel>
                <IonButton onClick={() => handleAddRepuesto(index)}>+</IonButton>
                <IonButton onClick={() => handleRemoveRepuesto(index)}>-</IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </div>
      <IonItem className="listado-seleccionados">
        <IonLabel className="subtitle-listado-seleccionados">Seleccionado:</IonLabel>
      </IonItem>
      <IonList>
        {selectedRepuestos.map((repuesto, index) => (
          <IonItem key={index}>
            <IonLabel>{repuesto.descripcion}</IonLabel>
            <IonLabel>{repuesto.cantidad}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </>
  );

const handleConfirm = () => {
  history.push({
    pathname: "/tallerOrden",
    state: { selectedRepuestos,ordenSeleccionada }
  });
};
console.log(selectedRepuestos)

  return (
    <IonContent className="repuestos-container">
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      <div>
        <h1 className="title-repuestos">Gestión de repuestos</h1>
        <h2 className="subtitle-repuestos">
          {estadoOrden === "visita" ? "Repuestos en camioneta" : "Repuestos en taller"}
        </h2>
      </div>

      {renderRepuestos()}
      {estadoOrden === "taller" && (
        <div className="container-confirm-button">
          <IonButton className="confirm-button" onClick={handleConfirm}>
            Confirmar
          </IonButton>
        </div>
      )}
    </IonContent>
  );
};

export default Repuestos;
