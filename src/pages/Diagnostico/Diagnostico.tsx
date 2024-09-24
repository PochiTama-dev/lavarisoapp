import React, { useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonCheckbox,
  IonInput,
  IonButton,
  IonHeader,
  IonAlert,
} from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import "./diagnostico.css";
import HeaderGeneral from "../../components/Header/HeaderGeneral";
import { useHistory, useLocation } from "react-router-dom";

const Diagnostico: React.FC = () => {
  const [equipo, setEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cliente, setCliente] = useState("");
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>(
    Array(10).fill(false)
  );
  const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
  const location = useLocation<any>();
  const { orden } = location.state;
  const [motivo, setMotivo] = useState("");
  const motivoRef = useRef<HTMLIonInputElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showApprovalAlert, setShowApprovalAlert] = useState(false); // Estado para mostrar alerta de aprobación
  const history = useHistory();

  const modificarOrden = async (id: any, orden: any) => {
    try {
      const response = await fetch(
        `https://lv-back.online/ordenes/modificar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orden),
        }
      );
      const result = await response.json();
      if (result[0] === 1) {
        console.log("Orden modificada con éxito");
        return true;
      } else {
        console.log("La orden no pudo ser modificada...");
        return false;
      }
    } catch (error) {
      console.error("Error al modificar la orden.", error);
    }
  };

  const fetchTiposFunciones = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/funcion");
      const funciones = await response.json();
      if (funciones && funciones.length > 0) {
        setTextosCheckbox(
          funciones.map(
            (funcion: { tipo_funcion: string }) => funcion.tipo_funcion
          )
        );
      } else {
        console.log("Aún no se registra ningún tipo de funcion...");
      }
    } catch (error) {
      console.error(
        "Error, no se encontraron tipos de funciones en la base de datos....",
        error
      );
    }
  };

  const fetchOrden = async (id: any) => {
    try {
      const ordenResponse = await fetch(`https://lv-back.online/ordenes/${id}`);
      if (!ordenResponse.ok) {
        throw new Error("Error al obtener datos de la API");
      }

      const orden = await ordenResponse.json();
      if (orden) {
        const clienteResponse = await fetch(
          `https://lv-back.online/clientes/${orden.id_cliente}`
        );
        const cliente = await clienteResponse.json();
        return { ...orden, cliente };
      } else {
        console.log("No se encontró la orden en la base de datos.");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        let data = null;

        if (orden) {
          data = await fetchOrden(orden.id);
        }

        if (!data) {
          const localStorageData = localStorage.getItem("diagnosticoData");
          if (localStorageData) {
            data = JSON.parse(localStorageData);
          }
        }

        if (data) {
          // Actualizar estados solo si los datos están disponibles
          setEquipo(data.equipo || "");
          setMarca(data.marca || "");
          setModelo(data.modelo || "");
          setCliente(data.cliente?.numero_cliente || "");
          if (motivoRef.current) {
            motivoRef.current.value = data.motivo || "";
          }
          // Actualizar valores de los checkboxes basados en 'textosCheckbox'
          const diagnosticoOrden = data.diagnostico || "";
          const nuevosCheckboxValues = textosCheckbox.map((texto) =>
            diagnosticoOrden.includes(texto)
          );
          setCheckboxValues(nuevosCheckboxValues);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    if (orden && textosCheckbox.length > 0) {
      loadData();
    }
  }, [orden, textosCheckbox]);

  useEffect(() => {
    fetchTiposFunciones();
  }, []);

  const handleConfirmarClick = async () => {
    const diagnostico = textosCheckbox
      .filter((texto, index) => checkboxValues[index])
      .join(", ");

    const dataToSend = {
      equipo,
      marca,
      modelo,
      cliente,
      diagnostico,
      motivo: motivoRef.current?.value || "",
      checkboxValues,
    };

    console.log("data", dataToSend);
    localStorage.setItem("diagnosticoData", JSON.stringify(dataToSend));

    if (orden && orden.id) {
      const success = await modificarOrden(orden.id, dataToSend);
      if (success) {
        // alert("Diagnostico guardado con éxito");
        console.log("Orden guardada", dataToSend);
        window.history.back();
      } else {
        console.log("Error al guardar en la base de datos.");
      }
    } else {
      console.error("No se pudo obtener el ID de la orden.");
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>

        <div className="diagnostico-ctn">
          <div className="section">
            <h2>Diagnosticar</h2>

            <div className="item2">
              <span>
                <strong>Equipo:</strong>
              </span>
              <IonInput
                style={{ marginLeft: "10px" }}
                value={equipo}
                placeholder="Ingrese equipo"
                onIonChange={(e) => setEquipo(e.detail.value!)}
              />
              <IonIcon
                icon={pencilOutline}
                className="icon-pencil"
                style={{ fontSize: "22px" }}
              />
            </div>
            <div className="item2">
              <span>
                <strong>Marca:</strong>
              </span>
              <IonInput
                style={{ marginLeft: "10px" }}
                value={marca}
                placeholder="Ingrese marca"
                onIonChange={(e) => setMarca(e.detail.value!)}
              />
              <IonIcon
                icon={pencilOutline}
                className="icon-pencil"
                style={{ fontSize: "22px" }}
              />
            </div>
            <div className="item2">
              <span>
                <strong>Modelo:</strong>
              </span>
              <IonInput
                style={{ marginLeft: "10px" }}
                value={modelo}
                placeholder="Ingrese modelo"
                onIonChange={(e) => setModelo(e.detail.value!)}
              />
              <IonIcon
                icon={pencilOutline}
                className="icon-pencil"
                style={{ fontSize: "22px" }}
              />
            </div>
            <div className="item2">
              <span>
                <strong>N° de cliente:</strong>
              </span>
              <IonInput
                style={{ marginLeft: "10px" }}
                value={cliente}
                placeholder="Ingrese N° de cliente"
                onIonChange={(e) => setCliente(e.detail.value!)}
              />
            </div>
          </div>
          <div className="section">
            <h2>Chequeo de funcionamiento</h2>
            <div className="checkbox-container">
              {textosCheckbox.map((texto, index) => (
                <div key={index} className="checkbox-item">
                  <IonCheckbox
                    checked={checkboxValues[index]}
                    onIonChange={(e) => {
                      const newCheckboxValues = [...checkboxValues];
                      newCheckboxValues[index] = e.detail.checked;
                      setCheckboxValues(newCheckboxValues);
                    }}
                    className="checkbox"
                  />
                  <span>{texto}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="section">
            <h2>Diagnostico</h2>
            <IonInput
              className="obs-input"
              ref={motivoRef}
              onIonChange={(e) => setMotivo(e.detail.value!)}
              placeholder="Ingrese diagnóstico"
            />
          </div>
          <div className="section">
            <IonButton
              className="button"
              style={{ "--border-radius": "20px" }}
              onClick={() => setShowConfirm(true)}
            >
              Confirmar
            </IonButton>

            <IonAlert
              isOpen={showConfirm}
              onDidDismiss={() => setShowConfirm(false)}
              header={"Confirmar acción"}
              message={"¿Deseas confirmar este diagnóstico?"}
              buttons={[
                {
                  text: "Cancelar",
                  role: "cancel",
                  handler: () => {
                    setShowConfirm(false);
                  },
                },
                {
                  text: "Confirmar",
                  handler: () => {
                    handleConfirmarClick();
                    setShowConfirm(false);
                  },
                },
              ]}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Diagnostico;
