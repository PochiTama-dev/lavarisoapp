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
import { useOrden } from "../../Provider/Provider";
import { useHistory } from "react-router-dom";
import {
  fetchPlazosReparacion,
  estadosPresupuestos,
  listaRepuestos,
  mediosDePago,
  cancelarOrden,
  modificarPresupuesto,
  guardarPresupuesto,
  createRepuestoOrden,
  getRepuestosOrdenById,
  Repuesto,
  MedioDePago,
  FormaPago,
} from "./fetchs";
import { modificarStockCamioneta } from "../../components/Repuestos/FetchsRepuestos";
const Presupuesto: React.FC = () => {
  const [montos, setMontos] = useState(Array(7).fill(0));
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
  const [showAlert2, setShowAlert2] = useState(false);
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const sigCanvas1 = useRef<SignatureCanvas>(null);
  const sigCanvas2 = useRef<SignatureCanvas>(null);
  const [plazos, setPlazos] = useState<any[]>([]);
  const [plazosCheckboxValues, setPlazosCheckboxValues] = useState<number[]>(
    []
  );
  const history = useHistory();
  const handleAcceptPoliciesChange = (event: CustomEvent) => {
    setAcceptedPolicies(event.detail.checked);
  };
  const [estados, setEstados] = useState<any[]>([]);
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [medioPago, setMedioPago] = useState<MedioDePago[]>([]);
  const [selectedMedioPago, setSelectedMedioPago] = useState<number | null>(
    null
  );
  const [selectedEstadoPresupuesto, setSelectedEstadoPresupuesto] = useState<
    number | null
  >(null);
  const [inputErrors, setInputErrors] = useState({
    montos: false,
    medioPago: false,
    estadoPresupuesto: false,
    acceptedPolicies: false,
    plazos: false,
  });

  const {
    cargarOrdenes,
    selectedRepuestos,
    ordenActiva,
    setOrdenActiva,
    repuestosCamioneta,
  } = useOrden();

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
    newMontos[index] = Number(value);
    setMontos(newMontos);
  };

  const updateRepuestoCantidad = async (id: number, nuevaCantidad: number) => {
    const repuestoActualizado = { cantidad: nuevaCantidad };
    try {
      await modificarStockCamioneta(id, repuestoActualizado);
    } catch (error) {
      console.error("Error al actualizar la cantidad del repuesto:", error);
    }
  };

  const [repuestosOrden, setRepuestosOrden] = useState([]);

  ///////////////// MODIFICAR ACA
  useEffect(() => {
    const fetchRepuestos = async () => {
      try {
        const data = await getRepuestosOrdenById(ordenActiva);
        const lista = await listaRepuestos();

        const repuestosConPrecio = data.map(
          (repuesto: { id_repuesto: any }) => {
            const repuestoEncontrado = lista.find(
              (r: { id_repuesto_camioneta: any; id_repuesto_taller: any }) =>
                r.id_repuesto_camioneta === repuesto.id_repuesto ||
                r.id_repuesto_taller === repuesto.id_repuesto
            );

            const precio = repuestoEncontrado
              ? repuestoEncontrado.precio
              : null;

            return {
              ...repuesto,
              precio: precio,
            };
          }
        );

        setRepuestosOrden(repuestosConPrecio);
      } catch (error) {
        console.error("Error al obtener repuestos:", error);
      }
    };

    if (ordenActiva) {
      fetchRepuestos();
    }
  }, [ordenActiva]);

  const totalMontos = montos.reduce((a, b) => a + parseFloat(b), 0);
  const total = totalMontos;
  // AGREGAR RESPUESTOS DE CAMIONETA
  const agregarRepuestos = async () => {
    try {
      await Promise.all(
        selectedRepuestos.map(async (repuesto) => {
          const repuestoOrdenData = {
            id_orden: ordenActiva.id,
            id_repuesto_taller: null,
            id_repuesto_camioneta: repuesto.id_repuesto,
            nombre: repuesto.StockPrincipal.nombre,
            cantidad: repuesto.cantidad,
          };

          console.log(
            "Datos a enviar a createRepuestoOrden:",
            repuestoOrdenData
          );

          await createRepuestoOrden(repuestoOrdenData);

          console.log("Repuesto agregado:", repuestoOrdenData);
        })
      );

      console.log("Todos los repuestos se han agregado correctamente.");
    } catch (error) {
      console.error("Error al agregar repuestos:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setPlazos(await fetchPlazosReparacion());
      setEstados(await estadosPresupuestos());
      setRepuestos(await listaRepuestos());
      setMedioPago(await mediosDePago());
    };

    loadData();
  }, []);

  useEffect(() => {
    if (ordenActiva) {
      setFormaPago(ordenActiva.Presupuesto?.formaPago || null);
      setEstado(ordenActiva.Presupuesto?.estado || "");
      setSelectedList(ordenActiva.Presupuesto?.selectedList || []);
      setAcceptedPolicies(ordenActiva.Presupuesto?.acceptedPolicies || true);
      setPlazosCheckboxValues(
        [ordenActiva.Presupuesto?.id_plazo_reparacion] || []
      );
      setSelectedMedioPago(ordenActiva.Presupuesto?.id_medio_de_pago || null);
      setSelectedEstadoPresupuesto(
        ordenActiva.Presupuesto?.id_estado_presupuesto || null
      );

      setMontos([
        ordenActiva.Presupuesto?.viaticos || 0,
        ordenActiva.Presupuesto?.descuentos_referidos || 0,
        ordenActiva.Presupuesto?.comision_visita || 0,
        ordenActiva.Presupuesto?.comision_reparacion || 0,
        ordenActiva.Presupuesto?.comision_entrega || 0,
        ordenActiva.Presupuesto?.comision_reparacion_domicilio || 0,
        ordenActiva.Presupuesto?.gasto_impositivo || 0,
      ]);

      const firmaClienteDataURL = ordenActiva.Presupuesto?.firma_cliente;
      const firmaEmpleadoDataURL = ordenActiva.Presupuesto?.firma_empleado;

      if (sigCanvas1.current) {
        sigCanvas1.current.fromDataURL(firmaClienteDataURL);
      }
      if (sigCanvas2.current) {
        sigCanvas2.current.fromDataURL(firmaEmpleadoDataURL);
      }
    }
  }, [ordenActiva]);

  const handleMedioPagoChange = (event: CustomEvent) => {
    setSelectedMedioPago(event.detail.value);
  };

  const handleEstadoPresupuestoChange = (event: CustomEvent) => {
    setSelectedEstadoPresupuesto(event.detail.value);
  };

  const validarCampos = () => {
    const newInputErrors = { ...inputErrors };
    let isValid = true;

    if (montos.every((monto) => monto <= 0)) {
      newInputErrors.montos = true;
      isValid = false;
    } else {
      newInputErrors.montos = false;
    }

    if (selectedMedioPago === null) {
      newInputErrors.medioPago = true;
      isValid = false;
    } else {
      newInputErrors.medioPago = false;
    }

    if (selectedEstadoPresupuesto === null) {
      newInputErrors.estadoPresupuesto = true;
      isValid = false;
    } else {
      newInputErrors.estadoPresupuesto = false;
    }

    if (!acceptedPolicies) {
      newInputErrors.acceptedPolicies = true;
      isValid = false;
    } else {
      newInputErrors.acceptedPolicies = false;
    }

    if (plazosCheckboxValues.length === 0) {
      newInputErrors.plazos = true;
      isValid = false;
    } else {
      newInputErrors.plazos = false;
    }

    setInputErrors(newInputErrors);
    return isValid;
  };

  const handleConfirmarClick = async () => {
    if (!validarCampos()) {
      setShowAlert(true);
      return;
    }
    setShowConfirmAlert(true);
  };

  const toggleOrdenActiva = (orden: any) => {
    setOrdenActiva(orden);
    localStorage.setItem("ordenActiva", JSON.stringify(orden));
    localStorage.removeItem("diagnosticoData");
    localStorage.removeItem("presupuestoData");
  };

  const handleConfirm = async () => {
    setShowConfirmAlert(false);

    let presupuestoId = ordenActiva ? ordenActiva.Presupuesto?.id : null;

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
    const id_plazo_reparacion =
      plazosCheckboxValues.length > 0 ? plazosCheckboxValues[1] : 0;

    const dataToSend = {
      id_orden: ordenActiva.id,
      id_plazo_reparacion,
      id_medio_de_pago: selectedMedioPago,
      id_estado_presupuesto: selectedEstadoPresupuesto,
      firma_cliente,
      firma_empleado,
      selectedList,
      acceptedPolicies,
      ...serviciosMontos,
      total,
    };

    try {
      let response;

      if (presupuestoId) {
        for (const repuesto of selectedRepuestos) {
          const repuestoOriginal = repuestosCamioneta.find(
            (item) => item.id_repuesto === repuesto.id_repuesto
          );
          if (repuestoOriginal) {
            await updateRepuestoCantidad(
              repuestoOriginal.id,
              repuestoOriginal.cantidad
            );
          }
        }
        //@ts-ignore
        response = await modificarPresupuesto(presupuestoId, dataToSend);
      } else {
        //@ts-ignore
        response = await guardarPresupuesto(dataToSend);
      }

      // Verificar que response no sea undefined antes de acceder a response.ok
      if (response && response.ok) {
        console.log("Presupuesto guardado/modificado con éxito!!!");

        setOrdenActiva((prevOrden: any) => {
          return {
            ...prevOrden,
            Presupuesto: { ...dataToSend },
          };
        });
        console.log(ordenActiva);

        history.push("/verOrden");
        agregarRepuestos();
        cargarOrdenes();
      } else {
        console.error("Error al guardar/modificar el presupuesto");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

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

  const handleCancelarOrden = async () => {
    setShowAlert(false);
    try {
      console.log("Cancelando orden:", ordenActiva.id);

      const response = await cancelarOrden(ordenActiva.id);

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

  const handleConfirmAlertCancel = () => {
    setShowConfirmAlert(false);
  };

  const handleRepuestos = () => {
    history.push({
      pathname: "/repuestosDomicilio",
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      <IonContent>
        <div className="diagnostico-ctn">
          <div className="section">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <h2>Repuestos</h2>
              <IonButton
                style={{
                  width: "120px",
                  height: "40px",
                  margin: "-10px 0 20px 0",
                }}
                onClick={handleRepuestos}
              >
                Seleccionar{" "}
              </IonButton>
            </div>
            <IonList>
              {Array.isArray(selectedRepuestos) &&
              selectedRepuestos.length > 0 ? (
                selectedRepuestos.map((repuesto) => (
                  <IonItem key={repuesto.id_repuesto}>
                    <IonLabel
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        fontSize: "16px",
                      }}
                    >
                      <span>
                        {repuesto.StockPrincipal?.nombre
                          ? repuesto.StockPrincipal.nombre
                          : repuesto.nombre}{" "}
                        x{repuesto.cantidad}
                      </span>
                      {/* <span>${(parseFloat(repuesto.StockPrincipal.precio) * repuesto.cantidad).toFixed(2)}</span> */}
                    </IonLabel>
                  </IonItem>
                ))
              ) : (
                <IonItem>
                  <IonLabel style={{ fontSize: "18px" }}>
                    No hay repuestos seleccionados.
                  </IonLabel>
                </IonItem>
              )}
            </IonList>

            <IonModal isOpen={showModal}>
              <IonSearchbar
                value={searchText || ""}
                onIonChange={(e) => setSearchText(e.detail.value || "")}
              />
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
                  setSelectedList((prevList) => [
                    ...prevList,
                    ...selectedOptions.filter(
                      (option) => !prevList.includes(option)
                    ),
                  ]);
                  setShowModal(false);
                }}
              >
                Cerrar
              </IonButton>
            </IonModal>
            {/* LISTA REPUESTOS SELECCIONADOS */}
            {selectedList.length > 0 && (
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
            )}

            <div
              className="separador"
              style={{
                borderBottom: "2px solid #000",
                margin: "20px 10px",
                width: "90%",
              }}
            />

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
                      className={inputErrors.montos ? "input-error" : ""}
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
              />
              <h2>Forma de pago</h2>
              <IonSelect
                className={inputErrors.medioPago ? "select-error" : ""}
                value={selectedMedioPago}
                placeholder="Seleccione medio de pago"
                onIonChange={handleMedioPagoChange}
              >
                {medioPago.map((medio) => (
                  <IonSelectOption key={medio.id} value={medio.id}>
                    {medio.medio_de_pago}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
            <div
              className="separador"
              style={{
                borderBottom: "2px solid #000",
                margin: "20px 10px",
                width: "90%",
              }}
            />

            <div className="section">
              <h2>Tiempo estimado de reparación/diagnóstico</h2>
              <div className="checkbox-container">
                {plazos.map((plazo, index) => (
                  <div key={index} className="checkbox-item">
                    <IonCheckbox
                      checked={plazosCheckboxValues.includes(plazo.id)}
                      onIonChange={(e) => {
                        const isChecked = e.detail.checked;
                        setPlazosCheckboxValues((prevValues) =>
                          isChecked
                            ? [...prevValues, plazo.id]
                            : prevValues.filter((id) => id !== plazo.id)
                        );
                      }}
                      className="checkbox"
                    />
                    <span>{plazo.texto}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="separador"
              style={{
                borderBottom: "2px solid #000",
                margin: "20px 10px",
                width: "90%",
              }}
            />

            <div className="section">
              <h2>Estado de reparación</h2>

              <IonSelect
                value={selectedEstadoPresupuesto}
                placeholder="Seleccione estado"
                onIonChange={handleEstadoPresupuestoChange}
              >
                {estados.map((estado) => (
                  <IonSelectOption key={estado.id} value={estado.id}>
                    {estado.texto}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>

            <div>
              <div
                className="separador"
                style={{
                  borderBottom: "2px solid #000",
                  margin: "20px 10px",
                  width: "90%",
                }}
              />
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
                    eget ultricies lectus...
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IonCheckbox
                    checked={acceptedPolicies}
                    className={acceptedPolicies ? "" : "checkbox-error"}
                    onIonChange={handleAcceptPoliciesChange}
                  />
                  <span style={{ marginLeft: "20px" }}>
                    Acepto las políticas de garantía
                  </span>
                  <IonAlert
                    isOpen={showAlert2}
                    onDidDismiss={() => setShowAlert2(false)}
                    header="Error"
                    message="Debe aceptar las políticas de privacidad para continuar."
                    buttons={["OK"]}
                  />
                </div>
              </div>
              <div
                className="separador"
                style={{
                  borderBottom: "2px solid #000",
                  margin: "20px 10px",
                  width: "90%",
                }}
              />

              <h2>Firmas</h2>
              {["Cliente", "Técnico"].map((role, index) => (
                <div className="firma" key={index}>
                  <h3>Firma {role}</h3>
                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{
                      width: 500,
                      height: 200,
                      className: "sigCanvas",
                    }}
                    ref={index === 0 ? sigCanvas1 : sigCanvas2}
                    onEnd={() =>
                      index === 0
                        ? setSignature1(sigCanvas1.current?.toDataURL() || "")
                        : setSignature2(sigCanvas2.current?.toDataURL() || "")
                    }
                  />
                  <IonButton
                    onClick={() =>
                      index === 0
                        ? sigCanvas1.current?.clear()
                        : sigCanvas2.current?.clear()
                    }
                  >
                    Borrar
                  </IonButton>
                </div>
              ))}
            </div>

            <div className="section">
              <IonButton
                className="button"
                style={{ "--border-radius": "20px" }}
                onClick={handleConfirmarClick}
              >
                Confirmar
              </IonButton>
              <IonAlert
                isOpen={showConfirmAlert}
                onDidDismiss={handleConfirmAlertCancel}
                header="Confirmar"
                message="¿Desea confirmar la operación?"
                buttons={[
                  {
                    text: "Cancelar",
                    role: "cancel",
                    handler: handleConfirmAlertCancel,
                  },
                  { text: "Confirmar", handler: handleConfirm },
                ]}
              />
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
                    handler: () => setShowAlert(false),
                  },
                  { text: "Sí", handler: handleCancelarOrden },
                ]}
              />
              <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header={"Error de validación"}
                message={"Por favor, complete todos los campos requeridos."}
                buttons={["OK"]}
              />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Presupuesto;
