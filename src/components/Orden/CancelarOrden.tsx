import { IonButton, IonContent } from "@ionic/react";
import "./ConfirmacionOrden.css";
import ModalCancelacionComponent from "./ModalCancel";
import { useState } from "react";

interface CancelacionOrdenComponentProps {
  onCancel: () => void;
  // onClose: () => void;
}
const CancelacionOrdenComponent: React.FC<CancelacionOrdenComponentProps> = ({
  onCancel,
}) => {
  const [modal, setModal] = useState(false);
  const [detalles, setDetalles] = useState("");

  const numeroOrden = 1;

  const handleModal = () => {
    setModal(!modal);
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(
        `https://lv-back.online/ordenes/modificar/${numeroOrden}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_tipo_estado: 2, // 2 es el ID para el estado "cancelada"
            // motivo: detalles,
          }),
        }
      );

      if (response.ok) {
        alert("Orden cancelada exitosamente");
        setModal(false);
        // Actualiza el estado local o redirige si es necesario
      } else {
        alert("Error al cancelar la orden");
      }
    } catch (error) {
      console.error("Error al cancelar la orden:", error);
      alert("Error al cancelar la orden");
    }
  };
  return (
    <IonContent className="confirmacion-orden-container">
      <div className="confirmacion-orden-top-box">
        <h1>
          <strong>Cancelar Orden</strong>
        </h1>
        <h3>La orden de trabajo No.{numeroOrden} está por cancelarse</h3>
      </div>
      <div className="confirmacion-orden-medium-box">
        <textarea
          name=""
          id=""
          placeholder="Detalles del incumplimiento"
          rows={10}
        ></textarea>
        <IonButton onClick={handleCancelOrder}>Cancelar orden</IonButton>
      </div>
      {modal && (
        <ModalCancelacionComponent
          onCancel={handleCancelOrder}
          onClose={handleModal}
        />
      )}
    </IonContent>
  );
};

export default CancelacionOrdenComponent;
