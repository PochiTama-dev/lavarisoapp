import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
} from "@ionic/react";
import "./Login.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const history = useHistory();

  const handleEmailChange = (e: CustomEvent) => {
    setEmail(e.detail.value!);
  };

  const handlePasswordChange = (e: CustomEvent) => {
    setPassword(e.detail.value!);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".com")) {
      setAlertMessage("Por favor, ingrese un correo electrónico válido.");
      setShowAlert(true);
      return;
    }

    if (!password) {
      setAlertMessage("Ingrese su contraseña");
      setShowAlert(true);
      return;
    }
    history.push("/rol");
  };

  return (
    <IonPage className="login">
      <IonContent>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          message={alertMessage}
          buttons={["Cerrar"]}
        />
        <div className="login-content">
          <h1>LavaRiso</h1>
          <h2>Credenciales requeridas</h2>
          <form onSubmit={handleSubmit}>
            <IonInput
              className="inputs"
              type="text"
              placeholder="E-mail"
              value={email}
              onIonChange={handleEmailChange}
            />
            <IonInput
              className="inputs"
              type="password"
              placeholder="Contraseña"
              value={password}
              onIonChange={handlePasswordChange}
            />
            <IonButton className="login-button" type="submit">
              Iniciar sesión
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginComponent;
