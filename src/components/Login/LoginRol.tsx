import HeaderHome from "../Header/HeaderHome";
import "./Login.css";
import { IonButton, IonContent, IonHeader } from "@ionic/react";

function LoginRolComponent() {
  const name = " Alan";
  return (
    <IonContent className="login-rol-container">
      <IonHeader>
        <HeaderHome />
      </IonHeader>
      <>
        <h1>
          Bienvenido, <strong> {name + "!"}</strong>
        </h1>
        <h2>Hoy...</h2>
      </>
      <>
        <IonButton>Trabajo a domicilio</IonButton>
        <IonButton>Trabajo en taller</IonButton>
      </>
    </IonContent>
  );
}

export default LoginRolComponent;
