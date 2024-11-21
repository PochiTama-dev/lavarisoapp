import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonInput, IonItem, IonButton, IonList } from '@ionic/react';
import { useState } from 'react';

const RepuestoUsado = () => {
  const [repuestos, setRepuestos] = useState<string[]>([]);
  const [nuevoRepuesto, setNuevoRepuesto] = useState<string>('');

  const agregarRepuesto = () => {
    if (nuevoRepuesto.trim() !== '') {
      setRepuestos((prevRepuestos) => [...prevRepuestos, nuevoRepuesto]);
      setNuevoRepuesto(''); // Limpiar el campo de entrada
    }
  };

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
          <IonInput
            type='text'
            value={nuevoRepuesto} // Vincula el estado del input
            onIonChange={(e) => setNuevoRepuesto(e.detail.value!)}
          />
        </IonItem>
        <IonButton expand='block' onClick={agregarRepuesto}>
          Agregar Repuesto
        </IonButton>
        <IonList>
          {repuestos.map((item, index) => (
            <IonItem key={index}>{item}</IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default RepuestoUsado;
