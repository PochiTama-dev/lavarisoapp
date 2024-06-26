import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonCheckbox,
  IonInput,
  IonButton,
  IonHeader,
} from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import "./diagnostico.css";
import HeaderGeneral from "../../components/Header/HeaderGeneral";
import { useLocation } from 'react-router-dom';

const Diagnostico: React.FC = () => {
  const [equipo, setEquipo] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cliente, setCliente] = useState("");
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>(Array(10).fill(false));
  const [motivo, setMotivo] = useState("");
  const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
  const location = useLocation<any>();
  const { orden } = location.state;

  const modificarOrden = async (id: any, orden: any) => {
    try {
      const response = await fetch(`https://lv-back.online/ordenes/modificar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orden)
      });
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
        console.log(`Se encontró un listado con ${funciones.length} tipos de funciones!!`);
        setTextosCheckbox(funciones.map((funcion: { tipo_funcion: string }) => funcion.tipo_funcion));
      } else {
        console.log('Aún no se registra ningún tipo de funcion...');
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de funciones en la base de datos....", error);
    }
  };
 
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("diagnosticoData") || "{}");
    if (savedData) {
      setEquipo(savedData.equipo || "");
      setMarca(savedData.marca || "");
      setModelo(savedData.modelo || "");
      setCliente(savedData.cliente || "");
      setCheckboxValues(savedData.checkboxValues || Array(10).fill(false));  
      setMotivo(savedData.motivo || "");  
      
    }
    fetchTiposFunciones();
  }, []);

  const handleConfirmarClick = async () => {
    const diagnostico = textosCheckbox
      .filter((texto, index) => checkboxValues[index])
      .join(', ');
  
    const dataToSend = {
      equipo,
      marca,
      modelo,
      cliente,
      diagnostico,
      motivo,
      checkboxValues,  
    };
  
    console.log("data", dataToSend);
    localStorage.setItem("diagnosticoData", JSON.stringify(dataToSend));
  
    if (orden && orden.id) {
      const success = await modificarOrden(orden.id, dataToSend);
      if (success) {
        console.log("Orden guardada", dataToSend);
      } else {
        console.log("Error al guardar en la base de datos.");
      }
    } else {
      console.error("No se pudo obtener el ID de la orden.");
    }
  };

  console.log(orden);

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>

        {orden && (
          <div className="diagnostico-ctn">
            <div className="section">
              <h2>Diagnosticar</h2>
              
              <div className="item">
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
              <div className="item">
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
              <div className="item">
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
              <div className="item">
                <span>
                  <strong>N° de cliente:</strong>
                </span>
                <IonInput
                  style={{ marginLeft: "10px" }}
                  value={orden.Cliente.numero_cliente}
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
                value={motivo}
                onIonChange={(e) => setMotivo(e.detail.value!)}
                placeholder="Ingrese diagnostico"
              />
            </div>
            <div className="section">
              <IonButton
                className="button"
                style={{ "--border-radius": "20px" }}
                onClick={handleConfirmarClick}
              >
                Confirmar
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Diagnostico;
