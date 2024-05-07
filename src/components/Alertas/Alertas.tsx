import "./Alertas.css";
import { IonAlert, IonButton, IonContent, IonTitle } from "@ionic/react";

function AlertasComponent() {
  return (
    <IonContent className="alertas-container">
      <>
        <h1>Alertas</h1>
      </>
      <>
        <IonButton id="en-camino">En camino</IonButton>
        <IonAlert
          trigger="en-camino"
          message="En camino"
          buttons={["Cerrar"]}
        ></IonAlert>
        <IonButton id="en-destino">Llegué a destino</IonButton>
        <IonAlert
          trigger="en-destino"
          message="Llegué a destino"
          buttons={["Cerrar"]}
        ></IonAlert>
        <IonButton id="diagnostico">Realizando diagnóstico</IonButton>
        <IonAlert
          trigger="diagnostico"
          message="Realizando diagnóstico"
          buttons={["Cerrar"]}
        ></IonAlert>
        <IonButton id="reparando">Reparando</IonButton>
        <IonAlert
          trigger="reparando"
          message="Reparando"
          buttons={["Cerrar"]}
        ></IonAlert>
        <IonButton id="trabajo-terminado">Trabajo terminado</IonButton>
        <IonAlert
          trigger="trabajo-terminado"
          message="Trabajo terminado"
          buttons={["Cerrar"]}
        ></IonAlert>
        <IonButton id="de-regreso">De regreso</IonButton>
        <IonAlert
          trigger="de-regreso"
          message="De regreso"
          buttons={["Cerrar"]}
        ></IonAlert>
      </>
    </IonContent>
  );
}
export default AlertasComponent;
