import React, { useState, useEffect, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonButton, IonButtons, IonToast, IonAlert } from "@ionic/react";
import HeaderGeneral from "../Header/HeaderGeneral";
import { useOrden } from "../../Provider/Provider";
import { listaStockPrincipal, guardarStockReserva } from "./FetchsRepuestos";
import ReservasModal from "./ReservasModal"; // Importar el modal

interface Repuesto {
  id_repuesto_taller: any;
  id: any;
  nombre: ReactNode;
  cantidad: number;
  StockPrincipal: any;
  id_repuesto: any;
  precio: number;
  lote: string;
}

const RepuestosTaller: React.FC = () => {
  const history = useHistory();
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const { selectedRepuestosTaller, setSelectedRepuestosTaller } = useOrden();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Estado para manejar el IonAlert
  const [showReservasModal, setShowReservasModal] = useState(false); // Estado para manejar el modal

  useEffect(() => {
    const loadRepuestos = async () => {
      try {
        const repuestosStock = await listaStockPrincipal();
        setRepuestos(repuestosStock);
      } catch (error) {
        console.error("Error al cargar los repuestos:", error);
      }
    };

    loadRepuestos();
  }, []);

  const handleAddRepuesto = (index: number) => {
    const repuestoToAdd = repuestos[index];
    if (repuestoToAdd.cantidad <= 0) return;

    const exists = selectedRepuestosTaller.find((repuesto) => repuesto.id_repuesto === repuestoToAdd.id_repuesto);

    if (!exists) {
      //@ts-ignore
      setSelectedRepuestosTaller((prev) => [...prev, { ...repuestoToAdd, cantidad: 1 }]);
    } else {
      //@ts-ignore
      setSelectedRepuestosTaller((prev) =>
        prev.map((repuesto: { id_repuesto: any; cantidad: number }) => (repuesto.id_repuesto === repuestoToAdd.id_repuesto ? { ...repuesto, cantidad: repuesto.cantidad + 1 } : repuesto))
      );
    }

    setRepuestos((prevState) => prevState.map((repuesto) => (repuesto.id_repuesto === repuestoToAdd.id_repuesto ? { ...repuesto, cantidad: repuesto.cantidad - 1 } : repuesto)));
  };

  const handleRemoveRepuesto = (id_repuesto: number) => {
    const repuestoToRemove = selectedRepuestosTaller.find((repuesto) => repuesto.id_repuesto === id_repuesto);
    if (!repuestoToRemove) return;

    const repuestoOriginal = repuestos.find((repuesto) => repuesto.id_repuesto === id_repuesto);
    if (!repuestoOriginal) return;

    setRepuestos((prevState) => prevState.map((repuesto) => (repuesto.id_repuesto === id_repuesto ? { ...repuesto, cantidad: repuesto.cantidad + 1 } : repuesto)));

    if (repuestoToRemove.cantidad > 1) {
      //@ts-ignore
      setSelectedRepuestosTaller((prev) =>
        prev.map((repuesto: { id_repuesto: any; cantidad: number }) => (repuesto.id_repuesto === repuestoToRemove.id_repuesto ? { ...repuesto, cantidad: repuesto.cantidad - 1 } : repuesto))
      );
    } else {
      //@ts-ignore
      setSelectedRepuestosTaller((prev) => prev.filter((repuesto: { id_repuesto: number }) => repuesto.id_repuesto !== id_repuesto));
    }
  };

  const calcularTotal = () => {
    return selectedRepuestosTaller.reduce((total, repuesto) => {
      return total + repuesto.precio * repuesto.cantidad;
    }, 0);
  };

  const handleConfirm = () => {
    setShowAlert(true); // Muestra el IonAlert
  };

  const confirmReservation = async () => {
    const id_tecnico = localStorage.getItem("empleadoId");
    console.log("ID Técnico desde localStorage:", id_tecnico); // Para depuración

    if (!id_tecnico) {
      console.error("ID del técnico no encontrado en el localStorage.");
      return;
    }

    for (const repuesto of selectedRepuestosTaller) {
      const stockReserva = {
        id_tecnico: id_tecnico,
        id_repuesto: repuesto.id_repuesto,
        cantidad: repuesto.cantidad,
        lote: repuesto.lote,
      };

      console.log("Enviando StockReserva:", stockReserva); // Para depuración

      const success = await guardarStockReserva(stockReserva);
      if (success) {
        setToastMessage("Repuesto reservado con éxito."); // Mensaje de éxito
        setShowToast(true);

        // Guardar la reserva en el localStorage
        const reservas = JSON.parse(localStorage.getItem("reservas") || "[]");
        reservas.push(stockReserva);
        localStorage.setItem("reservas", JSON.stringify(reservas));
      } else {
        console.error("Error al reservar el repuesto", repuesto.nombre);
      }
    }

    setShowAlert(false); // Ocultar el IonAlert después de confirmar
  };

  const renderRepuestos = () => (
    <>
      <div className="container-listado-respuestos">
        <IonList className="listado-respuestos">
          {repuestos.map((repuesto, index) => (
            <IonItem key={index}>
              <IonLabel>{repuesto.nombre}</IonLabel>
              <IonLabel>${repuesto.precio}</IonLabel>
              <IonButtons slot="end">
                <IonLabel className={repuesto.cantidad > 0 ? "repuesto-incrementado" : ""}>{repuesto.cantidad}</IonLabel>
                <IonButton onClick={() => handleAddRepuesto(index)}>+</IonButton>
                <IonButton onClick={() => handleRemoveRepuesto(repuesto.id_repuesto)}>-</IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </div>

      <IonItem className="listado-seleccionados">
        <IonLabel className="subtitle-listado-seleccionados">Seleccionado:</IonLabel>
      </IonItem>
      <IonList>
        {selectedRepuestosTaller.map((repuesto, index) => (
          <IonItem key={index}>
            <IonLabel>{repuesto.nombre}</IonLabel>
            <IonLabel>{repuesto.cantidad}</IonLabel>
          </IonItem>
        ))}
      </IonList>

      <IonItem className="total-container">
        <IonLabel>Total:</IonLabel>
        <IonLabel>${calcularTotal()}</IonLabel>
      </IonItem>
    </>
  );

  return (
    <IonContent>
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      {renderRepuestos()}
      <IonButton expand="full" onClick={handleConfirm}>
        Confirmar
      </IonButton>
      <IonButton expand="full" onClick={() => setShowReservasModal(true)}>
        Reservas realizadas
      </IonButton>
      <IonToast isOpen={showToast} message={toastMessage} duration={2000} onDidDismiss={() => setShowToast(false)} />
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Confirmar Reserva"}
        message={"¿Está seguro de que desea confirmar la reserva de los repuestos seleccionados?"}
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            handler: () => {
              console.log("Reserva cancelada");
            },
          },
          {
            text: "Confirmar",
            handler: confirmReservation, // Llama a la función de confirmación
          },
        ]}
      />
      <ReservasModal isOpen={showReservasModal} onClose={() => setShowReservasModal(false)} /> {/* Usar el modal */}
    </IonContent>
  );
};

export default RepuestosTaller;
