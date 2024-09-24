import React, { useState, useEffect, useRef } from "react";
import { IonContent, IonPage, IonCheckbox, IonInput, IonButton, IonSelect, IonSelectOption, IonModal, IonSearchbar, IonList, IonItem, IonLabel, IonHeader, IonAlert } from "@ionic/react";
import "./presupuesto.css";
import { useOrden } from "../../pages/Orden/ordenContext";
import SignatureCanvas from "react-signature-canvas";
import HeaderGeneral from "../../components/Header/HeaderGeneral";
import { useHistory, useLocation } from "react-router-dom";
import { fetchPlazosReparacion, estadosPresupuestos, listaRepuestos, mediosDePago, createRepuestoOrden, getRepuestosOrdenById } from "./fetchsFunctions";

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
 const [checkboxValues, setCheckboxValues] = useState<boolean[]>(Array(6).fill(false));
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
 const [showAlert2, setShowAlert2] = useState(false);
 const [showConfirmAlert, setShowConfirmAlert] = useState(false);
 const sigCanvas1 = useRef<SignatureCanvas>(null);
 const sigCanvas2 = useRef<SignatureCanvas>(null);
 const [plazos, setPlazos] = useState<any[]>([]);
 const [plazosCheckboxValues, setPlazosCheckboxValues] = useState<number[]>([]);
 const history = useHistory();
 const handleAcceptPoliciesChange = (event: CustomEvent) => {
  setAcceptedPolicies(event.detail.checked);
 };
 const [estados, setEstados] = useState<any[]>([]);
 const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
 const [medioPago, setMedioPago] = useState<MedioDePago[]>([]);
 const [selectedMedioPago, setSelectedMedioPago] = useState<number | null>(null);
 const [selectedEstadoPresupuesto, setSelectedEstadoPresupuesto] = useState<number | null>(null);

 const location = useLocation();
 const { orden } = location.state as { orden: any };
 const ordenId = orden.id; 
 const { ordenSeleccionada, setOrdenSeleccionada, selectedRepuestos} = useOrden();
console.log("SELECTED REPUESTOS", selectedRepuestos)
 const servicios = ["Viaticos", "Descuentos", "Comisión visita", "Comisión reparación", "Comisión entrega", "Comisión rep. a domicilio", "Gasto impositivo"] as const;

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

/*

 const [repuestos2, setRepuestos2] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchRepuestos = async () => {
      try {
        const data = await getRepuestosOrdenById(ordenId);
        setRepuestos2(data);
        console.log("REPEUSTO:", repuestos2)
        // Calcular el total
        const calculatedTotal = data.reduce((acc, repuesto) => acc + repuesto.precio * repuesto.cantidad, 0);
        setTotal(calculatedTotal);
    
        console.log("TOTAL:", total)
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (ordenId) {
      fetchRepuestos();
    }
  }, []); 
  


*/








 const totalRepuestos =
 Array.isArray(selectedRepuestos) && selectedRepuestos.length > 0
 ? selectedRepuestos.reduce((accumulator: number, repuesto) => {
   const precio = parseFloat(repuesto.StockPrincipal.precio) || 0;
       // @ts-ignore
   const cantidad = parseFloat(repuesto.cantidad) || 0;
 
   return accumulator + precio * cantidad;
     }, 0)
   : 0;

const totalMontos = montos.reduce((a, b) => a + parseFloat(b), 0);
const total = totalMontos + totalRepuestos;
 


const agregarRepuestos = async () => {
  try {
    // Log para asegurarse de que se están seleccionando los repuestos
    console.log("Repuestos seleccionados:", selectedRepuestos);

    await Promise.all(
      selectedRepuestos.map(async (repuesto) => {
        // Log de cada repuesto individual antes de enviar los datos
        console.log("Procesando repuesto:", repuesto);

        const repuestoOrdenData = {
          id_orden: orden.id,
          id_repuesto_taller: null,
          id_repuesto_camioneta: repuesto.id_repuesto,
          nombre: repuesto.StockPrincipal.nombre,
          cantidad: repuesto.cantidad,
        };

        // Log del objeto que se va a enviar a createRepuestoOrden
        console.log("Datos a enviar a createRepuestoOrden:", repuestoOrdenData);

        await createRepuestoOrden(repuestoOrdenData);
        
        // Log de confirmación de que el repuesto se ha agregado
        console.log("Repuesto agregado:", repuestoOrdenData);
      })
    );

    console.log('Todos los repuestos se han agregado correctamente.');
  } catch (error) {
    // Log en caso de error
    console.error('Error al agregar repuestos:', error);
  }
};









 useEffect(() => {
  if (orden && !orden.Presupuesto) {
   setProducto(orden.producto || "");
   setMarca(orden.marca || "");
   setModelo(orden.modelo || "");
   setCliente(orden.cliente || "");
   setFormaPago([]);
   setEstado([]);
   setSelectedList([]);
   setAcceptedPolicies(false);

   const initialMontos = servicios.map(() => 0);
   setMontos(initialMontos);

   setPlazosCheckboxValues([]);
   setSelectedMedioPago(null);
   setSelectedEstadoPresupuesto(null);
  }
 }, [orden]);
 useEffect(() => {
  const loadData = async () => {
   setPlazos(await fetchPlazosReparacion());
   setEstados(await estadosPresupuestos());
   setRepuestos(await listaRepuestos());
   setMedioPago(await mediosDePago());

   if (orden && orden.Presupuesto) {
    setProducto(orden.Presupuesto.producto || "");
    setFormaPago(orden.Presupuesto.formaPago || null);
    setEstado(orden.Presupuesto.estado || "");
    setSelectedList(orden.Presupuesto.selectedList || []);
    setAcceptedPolicies(orden.Presupuesto.acceptedPolicies || true);
    setPlazosCheckboxValues([orden.Presupuesto.id_plazo_reparacion] || []);
    setSelectedMedioPago(orden.Presupuesto.id_medio_de_pago || null);
    setSelectedEstadoPresupuesto(orden.Presupuesto.id_estado_presupuesto || null);

    setMontos([
     orden.Presupuesto.viaticos || 0,
     orden.Presupuesto.descuentos_referidos || 0,
     orden.Presupuesto.comision_visita || 0,
     orden.Presupuesto.comision_reparacion || 0,
     orden.Presupuesto.comision_entrega || 0,
     orden.Presupuesto.comision_reparacion_domicilio || 0,
     orden.Presupuesto.gasto_impositivo || 0,
    ]);

    const firmaClienteDataURL = orden.Presupuesto.firma_cliente;
    const firmaEmpleadoDataURL = orden.Presupuesto.firma_empleado;

    if (sigCanvas1.current) {
     sigCanvas1.current.fromDataURL(firmaClienteDataURL);
    }
    if (sigCanvas2.current) {
     sigCanvas2.current.fromDataURL(firmaEmpleadoDataURL);
    }
   } else {
    const savedData = JSON.parse(localStorage.getItem("presupuestoData") || "{}");
    setMontos(savedData.montos || Array(7).fill(0));
    setProducto(savedData.producto || "");
    setFormaPago(savedData.formaPago || null);
    setEstado(savedData.estado || "");
    setSelectedList(savedData.selectedList || []);
    setAcceptedPolicies(savedData.acceptedPolicies || false);
    setSignature1(savedData.signature1 || "");
    setSignature2(savedData.signature2 || "");
    setPlazosCheckboxValues(savedData.plazosCheckboxValues || []);
    setSelectedMedioPago(savedData.selectedMedioPago || null);
    setSelectedEstadoPresupuesto(savedData.selectedEstadoPresupuesto || null);

    if (sigCanvas1.current) {
     sigCanvas1.current.fromDataURL(savedData.signature1 || "");
    }
    if (sigCanvas2.current) {
     sigCanvas2.current.fromDataURL(savedData.signature2 || "");
    }
   }
  };

  loadData();
 }, [orden]);

 const handleMedioPagoChange = (event: CustomEvent) => {
  setSelectedMedioPago(event.detail.value);
 };

 const handleEstadoPresupuestoChange = (event: CustomEvent) => {
  setSelectedEstadoPresupuesto(event.detail.value);
 };

 
 const handleConfirmarClick = async () => {
  if (!acceptedPolicies) {
   setShowAlert2(true);
  } else {
   setShowConfirmAlert(true);
  }
 };

 const handleConfirmAlert = async () => {
  setShowConfirmAlert(false);
  if (!orden) {
   console.error("La orden no está definida");
   return;
  }
  let presupuestoId = orden.Presupuesto ? orden.Presupuesto.id : null;

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

  const id_plazo_reparacion = plazosCheckboxValues.length > 0 ? plazosCheckboxValues[0] : null;

  const dataToSend = {
   id_orden: orden.id,
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

  console.log("Datos a enviar:", dataToSend);

  try {
   let response;

   if (presupuestoId) {
    response = await fetch(`https://lv-back.online/presupuestos/modificar/${presupuestoId}`, {
     method: "PUT",
     headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify(dataToSend),
    });
   } else {
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
    localStorage.removeItem("ordenActiva");
    history.push("/domicilio");
    agregarRepuestos()
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
      total,
      observaciones,
     })
    );
    setShowModal(false);
    setProducto("");
    setMarca("");
    setModelo("");
    setCliente("");
    setCheckboxValues(Array(6).fill(false));
    setMontos([0, 0, 0, 0, 0, 0, 0]);
    setObservaciones("");
    setSelectedOption("");
    setFormaPago([]);
    setEstado([]);
    setSelectedList([]);
    setSelectedOptions([]);
    setAcceptedPolicies(false);
    setSignature1("");
    setSignature2("");
    setPlazosCheckboxValues([]);
    setSelectedMedioPago(null);
    setSelectedEstadoPresupuesto(null);
    setShowAlert(false);
   } else {
    console.error("Error al guardar/modificar el presupuesto");
    setShowAlert(true);
   }
  } catch (error) {
   console.error("Error en la solicitud:", error);
   setShowAlert(true);
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

 const handleCancelAlert = () => {
  setShowAlert(true);
 };

 const handleCancelarOrden = async () => {
  setShowAlert(false);
  try {
   console.log("Cancelando orden:", orden.id);

   const response = await fetch(`https://lv-back.online/ordenes/modificar/${orden.id}`, {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     id_tipo_estado: 2, // 2 es el ID para el estado "cancelada"
    }),
   });

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
   alert("Error al realizar la solicitud. Verifique su conexión e intente nuevamente.");
  }
 };

 const handleConfirmAlertCancel = () => {
  setShowConfirmAlert(false);
 };

 const handleRepuestos = () => {
  history.push({
    pathname: "/repuestosDomicilio",
    state: { orden }  // Pasas la orden como parte del estado
  });
};


 return (
  <IonPage>
   <IonHeader>
    <HeaderGeneral />
   </IonHeader>
   <IonContent>
    <div className='diagnostico-ctn'>
     <div className='section'>
      <h2>Presupuestar</h2>
      <IonButton onClick={handleRepuestos}>Seleccionar repuesto</IonButton>
      <IonList>
       {Array.isArray(selectedRepuestos) && selectedRepuestos.length > 0 ? (
        selectedRepuestos.map((repuesto: any) => (
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
            {repuesto.StockPrincipal.nombre} x{repuesto.cantidad}
           </span>
           <span>${(parseFloat(repuesto.StockPrincipal.precio) * repuesto.cantidad).toFixed(2)}</span>
          </IonLabel>
         </IonItem>
        ))
       ) : (
        <IonItem>
         <IonLabel>No hay repuestos seleccionados.</IonLabel>
        </IonItem>
       )}
      </IonList>
      <IonModal isOpen={showModal}>
       <IonSearchbar value={searchText || ""} onIonChange={(e) => setSearchText(e.detail.value || "")}></IonSearchbar>

       <IonList>
        {repuestos.map((item, index) => (
         <IonItem key={index}>
          <IonLabel>{item.descripcion}</IonLabel>
          <IonCheckbox slot='end' onIonChange={() => handleSelect(item.descripcion)} />
         </IonItem>
        ))}
       </IonList>
       <IonButton
        onClick={() => {
         setSelectedList((prevList) => {
          const newItems = selectedOptions.filter((option) => !prevList.includes(option));
          return [...prevList, ...newItems];
         });
         setShowModal(false);
        }}
       >
        Cerrar
       </IonButton>
      </IonModal>

      <div className='item'>
       <ul>
        {selectedList.map((item, index) => (
         <li key={index}>
          {item}
          <button style={{ marginLeft: "10px" }} onClick={() => handleRemove(item)}>
           x
          </button>
         </li>
        ))}
       </ul>
      </div>
      <div className='servicios' style={{ display: "flex", flexDirection: "column" }}>
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
          <IonInput style={{ width: "100px", marginLeft: "20px" }} type='number' value={monto} onIonChange={(e) => handleMontoChange(index, e.detail.value)} />
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
        className='separador'
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
        <IonSelect value={selectedMedioPago} placeholder='Seleccione medio de pago' onIonChange={handleMedioPagoChange}>
         {medioPago.map((medio) => (
          <IonSelectOption key={medio.id} value={medio.id}>
           {medio.medio_de_pago}
          </IonSelectOption>
         ))}
        </IonSelect>
       </div>
      </div>
      <div className='section'>
       <h2>Tiempo estimado de reparación/diagnóstico</h2>
       <div className='checkbox-container'>
        {plazos.map((plazo, index) => (
         <div key={index} className='checkbox-item'>
          <IonCheckbox
           checked={plazosCheckboxValues.includes(plazo.id)}
           onIonChange={(e) => {
            const isChecked = e.detail.checked;
            if (isChecked) {
             setPlazosCheckboxValues((prevValues) => [...prevValues, plazo.id]);
            } else {
             setPlazosCheckboxValues((prevValues) => prevValues.filter((id) => id !== plazo.id));
            }
           }}
           className='checkbox'
          />
          <span>{plazo.texto}</span>
         </div>
        ))}
       </div>

       <div>
        <IonSelect value={selectedEstadoPresupuesto} placeholder='Seleccione estado' onIonChange={handleEstadoPresupuestoChange}>
         {estados.map((estado) => (
          <IonSelectOption key={estado.id} value={estado.id}>
           {estado.texto}
          </IonSelectOption>
         ))}
        </IonSelect>
       </div>
      </div>

      <div>
       <div
        className='separador'
        style={{
         borderBottom: "2px solid #000",
         margin: "20px 10px",
         width: "90%",
        }}
       ></div>

       <div className='section'>
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
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget ultricies lectus. Ut sit amet aliquet...</p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
         <IonCheckbox checked={acceptedPolicies} onIonChange={handleAcceptPoliciesChange} />
         <span
          style={{
           marginLeft: "20px",
          }}
         >
          Acepto las políticas de garantía
         </span>
         <IonAlert isOpen={showAlert2} onDidDismiss={() => setShowAlert2(false)} header='Error' message='Debe aceptar las políticas de privacidad para continuar.' buttons={["OK"]} />
        </div>
       </div>
       <h2>Firmas</h2>
       <div className='firma'>
        <h3>Firma Cliente</h3>
        <SignatureCanvas
         penColor='black'
         canvasProps={{
          width: 500,
          height: 200,
          className: "sigCanvas",
         }}
         ref={sigCanvas1}
         onEnd={() => setSignature1(sigCanvas1.current?.toDataURL() || "")}
        />
        <IonButton onClick={() => sigCanvas1.current?.clear()}>Borrar</IonButton>
       </div>
       <div className='firma'>
        <h3>Firma Técnico</h3>
        <SignatureCanvas
         penColor='black'
         canvasProps={{
          width: 500,
          height: 200,
          className: "sigCanvas",
         }}
         ref={sigCanvas2}
         onEnd={() => setSignature2(sigCanvas2.current?.toDataURL() || "")}
        />
        <IonButton onClick={() => sigCanvas2.current?.clear()}>Borrar</IonButton>
       </div>
      </div>

      <div className='section'>
       <IonButton className='button' style={{ "--border-radius": "20px" }} onClick={handleConfirmarClick}>
        Confirmar
       </IonButton>
       <IonAlert
        isOpen={showConfirmAlert}
        onDidDismiss={handleConfirmAlertCancel}
        header='Confirmar'
        message='¿Desea confirmar la operación?'
        buttons={[
         {
          text: "Cancelar",
          role: "cancel",
          handler: handleConfirmAlertCancel,
         },
         {
          text: "Confirmar",
          handler: handleConfirmAlert,
         },
        ]}
       />
       <IonButton
        className='button'
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
    </div>
   </IonContent>
  </IonPage>
 );
};

export default Presupuesto;
