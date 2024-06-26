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
import { useLocation } from "react-router-dom";
import {
  fetchPlazosReparacion,
  estadosPresupuestos,
  listaRepuestos,
  mediosDePago,
} from "./fetchsFunctions";

interface Repuesto {
  id: number;
  codigo_repuesto: string;
  descripcion: string;
}
interface MedioDePago {
  id: number;
  medio_de_pago: string;
}

interface FormaPago {
  id: number;
  medio_de_pago: string;
}

const Presupuesto: React.FC = () => {
  const [producto, setProducto] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cliente, setCliente] = useState("");
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>(
    Array(6).fill(false)
  );
  const [montos, setMontos] = useState(Array(7).fill(0));
  const [observaciones, setObservaciones] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [formaPago, setFormaPago] = useState<FormaPago[]>([]);
  const [estado, setEstado] = useState<any[]>([]);
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
  const [plazos, setPlazos] = useState<any[]>([]);
  const [plazosCheckboxValues, setPlazosCheckboxValues] = useState<boolean[]>(
    []
  );
  const [estados, setEstados] = useState<any[]>([]);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [medioPago, setMedioPago] = useState<MedioDePago[]>([]);

  const location = useLocation();
  const { orden } = location.state as { orden: any };

  useEffect(() => {
    const loadData = async () => {
      setPlazos(await fetchPlazosReparacion());
      setEstados(await estadosPresupuestos());
      setRepuestos(await listaRepuestos());
      setMedioPago(await mediosDePago());
    };
    loadData();
  }, []);

  const servicios = [
    "Viaticos",
    "Descuentos",
    "Comisión visita",
    "Comisión reparación",
    "Comisión entrega",
    "Comisión rep. a domicilio",
    "Gasto impositivo",
  ] as const;

  type Servicio = (typeof servicios)[number];

  const servicioToDBFieldMap: Record<Servicio, string> = {
    Viaticos: "viaticos",
    Descuentos: "descuentos_referidos",
    "Comisión visita": "comision_visita",
    "Comisión reparación": "comision_reparacion",
    "Comisión entrega": "comision_entrega",
    "Comisión rep. a domicilio": "comision_reparacion_domicilio",
    "Gasto impositivo": "gasto_impositivo",
  };

  const handleMontoChange = (index: number, value: any) => {
    const newMontos = [...montos];
    newMontos[Number(index)] = Number(value);
    setMontos(newMontos);
  };
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const savedData = JSON.parse(
        localStorage.getItem("presupuestoData") || "{}"
      );

      setProducto(savedData.producto || "");
      setMontos(savedData.montos || Array(7).fill(0));
      setSelectedOption(savedData.selectedOption || "");
      setFormaPago(savedData.formaPago || null);
      setEstado(savedData.estado || "");
      setSelectedList(savedData.selectedList || []);
      setAcceptedPolicies(savedData.acceptedPolicies || false);
      setSignature1(savedData.signature1 || "");
      setSignature2(savedData.signature2 || "");
      setPlazosCheckboxValues(
        savedData.plazosCheckboxValues || Array(6).fill(false)
      );

      if (savedData.signature1 && sigCanvas1.current) {
        sigCanvas1.current.fromDataURL(savedData.signature1);
      }
      if (savedData.signature2 && sigCanvas2.current) {
        sigCanvas2.current.fromDataURL(savedData.signature2);
      }
    };

    loadFromLocalStorage();
    fetchPlazosReparacion();
    estadosPresupuestos();
    listaRepuestos();
    mediosDePago();
  }, []);

  const handleConfirmarClick = async () => {
    const serviciosMontos: Record<string, number> = {};
    montos.forEach((monto, index) => {
      const servicio = servicios[index];
      const dbField = servicioToDBFieldMap[servicio];
      if (dbField) {
        serviciosMontos[dbField] = monto;
      }
    });

    const firma_cliente = sigCanvas1.current?.toDataURL();
    const firma_empleado = sigCanvas2.current?.toDataURL();

    const id_plazo_reparacion = procesarPlazoReparacion(plazosCheckboxValues);

    const dataToSend = {
      id_orden: orden.id,
      id_plazo_reparacion,
      id_medio_de_pago: formaPago.id,
      id_estado_presupuesto: estado,
      firma_cliente,
      firma_empleado,
      selectedList,
      acceptedPolicies,
      ...serviciosMontos,
      total,
    };

    console.log("Datos a enviar:", dataToSend);
    try {
      const verificarResponse = await fetch(
        `https://lv-back.online/presupuestos/${orden.id}`
      );
      const presupuestoExiste = await verificarResponse.json();

      let response;
      if (presupuestoExiste) {
        response = await fetch(
          `https://lv-back.online/presupuestos/modificar/${orden.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          }
        );
      } else {
        // Crear un nuevo presupuesto
        response = await fetch("https://lv-back.online/presupuestos/guardar", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });
      }

      if (response.ok) {
        const result = await response.json();
        console.log("Presupuesto guardado/modificado con éxito!!!");
        console.log(result);
        localStorage.setItem(
          "presupuestoData",
          JSON.stringify({
            producto,
            montos,
            selectedOption,
            formaPago,
            estado,
            selectedList,
            selectedOptions,
            acceptedPolicies,
            signature1,
            signature2,
            plazosCheckboxValues,
          })
        );
      } else {
        console.log(
          "Se produjo un error al guardar/modificar el presupuesto..."
        );
        console.log(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    } finally {
      console.log("Finalizando la operación de guardar/modificar presupuesto");
    }
  };

  // Función para procesar id_plazo_reparacion
  const procesarPlazoReparacion = (plazosCheckboxValues: any[]) => {
 
    // Asume que plazosCheckboxValues es un array de booleanos y devuelve el índice del primer valor verdadero o 0 si todos son falsos
    const index =
      plazosCheckboxValues.findIndex((value) => value) !== -1
        ? plazosCheckboxValues.findIndex((value) => value)
        : 0;
    return parseInt(index.toString(), 10);  
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
                {repuestos.map((item, index) => (
                  <IonItem key={index}>
                    <IonLabel>{item.descripcion}</IonLabel>
                    <IonCheckbox
                      slot="end"
                      onIonChange={() => handleSelect(item.descripcion)}
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
                  {medioPago.map((medio, index) => (
                    <IonSelectOption key={index} value={medio}>
                      {medio.medio_de_pago}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </div>
            </div>
            <div className="section">
              <h2>Tiempo estimado de reparación/diagnóstico</h2>
              <div className="checkbox-container">
                {plazos.map((plazo, index) => (
                  <div key={index} className="checkbox-item">
                    <IonCheckbox
                      checked={plazosCheckboxValues.includes(plazo.id)}
                      onIonChange={(e) => {
                        const isChecked = e.detail.checked;
                        if (isChecked) {
                          setPlazosCheckboxValues((prevValues) => [
                            ...prevValues,
                            plazo.id,
                          ]);
                        } else {
                          setPlazosCheckboxValues((prevValues) =>
                            prevValues.filter((id) => id !== plazo.id)
                          );
                        }
                      }}
                      className="checkbox"
                    />
                    <span>{plazo.texto}</span>
                  </div>
                ))}
              </div>

              <div>
                <IonSelect
                  placeholder="Estado"
                  value={estado}
                  onIonChange={(e) => setEstado(e.detail.value)}
                  className="estado-select"
                >
                  {estados.map((estado, index) => (
                    <IonSelectOption key={index} value={estado.id}>
                      {estado.texto}
                    </IonSelectOption>
                  ))}
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
                    width: "95%",
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
