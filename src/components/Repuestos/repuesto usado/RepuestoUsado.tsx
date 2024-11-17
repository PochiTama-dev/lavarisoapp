import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonInput, IonItem, IonButton, IonList } from '@ionic/react';
import { useState } from 'react';

const RepuestoUsado = () => {
  const [repuesto, setRepuesto] = useState();

  const agregarRepuesto = () => {};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repuestos Usados</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position='floating'>Ingrese repuestos</IonLabel>
          <IonInput type='text' value={repuesto} onIonChange={(e) => setRepuesto(e.detail.value!)} />
        </IonItem>
        <IonButton expand='block' onClick={agregarRepuesto}>
          Agregar Repuesto
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RepuestoUsado;
