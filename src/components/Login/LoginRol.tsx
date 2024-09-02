  import { useHistory } from "react-router-dom";
  import HeaderHome from "../Header/HeaderHome";
  import "./Login.css";
  import { IonButton, IonContent, IonHeader, IonToast } from "@ionic/react";
  import { useEffect, useState } from "react";

  function LoginRolComponent() {
    const [empleadoNombre, setEmpleadoNombre] = useState("");
    const history = useHistory();

    const capitalizeFirstLetter = (string: string) => {
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    useEffect(() => {
      const nombre = localStorage.getItem("empleadoNombre");
      if (nombre) {
        setEmpleadoNombre(capitalizeFirstLetter(nombre));
      }
    }, []);

    const handleButtonClick = async (estado: number) => {
      const empleadoId = localStorage.getItem("empleadoId");
      if (!empleadoId) {
        throw new Error("Error: No se encontró el ID del empleado.");
        return;
      }

      try {
        const response = await fetch(
          `https://lv-back.online/empleados/modificar/${empleadoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ estado }),
          }
        );

        if (!response.ok) {
          throw new Error("Error al actualizar el rol del empleado");
        }

        // Redirigir a la página correspondiente después de la actualización
        history.push(estado === 1 ? "/domicilio" : "/taller");
      } catch (error) {
        throw new Error("Error al actualizar el rol del empleado");
      }
    };
    const handleFeedbackClick = () => {
      history.push("/feedback");
    };
    return (
      <IonContent className="login-rol-container">
        <IonHeader>
          <HeaderHome />
        </IonHeader>
        <>
          <h1>
            Bienvenido, <strong> {empleadoNombre + "!"}</strong>
          </h1>
          <h2>Hoy...</h2>
        </>
        <>
          <IonButton onClick={() => handleButtonClick(1)}>
            Trabajo a domicilio
          </IonButton>
          <IonButton onClick={() => handleButtonClick(0)}>
            Trabajo en taller
          </IonButton>
          <IonButton onClick={handleFeedbackClick}>
          Feedback
        </IonButton>
        </>
      </IonContent>
    );
  }

  export default LoginRolComponent;
