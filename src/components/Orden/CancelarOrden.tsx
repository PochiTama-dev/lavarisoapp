import { IonButton, IonContent, IonHeader } from '@ionic/react';
import HeaderGeneral from '../Header/HeaderGeneral';
import './ConfirmacionOrden.css';
import ModalCancelacionComponent from './ModalCancel';
import { useState } from 'react';

function CancelacionOrdenComponent() {
  const [modal, setModal] = useState(false);

  const numeroOrden = '#25645';

  const handleModal = () => {
    setModal(!modal);
  };
  return (
    <IonContent className='confirmacion-orden-container'>
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      <div className='confirmacion-orden-top-box'>
        <h1>
          <strong>Cancelar Orden</strong>
        </h1>
        <h3>La orden de trabajo No.{numeroOrden} está por cancelarse</h3>
      </div>
      <div className='confirmacion-orden-medium-box'>
        <textarea name='' id='' placeholder='Detalles del incumplimiento' rows={10}></textarea>
        <IonButton onClick={handleModal}>Cancelar orden</IonButton>
      </div>
      {modal && <ModalCancelacionComponent />}
    </IonContent>
  );
}

export default CancelacionOrdenComponent;
