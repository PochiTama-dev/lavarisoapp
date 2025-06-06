import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonInput, IonItem, IonButton, IonList } from '@ionic/react';
import { useState } from 'react';

const NotaCompra = () => {
  const [factura, setFactura] = useState<{
    facturaNro: string;
    items: string[];
  }>({
    facturaNro: '',
    items: [],
  });
  const [repuesto, setRepuesto] = useState('');

  const agregarRepuesto = () => {
    if (repuesto.trim() !== '') {
      setFactura((prevFactura) => ({
        ...prevFactura,
        items: [...prevFactura.items, repuesto],
      }));
      setRepuesto(''); // Limpiar el campo
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nota de Compra</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position='floating'>Ingrese número de factura</IonLabel>
          <IonInput
            type='text'
            value={factura.facturaNro}
            onIonChange={(e) =>
              setFactura((prevFactura) => ({
                ...prevFactura,
                facturaNro: e.detail.value!,
              }))
            }
          />
        </IonItem>

        <IonItem>
          <IonLabel position='floating'>Ingrese repuestos</IonLabel>
          <IonInput type='text' value={repuesto} onIonChange={(e) => setRepuesto(e.detail.value!)} />
        </IonItem>
        <IonButton expand='block' onClick={agregarRepuesto}>
          Agregar Nota
        </IonButton>

        <IonList>
          {factura.items.map((item, index) => (
            <IonItem key={index}>{item}</IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default NotaCompra;
