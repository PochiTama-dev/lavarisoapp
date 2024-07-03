import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
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
import { useLocation } from "react-router-dom";
import "../Diagnostico/diagnostico.css";
import SignatureCanvas from "react-signature-canvas";
import "./entrega.css";
import CancelarOrden from "../../components/Orden/CancelarOrden";
import HeaderGeneral from "../../components/Header/HeaderGeneral";

const Entrega: React.FC = () => {
  const location = useLocation();
  const { orden } = location.state as { orden: any };

  const [modal, setModal] = useState(false);
  const [producto, setProducto] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cliente, setCliente] = useState("");
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>([]);
  const [observaciones, setObservaciones] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [signature1, setSignature1] = useState("");
  const [signature2, setSignature2] = useState("");
  const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
  const [ordenSelected, setOrdenSelected] = useState<any>(null);

  useEffect(() => {
    fetchTiposFunciones();
    if (orden && orden.id) {
      fetchOrden(orden.id);
    }
  }, [orden]);

  const fetchOrden = async (id: any) => {
    try {
      const ordenResponse = await fetch(`https://lv-back.online/ordenes/${id}`);
      const clienteResponse = await fetch(
        "https://lv-back.online/clientes/lista"
      );

      if (!ordenResponse.ok || !clienteResponse.ok) {
        throw new Error("Error al obtener datos de las APIs");
      }

      const orden = await ordenResponse.json();
      const clientes = await clienteResponse.json();

      if (orden && clientes.length > 0) {
        const cliente = clientes.find(
          (c: { id: any }) => c.id === orden.id_cliente
        );
        const ordenConCliente = { ...orden, cliente };
        setOrdenSelected(ordenConCliente);
      } else {
        console.log(
          "No se encontraron la orden o el cliente en la base de datos."
        );
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
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
        setCheckboxValues(Array(funciones.length).fill(false));
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

  useEffect(() => {
    if (ordenSelected && ordenSelected.diagnostico) {
      const updatedCheckboxValues = textosCheckbox.map((texto) =>
        ordenSelected.diagnostico.includes(texto)
      );
      setCheckboxValues(updatedCheckboxValues);
    }
  }, [ordenSelected, textosCheckbox]);

  const guardarEntrega = async () => {
    const entrega = {
      id_orden: ordenSelected?.id || 0,
      firma_cliente: signature1,
      firma_empleado: signature2,
      recomienda: selectedOption === 'si' ? 1 : 0
    };
    try {
      const response = await fetch("https://lv-back.online/entregas/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrega)
      });
      const result = await response.json();
      if (result) {
        console.log("Entrega registrada con éxito!!!");
        return true;
      } else {
        console.log("Se produjo un error, la entrega no pudo ser registrada...");
        return false;
      }
    } catch (error) {
      console.error("Error al registrar la entrega.", error);
    }
  };

  const handleConfirmarClick = async () => {
    const dataToSend = {
      producto,
      marca,
      modelo,
      cliente,
      checkboxValues,
      observaciones,
    };
    console.log(dataToSend);

    const entregaGuardada = await guardarEntrega();
    if (entregaGuardada) {
      console.log("Entrega concretada con éxito.");
    } else {
      console.log("Error al concretar la entrega.");
    }
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
                disabled
                style={{ marginLeft: "10px" }}
                value={ordenSelected?.equipo || ""}
                placeholder="Ingrese producto"
                onIonChange={(e) => setProducto(e.detail.value!)}
              />
            </div>
            <div className="item">
              <span>
                <strong>Marca:</strong>
              </span>
              <IonInput
                disabled
                style={{ marginLeft: "10px" }}
                value={ordenSelected?.marca || ""}
                placeholder="Ingrese marca"
                onIonChange={(e) => setMarca(e.detail.value!)}
              />
            </div>
            <div className="item">
              <span>
                <strong>Modelo:</strong>
              </span>
              <IonInput
                disabled
                style={{ marginLeft: "10px" }}
                value={ordenSelected?.modelo || ""}
                placeholder="Ingrese modelo"
                onIonChange={(e) => setModelo(e.detail.value!)}
              />
            </div>
            <div className="item">
              <span>
                <strong>N° de cliente:</strong>
              </span>
              <IonInput
                disabled
                style={{ marginLeft: "10px" }}
                value={ordenSelected?.id_cliente || ""}
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
            <h2>¿Nos recomendarías? </h2>
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
            <button
              onClick={handleModal}
              className="button"
              style={{ borderRadius: "20px" }}
            >
              Cancelar orden
            </button>
            {modal && <CancelarOrden onCancel={handleModal} />}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Entrega;
