import { useHistory } from 'react-router-dom';
import HeaderHome from "../Header/HeaderHome";
import "./Login.css";
import { IonButton, IonContent, IonHeader } from "@ionic/react";

function LoginRolComponent() {
  const name = " Alan";
  const history = useHistory();
  
  const handleButtonClick = (path) => {
    history.push(path);
  };

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
        <IonButton onClick={() => handleButtonClick("/domicilio")}>Trabajo a domicilio</IonButton>
        <IonButton onClick={() => handleButtonClick("/taller")}>Trabajo en taller</IonButton>
      </>
    </IonContent>
  );
}

export default LoginRolComponent;
