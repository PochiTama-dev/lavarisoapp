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

const LoginComponent: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".com")) {
      alert("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    if (!password) {
      <IonAlert
        trigger="password"
        message="Ingrese su contraseña"
        buttons={["Cerrar"]}
      ></IonAlert>;
      return;
    }
  };

  return (
    <IonPage className="login">
      <IonContent>
        <div className="login-content">
          <h1>LavaRiso</h1>
          <h2>Credenciales requeridas</h2>
          <form onSubmit={handleSubmit}>
            <IonInput
              className="inputs"
              type="text"
              placeholder="E-mail"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
            />
            <IonInput
              className="inputs"
              type="password"
              placeholder="Contraseña"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
            />
            <a href="/rol">
              <IonButton className="login-button" type="submit">
                Iniciar sesión
              </IonButton>
            </a>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginComponent;
