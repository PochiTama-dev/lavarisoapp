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
  IonModal,
  IonSearchbar,
  IonList,
} from "@ionic/react";
import "./presupuesto.css";

import "../Diagnostico/diagnostico.css";
import SignatureCanvas from "react-signature-canvas";
import "../Entrega/entrega.css";
const Presupuesto: React.FC = () => {
  const [producto, setProducto] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cliente, setCliente] = useState("");
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>(
    Array(10).fill(false)
  );
  const [montos, setMontos] = useState(Array(7).fill(0));

  const [observaciones, setObservaciones] = useState("");
  const [selectedOption, setSelectedOption] = useState(" ");
  const [signature1, setSignature1] = useState("");
  const [signature2, setSignature2] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const textosCheckbox = [
    "de 48  72hs",
    "de 3 A 15 días",
    "de 4 a 7 días",
    "de 7 a 15 días",
    "No especificado",
    "Dentro de las 24 hs",
  ];
  const options = [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Fuelle",
    "coso",
    "cosito",
  ];
  const servicios = [
    "Viaticos",
    "Descuentos",
    "Comisión visita",
    "Comisión reparación",
    "Comisión entrega",
    "Comisión rep. a domicilio",
    "Gasto impositivo",
  ];
  const handleMontoChange = (index: number, value: any) => {
    const newMontos = [...montos];
    newMontos[Number(index)] = Number(value);
    setMontos(newMontos);
  };
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
  const total = montos.reduce((a, b) => a + b, 0);
  const handleSelect = (selectedValue: string) => {
    setSelectedOptions((prevOptions) => {
      if (prevOptions.includes(selectedValue)) {
        return prevOptions.filter((option) => option !== selectedValue);
      } else {
        return [...prevOptions, selectedValue];
      }
    });
  };
  const handleRemove = (itemToRemove: string) => {
    setSelectedList(selectedList.filter((item) => item !== itemToRemove));
  };
  function setAcceptedPolicies(checked: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
    <IonPage>
      <IonContent>
        <div className="diagnostico-ctn">
          <div className="section">
            <h2>Presupuestar</h2>
            <IonButton onClick={() => setShowModal(true)}>
              Seleccionar repuesto
            </IonButton>

            <IonModal isOpen={showModal}>
              <IonSearchbar
                value={searchText || ""}
                onIonChange={(e) => setSearchText(e.detail.value || "")}
              ></IonSearchbar>
              <IonList>
                {options
                  .filter((option) =>
                    option
                      .toLowerCase()
                      .includes(searchText?.toLowerCase() || "")
                  )
                  .map((option, index) => (
                    <IonItem key={index}>
                      <IonLabel>{option}</IonLabel>
                      <IonCheckbox
                        slot="end"
                        onIonChange={() => handleSelect(option)}
                      />
                    </IonItem>
                  ))}
              </IonList>
              <IonButton
                onClick={() => {
                  setSelectedList((prevList) => {
                    const newItems = selectedOptions.filter(
                      (option) => !prevList.includes(option)
                    );
                    return [...prevList, ...newItems];
                  });
                  setShowModal(false);
                }}
              >
                Cerrar
              </IonButton>
            </IonModal>

            <div className="item">
              <ul>
                {selectedList.map((item, index) => (
                  <li key={index}>
                    {item}
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleRemove(item)}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="servicios"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h2>Servicios</h2>
              {montos.map((monto, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    <strong>{servicios[index]}:</strong>
                  </span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>$</span>
                    <IonInput
                      style={{ width: "100px" }}
                      type="number"
                      value={monto}
                      onIonChange={(e) =>
                        handleMontoChange(index, e.detail.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <div style={{ width: "100%", marginTop: "30px" }}>
                <span>
                  <strong>Total:</strong>
                </span>
              </div>
              <div
                style={{
                  textAlign: "right",
                  marginRight: "65px",
                  marginTop: "-20px",
                }}
              >
                <span>${total}</span>
              </div>
            </div>
            <div>
              <div
                className="separador"
                style={{
                  borderBottom: "2px solid #000",
                  margin: "20px 10px",
                  width: "90%",
                }}
              ></div>
              <h2>Forma de pago</h2>
              <div
                style={{
                  width: "100%",
                  marginTop: "30px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <IonSelect placeholder="Seleccione método de pago">
                  <IonSelectOption value="efectivo">Efectivo</IonSelectOption>
                  <IonSelectOption value="mp">MercadoPago</IonSelectOption>
                  <IonSelectOption value="credito">Crédito</IonSelectOption>
                  <IonSelectOption value="debito">Débito</IonSelectOption>
                </IonSelect>
                <IonInput placeholder="Total" />
              </div>
            </div>

            <div className="section">
              <h2>Tiempo estimado de reparación/diagnóstico</h2>
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
              <div>
                <IonSelect placeholder="Estado" className="estado-select">
                  <IonSelectOption value="option1">Visitado</IonSelectOption>
                  <IonSelectOption value="option2">En taller</IonSelectOption>
                  <IonSelectOption value="option3">Entregado</IonSelectOption>
                </IonSelect>
              </div>
            </div>
            <div
              className="separador"
              style={{
                borderBottom: "2px solid #000",
                margin: "20px 10px",
                width: "90%",
              }}
            ></div>
          </div>

          <div className="section">
            <h2>Políticas de Garantía</h2>
            <div
              style={{
                border: "1px solid #000",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "15px",
              }}
            >
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget
                ultricies lectus. Ut sit amet aliquet...
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IonCheckbox
                onIonChange={(e) => setAcceptedPolicies(e.detail.checked)}
              />
              <span>Acepto las políticas de garantía</span>
            </div>
          </div>
          <div className="section">
            <h2>Conformidad del retiro</h2>
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
            <IonButton
              className="button"
              style={{ "--border-radius": "20px" }}
              onClick={handleConfirmarClick}
            >
              Confirmar
            </IonButton>
            <IonButton className="button" style={{ "--border": "none", "--background": "none" , "--color": "#E58769" }}>
              Cancelar orden
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Presupuesto;
