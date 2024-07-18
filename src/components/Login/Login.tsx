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
  const cuilRef = useRef<HTMLIonInputElement>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const email = emailRef.current?.value as string;
    const cuil = cuilRef.current?.value as string;
    if (!email || !email.includes("@") || !email.includes(".com")) {
      setAlertMessage("Por favor, ingrese un correo electrónico válido.");
      setShowAlert(true);
      return;
    }
    try {
      const response = await fetch("https://lv-back.online/empleados");
      const empleados = await response.json();
      const empleado =
        empleados.find((empleado: any) => empleado.email === email) &&
        empleados.find((empleado: any) => empleado.cuil === cuil);

      if (!empleado) {
        setAlertMessage(
          "El correo electrónico o el cuil no coinciden en la base de datos."
        );
        setShowAlert(true);
        return;
      }

      if (empleado.id_rol !== 5 && empleado.id_rol !== 4) {
        setAlertMessage(
          "Acceso denegado. Solo los técnicos pueden acceder a esta pantalla."
        );
        setShowAlert(true);
        return;
      }

      // Guardo el email, el nombre y el id del empleado en localStorage para usarlo en LoginRol
      localStorage.setItem("empleadoEmail", email);
      localStorage.setItem("empleadoNombre", empleado.nombre);
      localStorage.setItem("empleadoId", empleado.id);
      localStorage.setItem("empleadoLegajo", empleado.legajo);

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
            <IonInput
              ref={cuilRef}
              className="inputs"
              type="number"
              placeholder="Número de cuil"
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
