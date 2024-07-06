import { IonButton, IonContent, IonModal } from "@ionic/react";
import "./ConfirmacionOrden.css";
import HeaderGeneral from "../Header/HeaderGeneral";

interface ModalCancelacionComponentProps {
  onCancel: () => void;
  onClose: () => void;
}

const ModalCancelacionComponent: React.FC<ModalCancelacionComponentProps> = ({
  onCancel,
  onClose,
}) => {
  return (
    <IonModal
      isOpen={true}
      onDidDismiss={onClose}
      className="confirmacion-orden-container"
    >
      <div className="confirmacion-orden-top-box">
        <h1>
          <strong>Cancelar Orden</strong>
        </h1>
      </div>
      <div className="confirmacion-orden-medium-box">
        <h3>Se encuentra a punto de cancelar la orden numero 25645</h3>
        <h3>¿Desea continuar?</h3>
        <IonButton onClick={onCancel}>Sí, cancelar</IonButton>
        <IonButton onClick={onClose}>No, cerrar</IonButton>
      </div>
    </IonModal>
  );
};

export default ModalCancelacionComponent;
