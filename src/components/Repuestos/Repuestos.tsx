import React, { useState } from "react";
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

const Repuestos = ({ estadoOrden = "taller" }) => {
  const repuestosVisita = [
    { nombre: "Fuelle cambio lineal", cantidad: 1 },
    { nombre: "Repuesto B", cantidad: 0 },
    { nombre: "Repuesto C", cantidad: 0 },
    { nombre: "Repuesto D", cantidad: 0 },
    { nombre: "Repuesto E", cantidad: 0 },
  ];

  const initialRepuestosTaller = [
    { nombre: "Fuelle cambio lineal", cantidad: 0 },
    { nombre: "Repuesto B", cantidad: 0 },
    { nombre: "Repuesto C", cantidad: 0 },
    { nombre: "Repuesto D", cantidad: 0 },
    { nombre: "Repuesto E", cantidad: 0 },
    { nombre: "Repuesto F", cantidad: 0 },
    { nombre: "Repuesto G", cantidad: 0 },
  ];

  const [repuestosTaller, setRepuestosTaller] = useState(
    initialRepuestosTaller
  );
  const [selectedRepuestos, setSelectedRepuestos] = useState({});

  const handleAddRepuesto = (index) => {
    const newRepuestos = [...repuestosTaller];
    newRepuestos[index].cantidad += 1;
    setRepuestosTaller(newRepuestos);

    const selected = { ...selectedRepuestos };
    const nombre = newRepuestos[index].nombre;
    if (selected[nombre]) {
      selected[nombre] += 1;
    } else {
      selected[nombre] = 1;
    }
    setSelectedRepuestos(selected);
  };

  const handleRemoveRepuesto = (index) => {
    const newRepuestos = [...repuestosTaller];
    if (newRepuestos[index].cantidad > 0) {
      newRepuestos[index].cantidad -= 1;
      setRepuestosTaller(newRepuestos);

      const selected = { ...selectedRepuestos };
      const nombre = newRepuestos[index].nombre;
      if (selected[nombre] > 0) {
        selected[nombre] -= 1;
        if (selected[nombre] === 0) {
          delete selected[nombre];
        }
        setSelectedRepuestos(selected);
      }
    }
  };

  const renderRepuestosVisita = () => (
    <div className="container-listado-respuestos">
      <IonList className="listado-respuestos">
        {repuestosVisita.map((repuesto, index) => (
          <IonItem key={index}>
            <IonLabel>{repuesto.nombre}</IonLabel>
            <IonLabel slot="end">{repuesto.cantidad}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  );

  const renderRepuestosTaller = () => (
    <>
      <div className="container-listado-respuestos">
        <IonList className="listado-respuestos">
          {repuestosTaller.map((repuesto, index) => (
            <IonItem key={index}>
              <IonLabel>{repuesto.nombre}</IonLabel>
              <IonButtons slot="end">
                <IonLabel className={repuesto.cantidad > 0 ? 'repuesto-incrementado' : ''}>{repuesto.cantidad}</IonLabel>
                <IonButton onClick={() => handleAddRepuesto(index)}>
                  +
                </IonButton>
                <IonButton onClick={() => handleRemoveRepuesto(index)}>
                  -
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </div>
      <IonItem className="listado-seleccionados">
        <IonLabel className="subtitle-listado-seleccionados">
          Seleccionado:
        </IonLabel>
      </IonItem>
      <IonList>
        {Object.keys(selectedRepuestos).map((nombre, index) => (
          <IonItem key={index}>
            <IonLabel>{nombre}</IonLabel>
            <IonLabel>{selectedRepuestos[nombre]}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </>
  );

  return (
    <IonContent>
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      <IonToolbar>
        <IonTitle className="title-repuestos">Gestión de repuestos</IonTitle>
      </IonToolbar>
      <IonToolbar>
        <IonTitle className="subtitle-repuestos">
          {estadoOrden === "visita"
            ? "Repuestos en camioneta"
            : "Repuestos en taller"}
        </IonTitle>
      </IonToolbar>
      {estadoOrden === "visita"
        ? renderRepuestosVisita()
        : renderRepuestosTaller()}
      {estadoOrden === "taller" && (
        <div className="container-confirm-button">
          <IonButton className="confirm-button">Confirmar</IonButton>
        </div>
      )}
    </IonContent>
  );
};

export default Repuestos;
