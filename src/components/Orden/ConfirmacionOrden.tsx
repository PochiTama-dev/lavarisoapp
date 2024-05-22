import { IonButton, IonContent, IonHeader } from '@ionic/react';
import HeaderGeneral from '../Header/HeaderGeneral';
import './ConfirmacionOrden.css';
import mapa from '../../images/mapa.webp';
import { useState } from 'react';

function ConfirmacionOrdenComponent() {
  const numeroOrden = '#25645';
  const orden = {
    cliente: 'Martín Inchausti',
    telefono: 112345678,
    legajo: '0123456',
    direccion: 'Corrientes 654',
    precio: 17800,
  };

  return (
    <IonContent className='confirmacion-orden-container'>
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      <div className='confirmacion-orden-top-box'>
        <h1>
          <strong>Orden activa</strong>
        </h1>
        <h3>{numeroOrden}</h3>
      </div>
      <div className='confirmacion-orden-medium-box'>
        <h3>
          <strong>Datos del cliente</strong>
        </h3>
        <h4>
          <strong>Nombre:</strong> {orden.cliente}
        </h4>
        <h4>
          <strong>Teléfono:</strong> {orden.telefono}
        </h4>
        <h4>
          <strong>Legajo:</strong> {orden.legajo}
        </h4>
        <h4>
          <strong>Dirección:</strong> {orden.direccion}
        </h4>
        <img src={mapa} alt='mapa' />
        <IonButton href='entrega'>Entrega</IonButton>
        <IonButton>Facturación</IonButton>
      </div>
      <div className='confirmacion-orden-bottom-box'>
        <h4>Cotización</h4>
        <h3>${orden.precio}</h3>
        <button>Cerrar orden</button>
      </div>
    </IonContent>
  );
}

export default ConfirmacionOrdenComponent;
