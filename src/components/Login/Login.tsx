import {
  IonButton,
  IonContent,
  IonInput,
  IonPage,
  IonTitle,
} from "@ionic/react";
import "./Login.css";

const LoginComponent: React.FC = () => {
  return (
    <IonPage className="login">
      <IonContent>
        <h1>LavaRiso</h1>
        <h2>Credenciales requeridas</h2>
        <form action="">
          <IonInput className="inputs" type="text" placeholder="E-mail" />
          <IonInput className="inputs" type="text" placeholder="Contraseña" />
          <IonButton className="login-button" type="submit">
            Iniciar sesión
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default LoginComponent;
