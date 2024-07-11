
import React, { useState, useEffect, useRef } from 'react';
 
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
  IonAlert,
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
  const [showAlert, setShowAlert] = useState(false);

  const [firmaCliente, setFirmaCliente] = useState<string>('');
  const [firmaTecnico, setFirmaTecnico] = useState<string>('');

  const sigCanvasCliente = useRef<SignatureCanvas | null>(null);
  const sigCanvasTecnico = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    fetchTiposFunciones();
    if (orden && orden.id) {
      fetchOrden(orden.id);
      obtenerEntrega(orden.id);
    }
  }, [orden]);

  const obtenerEntrega = async (id: any) => {
    try {
      const response = await fetch(`https://lv-back.online/entregas/orden/${id}`);
      const entrega = await response.json();
      if (entrega) {
        console.log(`Se encontró una entrega asociada al id ${id}`);
        console.log(entrega);
        setFirmaCliente(entrega.firma_cliente);
        setFirmaTecnico(entrega.firma_empleado);
        setSelectedOption(entrega.recomienda === 1 ? 'si' : 'no');
      } else {
        console.log(`No se encontró ninguna entrega con el id ${id}`);
      }
    } catch (error) {
      console.error("Error, entrega no encontrada.", error);
    }
  };
 

  useEffect(() => {
    fetchTiposFunciones();
    if (orden && orden.id) {
      fetchOrden(orden.id);
      obtenerEntrega(orden.id); 
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
console.log(firmaCliente)
  useEffect(() => {
    if (firmaCliente && sigCanvasCliente.current) {
      // Convertir la firma de base64 a URL de datos
      sigCanvasCliente.current.fromDataURL(firmaCliente);
    }
    if (firmaTecnico && sigCanvasTecnico.current) {
      // Convertir la firma de base64 a URL de datos
      sigCanvasTecnico.current.fromDataURL(firmaTecnico);
    }
  }, [firmaCliente, firmaTecnico]);



  const guardarEntrega = async () => {
    // Obtener las firmas en formato base64 desde los SignatureCanvas
    const firma_cliente = sigCanvasCliente.current?.toDataURL();
    const firma_empleado = sigCanvasTecnico.current?.toDataURL();
  
    const entrega = {
      id_orden: ordenSelected?.id || 0,
 
      firma_cliente: firma_cliente,
      firma_empleado: firma_empleado,
      recomienda: selectedOption === 'si' ? 1 : 0
 
    };
  
    try {
      const response = await fetch("https://lv-back.online/entregas/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrega),
      });
  
      const result = await response.json();
      if (result) {
        console.log("Entrega registrada con éxito!!!");
        return true;
      } else {
        console.log(
          "Se produjo un error, la entrega no pudo ser registrada..."
        );
        return false;
      }
    } catch (error) {
      console.error("Error al registrar la entrega.", error);
    }
  };

  const handleConfirmarClick = async () => {
    const dataToSend = {
      checkboxValues,
      observaciones,
      firmaCliente,
      firmaTecnico
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

  const handleCancelarOrden = async () => {
    setShowAlert(true);
    try {
      console.log("Cancelando orden:", orden.id);

      const response = await fetch(
        `https://lv-back.online/ordenes/modificar/${orden.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_tipo_estado: 2, // 2 es el ID para el estado "cancelada"
          }),
        }
      );

      if (response.ok) {
        console.log("Orden cancelada exitosamente");
        alert("Orden cancelada exitosamente");
        window.history.back();
      } else {
        console.log("Error al cancelar la orden");
        console.log(`Error: ${response.status} ${response.statusText}`);
        alert("Error al cancelar la orden. Intente nuevamente.");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      alert(
        "Error al realizar la solicitud. Verifique su conexión e intente nuevamente."
      );
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
            <h2>Entrega</h2>
            <div className="item">
              <span>
                <strong>Producto:</strong>
              </span>
              <IonInput
                disabled

                style={{ marginLeft: '10px' }}
                value={ordenSelected?.equipo || ''}
                placeholder='Ingrese producto'

                onIonChange={(e) => setProducto(e.detail.value!)}
              />
            </div>
            <div className="item">
              <span>
                <strong>Marca:</strong>
              </span>
              <IonInput
                disabled

                style={{ marginLeft: '10px' }}
                value={ordenSelected?.marca || ''}
                placeholder='Ingrese marca'

                onIonChange={(e) => setMarca(e.detail.value!)}
              />
            </div>
            <div className="item">
              <span>
                <strong>Modelo:</strong>
              </span>
              <IonInput
                disabled

                style={{ marginLeft: '10px' }}
                value={ordenSelected?.modelo || ''}
                placeholder='Ingrese modelo'

                onIonChange={(e) => setModelo(e.detail.value!)}
              />
            </div>
            <div className="item">
              <span>
                <strong>N° de cliente:</strong>
              </span>
              <IonInput
                disabled

                style={{ marginLeft: '10px' }}
                value={ordenSelected?.id_cliente || ''}
                placeholder='Ingrese N° de cliente'

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

              className='obs-input'
              value={orden.motivo}

              onIonChange={(e) => setObservaciones(e.detail.value!)}
              placeholder="Ingrese observaciones"
            />
          </div>
          <div className="section">
            <h2>Conformidad de la entrega</h2>
            <span>Firma del cliente</span>

            <div>

            <SignatureCanvas
              ref={sigCanvasCliente}
              penColor='black'
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
            />
                  <IonButton onClick={() => sigCanvasCliente.current?.clear()}>
                  Borrar
                </IonButton>
            </div>

            <span>Firma del técnico</span>
            <div>

            <SignatureCanvas
              ref={sigCanvasTecnico}
              penColor='black'
              canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
            />
             <IonButton onClick={() => sigCanvasTecnico.current?.clear()}>
                  Borrar
                </IonButton>

            </div>

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
                  handler: handleCancelarOrden,
                },
              ]}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Entrega;
