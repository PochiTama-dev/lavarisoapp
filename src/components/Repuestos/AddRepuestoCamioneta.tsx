import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonLabel, IonButton, IonAlert } from '@ionic/react';
import HeaderGeneral from '../Header/HeaderGeneral';
import { guardarStockCamioneta } from './FetchsRepuestos';

const AddRepuestoCamioneta: React.FC = () => {
  const [nombreRepuesto, setNombreRepuesto] = useState<string>('');
  const [cantidad, setCantidad] = useState<number | undefined>(undefined);
  const [idEmpleado, setIdEmpleado] = useState<number | undefined>(undefined);  
  const [idRepuesto, setIdRepuesto] = useState<number | undefined>(undefined); 
  const [lote, setLote] = useState<string>('');  
  const [showAlert, setShowAlert] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const empleadoId = localStorage.getItem('empleadoId');
    if (empleadoId) {
        setIdEmpleado(parseInt(empleadoId, 10)); // Convertimos el id a número y lo almacenamos en el estado
    } else {
        setShowAlert({ success: false, message: 'Error: No se pudo obtener el ID del empleado.' });
    }
}, []);
    const handleAgregarRepuesto = async () => {
 
      if (!nombreRepuesto.trim()) {
        setShowAlert({ success: false, message: 'El nombre del repuesto no puede estar vacío.' });
        return; // Salir de la función si el nombre está vacío
    }

      const repuesto = {
          nombre: nombreRepuesto,
          cantidad: cantidad,
          id_empleado: idEmpleado,   
          id_repuesto: null,   
          lote: ""                
      };
// @ts-ignore
      const success = await guardarStockCamioneta(repuesto);

      if (success) {
          setShowAlert({ success: true, message: 'Repuesto agregado exitosamente al stock de la camioneta.' });
          setNombreRepuesto('');
          setCantidad(undefined);
          setIdEmpleado(undefined);
          setIdRepuesto(undefined);
          setLote('');
      } else {
          setShowAlert({ success: false, message: 'Error al agregar el repuesto al stock de la camioneta.' });
      }
  };
  return (
    <IonPage>
        <HeaderGeneral></HeaderGeneral>
        <IonContent className="ion-padding">
            <IonItem>
                <IonLabel position="stacked">Nombre del Repuesto</IonLabel>
                <IonInput
                    value={nombreRepuesto}
                    placeholder="Ingresa el nombre del repuesto"
                    onIonChange={e => setNombreRepuesto(e.detail.value!)}
                />
            </IonItem>

            <IonItem>
                <IonLabel position="stacked">Cantidad</IonLabel>
                <IonInput
                    type="number"
                    value={cantidad}
                    placeholder="Ingresa la cantidad"
                    onIonChange={e => setCantidad(parseInt(e.detail.value!, 10))}
                />
            </IonItem>
 
 

            <IonButton expand="block" onClick={handleAgregarRepuesto}>
                Agregar Repuesto
            </IonButton>

            {showAlert && (
                <IonAlert
                    isOpen={!!showAlert}
                    onDidDismiss={() => setShowAlert(null)}
                    header={showAlert.success ? 'Éxito' : 'Error'}
                    message={showAlert.message}
                    buttons={['OK']}
                />
            )}
        </IonContent>
    </IonPage>
);
};

export default AddRepuestoCamioneta;