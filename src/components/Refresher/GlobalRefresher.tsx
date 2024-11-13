import React from 'react';
import { IonRefresher, IonRefresherContent, IonContent } from '@ionic/react';
import { useOrden } from '../../Provider/Provider';  

const GlobalRefresher: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    cargarOrdenes,
    cargarRepuestosCamioneta,
    cargarRepuestosTaller,
    cargarTiposFunciones,
  
  } = useOrden(); 

  const handleRefresh = (event: CustomEvent) => {
    console.log('Refrescando contenido global...');
  
    Promise.all([
      cargarOrdenes(),
      cargarRepuestosCamioneta(),
      cargarRepuestosTaller(),
      cargarTiposFunciones()
    ]).then(() => {
      console.log('Contenido actualizado');
      event.detail.complete();  
    }).catch((error) => {
      console.error('Error al cargar los datos durante el refresco:', error);
      event.detail.complete();  
    });
  };
  return (
    <IonContent>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent />
      </IonRefresher>
      {children}
    </IonContent>
  );
};

export default GlobalRefresher;
