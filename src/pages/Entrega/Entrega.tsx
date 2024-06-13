import React, { useState } from "react";
import {
  IonContent,
  IonPage,
  IonIcon,
  IonCheckbox,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonItem,
  IonLabel,
  IonRadio,
  IonRow,
  IonCol,
  IonHeader,
} from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import "../Diagnostico/diagnostico.css";
import SignatureCanvas from "react-signature-canvas";
import "./entrega.css";
import CancelarOrden from "../../components/Orden/CancelarOrden";
import HeaderGeneral from "../../components/Header/HeaderGeneral";

const Entrega: React.FC = () => {
  const [modal, setModal] = useState(false);
  const [producto, setProducto] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cliente, setCliente] = useState("");
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>(
    Array(10).fill(false)
  );
  const [observaciones, setObservaciones] = useState("");
  const [selectedOption, setSelectedOption] = useState(" ");
  const [signature1, setSignature1] = useState("");
  const [signature2, setSignature2] = useState("");
  const textosCheckbox = [
    "Enciende",
    "Ingresa agua",
    "No ingresa agua",
    "Gira motor para los dos lados",
    "Centrifuga",
    "No centrifuga",
    "Desagota",
    "No desagota",
    "Sin prueba de funcionamiento",
    "No enciende",
  ];

  const handleConfirmarClick = () => {
    const dataToSend = {
      producto,
      marca,
      modelo,
      cliente,
      checkboxValues,
      observaciones,
    };
    console.log(dataToSend);
  };

  const handleModal = () => {
    setModal(!modal);
  };

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>
        <div className="diagnostico-ctn">
          <div className="section">
            <h2>Entrega</h2>
            <div className="item">
              <span>
                <strong>Producto:</strong>
              </span>
              <IonInput
                style={{ marginLeft: "10px" }}
                value={producto}
                placeholder="Ingrese producto"
                onIonChange={(e) => setProducto(e.detail.value!)}
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
                value={cliente}
                placeholder="Ingrese N° de cliente"
                onIonChange={(e) => setCliente(e.detail.value!)}
              />
              <IonIcon
                icon={pencilOutline}
                className="icon-pencil"
                style={{ fontSize: "22px" }}
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
            <h2>Tipo de entrega</h2>
            <IonSelect
              value={selectedOption}
              placeholder="Seleccionar"
              onIonChange={(e) => setSelectedOption(e.detail.value)}
            >
              <IonSelectOption value="option1">Option 1</IonSelectOption>
              <IonSelectOption value="option2">Option 2</IonSelectOption>
              <IonSelectOption value="option3">Option 3</IonSelectOption>
            </IonSelect>
          </div>
          <div className="section">
            <h2>Observaciones</h2>
            <IonInput
              className="obs-input"
              value={observaciones}
              onIonChange={(e) => setObservaciones(e.detail.value!)}
              placeholder="Ingrese observaciones"
            />
          </div>
          <div className="section">
            <h2>Conformidad de la entrega</h2>
            <span>Firma del cliente</span>
            <SignatureCanvas
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
            />
            <span>Firma del técnico</span>
            <SignatureCanvas
              penColor="black"
              canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
            />
          </div>
          <div className="section">
            <h2>¿Nos recomendarias? </h2>
            <IonRadioGroup
              value={selectedOption}
              onIonChange={(e) => setSelectedOption(e.detail.value)}
            >
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel>Si</IonLabel>
                    <IonRadio slot="start" value="si" />
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel>No</IonLabel>
                    <IonRadio slot="start" value="no" />
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonRadioGroup>
          </div>
          <div className="section">
            <IonButton
              className="button"
              style={{ "--border-radius": "20px" }}
              onClick={handleConfirmarClick}
            >
              Concretar entrega
            </IonButton>
            <IonButton
              onClick={handleModal}
              className="button"
              style={{ "--border-radius": "20px" }}
            >
              Cancelar orden
            </IonButton>
            {modal && <CancelarOrden onCancel={handleModal} />}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Entrega;
