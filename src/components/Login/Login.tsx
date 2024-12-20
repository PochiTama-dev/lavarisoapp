import {
  IonAlert,
  IonButton,
  IonContent,
  IonInput,
  IonPage,
} from "@ionic/react";
import "./Login.css";
import { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import socket from "../services/socketService";
 
import { registerPlugin } from "@capacitor/core";
const LoginComponent: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const history = useHistory();
  const emailRef = useRef<HTMLIonInputElement>(null);
  const cuilRef = useRef<HTMLIonInputElement>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalTime = 5000;  
  useEffect(() => {
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, []);

  interface BackgroundGeolocationPlugin {
    addWatcher(
      options: any,
      callback: (location: any, error: any) => void
    ): Promise<string>;
    removeWatcher(options: { id: string }): Promise<void>;
    openSettings(): Promise<void>;
  }

  const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
    "BackgroundGeolocation"
  );
  const locationWatcherRef = useRef<string | undefined>();

  const startGeolocation = async () => {
    try {
      locationWatcherRef.current = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: "Cancel to prevent battery drain.",
          backgroundTitle: "Tracking You.",
          requestPermissions: true,
          stale: false,
          distanceFilter: 10,
        },
        (position, error) => {
          if (error) {
            if (error.code === "NOT_AUTHORIZED") {
              if (
                window.confirm(
                  "This app needs your location, but does not have permission.\n\n" +
                    "Open settings now?"
                )
              ) {
                BackgroundGeolocation.openSettings();
              }
            }
            return console.error("Error al obtener ubicación:", error);
          }
          const coords = {
            latitude: position.latitude,
            longitude: position.longitude,
          };

          if (!locationIntervalRef.current) {
            locationIntervalRef.current = setInterval(() => {
          
              socket.emit("locationUpdate", {
                id: localStorage.getItem("empleadoId"),
                nombre: localStorage.getItem("empleadoNombre"),
                ...coords,
              });
            }, intervalTime);
          }
        }
      );
    } catch (error) {
      console.error("Error al iniciar geolocalización:", error);
    }
  };

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
      const empleado = empleados.find(
        (empleado: any) => empleado.email === email && empleado.cuil === cuil
      );

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

      localStorage.setItem("empleadoEmail", email);
      localStorage.setItem("empleadoNombre", empleado.nombre);
      localStorage.setItem("empleadoId", empleado.id);
      localStorage.setItem("empleadoLegajo", empleado.legajo);

      socket.emit("userStatus", {
        status: "conectado",
        id: empleado.id,
        nombre: empleado.nombre,
      });
      localStorage.setItem("userStatus", "conectado");

      startGeolocation();

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