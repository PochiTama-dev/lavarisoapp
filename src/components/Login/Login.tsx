import {
  IonAlert,
  IonButton,
  IonContent,
  IonInput,
  IonPage,
} from "@ionic/react";
import "./Login.css";
import { useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const LoginComponent: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const history = useHistory();
  const emailRef = useRef<HTMLIonInputElement>(null);
  // const passwordRef = useRef<HTMLIonInputElement>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const email = emailRef.current?.value as string;
    // const password = passwordRef.current?.value as string;
    if (!email || !email.includes("@") || !email.includes(".com")) {
      setAlertMessage("Por favor, ingrese un correo electrónico válido.");
      setShowAlert(true);
      return;
    }
    try {
      const response = await fetch("https://lv-back.online/empleados");
      const empleados = await response.json();
      const emailExists = empleados.some(
        (empleado: any) => empleado.email === email
      );

      if (!emailExists) {
        setAlertMessage("El correo electrónico no existe en la base de datos.");
        setShowAlert(true);
        return;
      }

      // if (!password) {
      //   setAlertMessage("Ingrese su contraseña");
      //   setShowAlert(true);
      //   return;
      // }
      history.push("/rol");
    } catch (error) {
      setAlertMessage("Ocurrió un error al verificar el correo electrónico.");
      setShowAlert(true);
    }
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
              ref={emailRef}
              className="inputs"
              type="text"
              placeholder="E-mail"
            />
            {/* <IonInput
              ref={passwordRef}
              className="inputs"
              type="password"
              placeholder="Contraseña"
            /> */}
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
