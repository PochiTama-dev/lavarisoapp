import React, { useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonPage,
  IonCheckbox,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonHeader,
  IonAlert,
} from "@ionic/react";
import "./presupuesto.css";
import SignatureCanvas from "react-signature-canvas";
import HeaderGeneral from "../../components/Header/HeaderGeneral";

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
  const [selectedOption, setSelectedOption] = useState("");
  const [formaPago, setFormaPago] = useState("");
  const [estado, setEstado] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [signature1, setSignature1] = useState("");
  const [signature2, setSignature2] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const sigCanvas1 = useRef<SignatureCanvas>(null);
  const sigCanvas2 = useRef<SignatureCanvas>(null);

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

  useEffect(() => {
    // Load data from localStorage when the component mounts
    const savedData = JSON.parse(
      localStorage.getItem("presupuestoData") || "{}"
    );
    if (savedData) {
      setProducto(savedData.producto || "");
      setMarca(savedData.marca || "");
      setModelo(savedData.modelo || "");
      setCliente(savedData.cliente || "");
      setCheckboxValues(savedData.checkboxValues || Array(10).fill(false));
      setMontos(savedData.montos || Array(7).fill(0));
      setObservaciones(savedData.observaciones || "");
      setSelectedOption(savedData.selectedOption || "");
      setFormaPago(savedData.formaPago || "");
      setEstado(savedData.estado || "");
      setSelectedList(savedData.selectedList || []);
      setAcceptedPolicies(savedData.acceptedPolicies || false);
      setSignature1(savedData.signature1 || "");
      setSignature2(savedData.signature2 || "");

      // Load signatures into canvas
      if (savedData.signature1 && sigCanvas1.current) {
        sigCanvas1.current.fromDataURL(savedData.signature1);
      }
      if (savedData.signature2 && sigCanvas2.current) {
        sigCanvas2.current.fromDataURL(savedData.signature2);
      }
    }
  }, []);

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
      montos,
      observaciones,
      selectedOption,
      formaPago,
      estado,
      signature1: sigCanvas1.current?.toDataURL(),
      signature2: sigCanvas2.current?.toDataURL(),
      selectedList,
      acceptedPolicies,
    };
    console.log(dataToSend);
    localStorage.setItem("presupuestoData", JSON.stringify(dataToSend));
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
  const handleCancelarOrden = () => {
    localStorage.removeItem("presupuestoData");

    window.location.reload();
  };
  return (
    <IonPage>
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
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
                    marginTop: "-10px",
                  }}
                >
                  <span>
                    <strong>{servicios[index]}:</strong>
                  </span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>$</span>
                    <IonInput
                      style={{ width: "100px", marginLeft: "20px" }}
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
                <IonSelect
                  value={formaPago}
                  placeholder="Seleccione método de pago"
                  onIonChange={(e) => setFormaPago(e.detail.value)}
                >
                  <IonSelectOption value="efectivo">Efectivo</IonSelectOption>
                  <IonSelectOption value="mp">MercadoPago</IonSelectOption>
                  <IonSelectOption value="banco">
                    Transferencia Bancaria
                  </IonSelectOption>
                </IonSelect>
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
            <div>
              <div
                className="separador"
                style={{
                  borderBottom: "2px solid #000",
                  margin: "20px 10px",
                  width: "90%",
                }}
              ></div>
              <h2>Estado</h2>
              <div
                style={{
                  width: "100%",
                  marginTop: "30px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <IonSelect
                  value={estado}
                  placeholder="Seleccione estado"
                  onIonChange={(e) => setEstado(e.detail.value)}
                >
                  <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
                  <IonSelectOption value="aprobado">Aprobado</IonSelectOption>
                  <IonSelectOption value="rechazado">Rechazado</IonSelectOption>
                </IonSelect>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                    eget ultricies lectus. Ut sit amet aliquet...
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IonCheckbox
                    checked={acceptedPolicies}
                    onIonChange={(e) => setAcceptedPolicies(e.detail.checked)}
                  />
                  <span
                    style={{
                      marginLeft: "20px",
                    }}
                  >
                    Acepto las políticas de garantía
                  </span>
                </div>
              </div>
              <h2>Firmas</h2>
              <div className="firma">
                <h3>Firma Cliente</h3>
                <SignatureCanvas
                  penColor="black"
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: "sigCanvas",
                  }}
                  ref={sigCanvas1}
                  onEnd={() =>
                    setSignature1(sigCanvas1.current?.toDataURL() || "")
                  }
                />
                <IonButton onClick={() => sigCanvas1.current?.clear()}>
                  Borrar
                </IonButton>
              </div>
              <div className="firma">
                <h3>Firma Técnico</h3>
                <SignatureCanvas
                  penColor="black"
                  canvasProps={{
                    width: 500,
                    height: 200,
                    className: "sigCanvas",
                  }}
                  ref={sigCanvas2}
                  onEnd={() =>
                    setSignature2(sigCanvas2.current?.toDataURL() || "")
                  }
                />
                <IonButton onClick={() => sigCanvas2.current?.clear()}>
                  Borrar
                </IonButton>
              </div>
            </div>

            <div className="section">
              <IonButton
                className="button"
                style={{ "--border-radius": "20px" }}
                onClick={handleConfirmarClick}
              >
                Confirmar
              </IonButton>
              <IonButton
                className="button"
                style={{
                  "--border": "none",
                  "--background": "none",
                  "--color": "#E58769",
                }}
                onClick={() => setShowAlert(true)}
              >
                Cancelar orden
              </IonButton>

              <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header={"Confirmar"}
                message={"¿Estás seguro de que deseas cancelar la orden?"}
                buttons={[
                  {
                    text: "No",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: () => {
                      setShowAlert(false);
                    },
                  },
                  {
                    text: "Sí",
                    handler: () => {
                      handleCancelarOrden();
                      setShowAlert(false);
                    },
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Presupuesto;
