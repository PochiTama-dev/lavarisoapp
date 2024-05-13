import { IonButton, IonContent } from '@ionic/react';
import HeaderGeneral from '../Header/HeaderGeneral';
import './ConfirmacionOrden.css';

function ModalCancelacionComponent() {
  return (
    <IonContent className='confirmacion-orden-container'>
      <div className='confirmacion-orden-top-box'>
        <h1>
          <strong>Cancelar Orden</strong>
        </h1>
      </div>
      <div className='confirmacion-orden-medium-box'>
        <h3>Se encuentra a punto de cancelar la orden numero 25645</h3>
        <h3>¿Desea continuar?</h3>
        <IonButton>Si, cancelar orden</IonButton>
      </div>
    </IonContent>
  );
}

export default ModalCancelacionComponent;
