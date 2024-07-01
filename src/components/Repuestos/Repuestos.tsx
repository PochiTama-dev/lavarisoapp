import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
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

interface Repuesto {
  descripcion: string;
  nombre: string;
  cantidad: number;
}

interface RepuestosProps {
  estadoOrden?: "taller" | "visita";
}

const Repuestos: React.FC<RepuestosProps> = ({ estadoOrden = "taller" }) => {
  const history = useHistory();
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [selectedRepuestos, setSelectedRepuestos] = useState<Repuesto[]>([]);

  useEffect(() => {
    const fetchRepuestos = async () => {
      try {
        const response = await fetch("https://lv-back.online/repuestos/lista");
        const repuestosData: Repuesto[] = await response.json();
        if (repuestosData.length > 0) {
          setRepuestos(repuestosData);
        } else {
          console.log("No se encontraron repuestos en la base de datos.");
        }
      } catch (error) {
        console.error("Error al cargar repuestos:", error);
      }
    };

    fetchRepuestos();
  }, []);

  const handleAddRepuesto = (index: number) => {
    const newRepuestos = [...repuestos];
    newRepuestos[index].cantidad += 1;
    setRepuestos(newRepuestos);

    const nombre = newRepuestos[index].nombre;
    const foundIndex = selectedRepuestos.findIndex((r) => r.nombre === nombre);
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
    if (newRepuestos[index].cantidad > 0) {
      newRepuestos[index].cantidad -= 1;
      setRepuestos(newRepuestos);

      const nombre = newRepuestos[index].nombre;
      const foundIndex = selectedRepuestos.findIndex((r) => r.nombre === nombre);
      if (foundIndex !== -1) {
        const updatedRepuesto = { ...selectedRepuestos[foundIndex] };
        updatedRepuesto.cantidad -= 1;
        const updatedSelected = [...selectedRepuestos];
        if (updatedRepuesto.cantidad === 0) {
          updatedSelected.splice(foundIndex, 1);
        } else {
          updatedSelected[foundIndex] = updatedRepuesto;
        }
        setSelectedRepuestos(updatedSelected);
      }
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
    history.push("/tallerOrden"); // Navega a la ruta /tallerOrden
  };

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
