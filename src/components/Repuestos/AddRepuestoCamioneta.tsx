import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonAlert, IonList } from '@ionic/react';
import HeaderGeneral from '../Header/HeaderGeneral';
import { guardarStockCamioneta, modificarStockCamioneta } from './FetchsRepuestos';
import { useOrden } from '../../Provider/Provider';

const AddRepuestoCamioneta: React.FC = () => {
  const [nombreRepuesto, setNombreRepuesto] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(0); // Cambiado a 0
  const [idEmpleado, setIdEmpleado] = useState<number | undefined>(undefined);  
  const [showAlert, setShowAlert] = useState<{ success: boolean; message: string } | null>(null);
  const [cantidadesModificadas, setCantidadesModificadas] = useState<{ [key: number]: number }>({});

  const { repuestosCamioneta } = useOrden();

  useEffect(() => {
    const empleadoId = localStorage.getItem('empleadoId');
    if (empleadoId) {
      setIdEmpleado(parseInt(empleadoId, 10));
    } else {
      setShowAlert({ success: false, message: 'Error: No se pudo obtener el ID del empleado.' });
    }
  }, []);

  const handleAgregarRepuesto = async () => {
    if (!nombreRepuesto.trim()) {
      setShowAlert({ success: false, message: 'El nombre del repuesto no puede estar vacío.' });
      return;
    }

    const repuesto = {
      nombre: nombreRepuesto,
      cantidad: cantidad,
      id_empleado: idEmpleado,
      id_repuesto: null,
      lote: ""
    };

    //@ts-ignore
    const success = await guardarStockCamioneta(repuesto);

    if (success) {
      setShowAlert({ success: true, message: 'Repuesto agregado exitosamente al stock de la camioneta.' });
      setNombreRepuesto('');
      setCantidad(0); // Resetea a 0
      setIdEmpleado(undefined);
    } else {
      setShowAlert({ success: false, message: 'Error al agregar el repuesto al stock de la camioneta.' });
    }
  };

  const handleCantidadChange = (id: number, nuevaCantidad: string) => {
    const cantidadNumerica = parseInt(nuevaCantidad, 10);
    if (!isNaN(cantidadNumerica)) {
      setCantidadesModificadas(prevState => ({
        ...prevState,
        [id]: cantidadNumerica
      }));
    }
  };

  const aumentarCantidad = (id: number) => {
    setCantidadesModificadas(prevState => ({
      ...prevState,
      [id]: (prevState[id] ?? 0) + 1,
    }));
  };
  
  const disminuirCantidad = (id: number) => {
    setCantidadesModificadas(prevState => ({
      ...prevState,
      [id]: (prevState[id] ?? 1) > 0 ? prevState[id]! - 1 : 0
    }));
  };

  const handleGuardarCantidades = async () => {
    try {
      const promises = repuestosCamioneta.map(async (repuesto: any) => {
        const nuevaCantidad = cantidadesModificadas[repuesto.id];
        if (nuevaCantidad !== undefined && nuevaCantidad !== repuesto.cantidad) {
          const actualizado = await modificarStockCamioneta(repuesto.id, { cantidad: nuevaCantidad });
          if (!actualizado) {
            throw new Error(`Error al modificar el stock del repuesto con ID ${repuesto.id}`);
          }
          console.log(`Stock actualizado: ${repuesto.nombre} - Nueva cantidad: ${nuevaCantidad}`);
        }
      });
  
      await Promise.all(promises);
      setShowAlert({ success: true, message: 'Cantidades modificadas con éxito.' });
    } catch (error) {
      console.error(error);
      setShowAlert({ success: false, message: 'Error al modificar las cantidades.' });
    }
  };

  return (
    <IonPage>
      <HeaderGeneral />
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
          <div style={{ display: 'flex'}}>
            <IonInput
              value={cantidad}
              onIonChange={e => setCantidad(parseInt(e.detail.value!, 10) || 0)} // Establecer a 0 si es NaN
              style={{ width: '80px', textAlign: 'right', margin: '0 8px' }}
            />
            <IonButton onClick={() => setCantidad(prev => (prev ?? 0) + 1)}>+</IonButton>
            <IonButton onClick={() => setCantidad(prev => (prev ?? 1) - 1)}>–</IonButton>
          </div>
        </IonItem>

        <IonButton expand="block" onClick={handleAgregarRepuesto}>
          Agregar Repuesto
        </IonButton>
        <h1>Repuestos propios</h1>
        <IonList>
          {repuestosCamioneta && repuestosCamioneta.length > 0 ? (
            repuestosCamioneta
              .filter((repuesto: any) => repuesto.nombre)
              .map((repuesto: any) => (
                <IonItem key={repuesto.id}>
                  <IonLabel>{repuesto.nombre}</IonLabel>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IonInput
                      value={cantidadesModificadas[repuesto.id] ?? repuesto.cantidad}
                      onIonChange={e => handleCantidadChange(repuesto.id, e.detail.value!)}
                      style={{ width: '80px', textAlign: 'right', margin: '0 8px' }}
                      slot="end"
                    />
                    <div>
                      <IonButton onClick={() => aumentarCantidad(repuesto.id)}>+</IonButton>
                      <IonButton onClick={() => disminuirCantidad(repuesto.id)}>-</IonButton>
                    </div>
                  </div>
                </IonItem>
              ))
          ) : (
            <IonItem>
              <IonLabel>No hay repuestos disponibles.</IonLabel>
            </IonItem>
          )}
        </IonList>

        <IonButton expand="block" onClick={handleGuardarCantidades}>
          Guardar
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
