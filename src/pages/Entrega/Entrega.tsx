import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonPage, IonCheckbox, IonInput, IonButton, IonSelect, IonSelectOption, IonHeader, IonAlert, IonIcon } from "@ionic/react";
import { useLocation } from "react-router-dom";
import "../Diagnostico/diagnostico.css";
import SignatureCanvas from "react-signature-canvas";
import "./entrega.css";
import CancelarOrden from "../../components/Orden/CancelarOrden";
import HeaderGeneral from "../../components/Header/HeaderGeneral";
import { useOrden } from "../../Provider/Provider";
import { getRepuestosOrdenById, listaRepuestos } from "../Presupuesto/fetchs";          
import { cameraOutline } from "ionicons/icons";
import { entregaPago } from "../../Provider/fetchs";
 
interface MedioDePago {
 id: number;
 value: string;
 medio_de_pago: string;
}

const Entrega: React.FC = () => {
 const location = useLocation();
 const { orden } = location.state as { orden: any };
 const [checkboxValues, setCheckboxValues] = useState<boolean[]>([]);
 const [selectedOption, setSelectedOption] = useState("");
 const [signature1, setSignature1] = useState("");
 const [signature2, setSignature2] = useState("");
 const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
 const [showAlert, setShowAlert] = useState(false);
 const [showConfirmEntregaAlert, setShowConfirmEntregaAlert] = useState(false);
 const [showCancelAlert, setShowCancelAlert] = useState(false); // added state for cancel alert
 const [firmaCliente, setFirmaCliente] = useState<string>("");
 const [firmaTecnico, setFirmaTecnico] = useState<string>("");
 const sigCanvasCliente = useRef<SignatureCanvas | null>(null);
 const sigCanvasTecnico = useRef<SignatureCanvas | null>(null);
 const history = useHistory();
 const [repuestosOrden, setRepuestosOrden] = useState([]);
 const sigCanvas1 = useRef<SignatureCanvas>(null);
 const sigCanvas2 = useRef<SignatureCanvas>(null);
 const { ordenActiva } = useOrden();
 const [mediosPago, setMediosPago] = useState<MedioDePago[]>([]);
 const [importe, setImporte] = useState<string>("");
 const [estadoPago, setEstadoPago] = useState<string>("pendiente");
 const [imagenComprobante, setImagenComprobante] = useState<string>("");
 const [entregaId, setEntregaId] = useState<number | null>(null);
 
 const [selectedMedioPago, setSelectedMedioPago] = useState(ordenActiva.Presupuesto.id_medio_de_pago);

 useEffect(() => {
  fetchTiposFunciones();
  if (orden && orden.id) {
   obtenerEntrega(orden.id);
  }
 }, [orden]);

 const obtenerEntrega = async (id: any) => {
  try {
    const response = await fetch(`https://lv-back.online/entregas/orden/${id}`);
    const entrega = await response.json();

    if (entrega && entrega.firma_cliente && entrega.firma_empleado) {
      console.log(`Se encontró una entrega asociada al id ${id}`);
      console.log(entrega);
      setFirmaCliente(entrega.firma_cliente);
      setFirmaTecnico(entrega.firma_empleado);
      setSelectedOption(entrega.recomienda === 1 ? "si" : "no");
      return entrega; // Devolver el objeto entrega
    } else {
      console.log(`No se encontró ninguna entrega con el id ${id}, usando las firmas del presupuesto.`);
      return null; // Devolver null si no hay entrega
    }
  } catch (error) {
    console.error("Error al obtener la entrega, mostrando las firmas del presupuesto.", error);
    return null; // Devolver null en caso de error
  }
};


 useEffect(() => {
  const fetchRepuestos = async () => {
   try {
    const data = await getRepuestosOrdenById(ordenActiva);
    const lista = await listaRepuestos();

    const repuestosConPrecio = data.map((repuesto: { id_repuesto: any }) => {
     const repuestoEncontrado = lista.find(
      (r: { id_repuesto_camioneta: any; id_repuesto_taller: any }) => r.id_repuesto_camioneta === repuesto.id_repuesto || r.id_repuesto_taller === repuesto.id_repuesto
     );

     const precio = repuestoEncontrado ? repuestoEncontrado.precio : null;

     return {
      ...repuesto,
      precio: precio,
     };
    });

    setRepuestosOrden(repuestosConPrecio);
   } catch (error) {
    console.error("Error al obtener repuestos:", error);
   }
  };

  if (ordenActiva) {
   fetchRepuestos();
   const firmaClienteDataURL = ordenActiva.Entrega?.firma_cliente;
   const firmaEmpleadoDataURL = ordenActiva.Entrega?.firma_empleado;

   if (sigCanvas1.current) {
    sigCanvas1.current.fromDataURL(firmaClienteDataURL);
   }
   if (sigCanvas2.current) {
    sigCanvas2.current.fromDataURL(firmaEmpleadoDataURL);
   }
  }
 }, [ordenActiva]);

 const fetchTiposFunciones = async () => {
  try {
   const response = await fetch("https://lv-back.online/opciones/funcion");
   const funciones = await response.json();
   if (funciones && funciones.length > 0) {
    setTextosCheckbox(funciones.map((funcion: { tipo_funcion: string }) => funcion.tipo_funcion));
    setCheckboxValues(Array(funciones.length).fill(false));
   } else {
    console.log("Aún no se registra ningún tipo de funcion...");
   }
  } catch (error) {
   console.error("Error, no se encontraron tipos de funciones en la base de datos....", error);
  }
 };

 useEffect(() => {
  if (ordenActiva && ordenActiva.diagnostico) {
   const updatedCheckboxValues = textosCheckbox.map((texto) => ordenActiva.diagnostico.includes(texto));
   setCheckboxValues(updatedCheckboxValues);
  }
 }, [ordenActiva, textosCheckbox]);

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





const modificarEntrega = async (id: any, idOrden: any) => {
  const firma_cliente = sigCanvas1.current?.toDataURL();
  const firma_empleado = sigCanvas2.current?.toDataURL();
  const entrega = {
    id_orden: idOrden, // Aquí se pasa el ID correcto de la orden
    firma_cliente: firma_cliente,
    firma_empleado: firma_empleado,
    recomienda: 1,
  };
  try {
    const response = await fetch(
      `https://lv-back.online/entregas/modificar/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrega),
      }
    );
    const result = await response.json();
    console.log(result);
    if (result[0] === 1) {
      console.log("Entrega modificada con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la entrega no pudo ser modificada...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la entrega.", error);
  }
};
 const guardarEntrega = async () => {
  const firma_cliente = sigCanvas1.current?.toDataURL();
  const firma_empleado = sigCanvas2.current?.toDataURL();

  const entrega = {
   id_orden: ordenActiva?.id || 0,
   firma_cliente: firma_cliente,
   firma_empleado: firma_empleado,
   recomienda: selectedOption === "si" ? 1 : 0,
  };

  try {
   const response = await fetch("https://lv-back.online/entregas/guardar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entrega),
   });

   if (response.ok) {
    const result = await response.json();
    console.log("Entrega registrada con éxito!!!", result);
    return result.id; 
   } else {
    console.log("Se produjo un error, la entrega no pudo ser registrada...");
    return null;
   }
  } catch (error) {
   console.error("Error al registrar la entrega.", error);
   return null;
  }
 };

 const handleGuardarYConfirmar = async () => {
  if (!selectedMedioPago) {
    console.error("No se ha seleccionado un medio de pago.");
    return;
  }

  try {
    // Verificar si ya existe una entrega asociada
    const entregaExistente = await obtenerEntrega(ordenActiva?.id);

    let idEntrega;

    if (entregaExistente) {
      console.log("Ya existe una entrega registrada para esta orden.", entregaExistente);

      // Modificar la entrega existente
      const modificada = await modificarEntrega(entregaExistente.id, ordenActiva.id) ;
      if (!modificada) {
        console.error("Error al modificar la entrega.");
        return;
      }

      // Mostrar alerta al modificar entrega
      setShowAlert(true);
      idEntrega = entregaExistente.id;
    } else {
      // Guardar nueva entrega
      idEntrega = await guardarEntrega();
      if (!idEntrega) {
        console.error("Error al guardar la entrega o ID de entrega no definido.");
        return;
      }
      console.log("Entrega guardada exitosamente con ID:", idEntrega);

      // Mostrar alerta al guardar nueva entrega
      setShowAlert(true);
    }

    // Procesar el pago
    const pago = {
      id_medio_de_pago: selectedMedioPago,
      id_entrega: idEntrega,
      importe: ordenActiva.Presupuesto.total,
      imagen_comprobante: imagenComprobante,
    };

    const pagoExistente = await entregaPago(idEntrega);

    console.log("Pago existente:", pagoExistente);
    const url = pagoExistente
      ? `https://lv-back.online/pagos/modificar/${pagoExistente.id}`
      : "https://lv-back.online/pagos/guardar";
    const method = pagoExistente ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pago),
    });

    if (response.ok) {
      // Mostrar alerta si el pago fue exitoso
      setShowAlert(true);
     
    } else {
      const errorText = await response.text();
      console.error("Error al procesar el pago:", errorText);
    }
  } catch (error) {
    console.error("Error en el proceso de confirmación y guardado:", error);
  }
};


 const handleCancelarOrden = async () => {
  setShowAlert(true);
  try {
 

   const response = await fetch(`https://lv-back.online/ordenes/modificar/${ordenActiva.id}`, {
    method: "PUT",
    headers: {
     "Content-Type": "application/json",
    },
    body: JSON.stringify({
     id_tipo_estado: 2, 
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

 const handleFotosClick = (isEntrega: boolean) => {
  history.push({
   pathname: "/fotos",
   state: { isEntrega },
  });
 };

 const fetchMediosDePago = async () => {
  try {
   const response = await fetch("https://lv-back.online/opciones/pago");
   const mediosDePago: MedioDePago[] = await response.json();
   setMediosPago(mediosDePago[0] !== undefined ? mediosDePago : []);
   console.log(mediosDePago);
  } catch (error) {
   console.error("Error, no se encontraron medios de pago en la base de datos....", error);
   setMediosPago([]);
  }
 };

 useEffect(() => {
  fetchMediosDePago();
 }, []);

 const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
   const fileURL = URL.createObjectURL(file);
   setImagenComprobante(fileURL);
  }
 };

 const handleOptionSelection = (option: string) => {
  if (option === "ver") {
   console.log("Orden al navegar:", orden);
     window.location.assign(`/remito?orden=${ordenActiva.id}`);
   // } else if (option === "descargar") {
   //   window.print();
  } else if (option === "enviar") {
   console.log("Enviando remito al cliente...");
  } else if (option === "inicio") {
   history.push("/domicilio");
  }
 };

 const handleFotosClick2 = (isFactura: boolean) => {
  history.push({
   pathname: "/fotos",
   state: { isFactura },
  });
 };
 return (
  <IonPage>
   <IonContent>
    <IonHeader>
     <HeaderGeneral />
    </IonHeader>
    <div className='diagnostico-ctn'>
     <div className='entrega'>
 

      <div className='item'>
       <span>
        <strong>Producto:</strong>
       </span>
       <IonInput className='input-field' disabled value={ordenActiva?.equipo || ""} />
      </div>

      <div className='item'>
       <span>
        <strong>Marca:</strong>
       </span>
       <IonInput className='input-field' disabled value={ordenActiva?.marca || ""} />
      </div>

      <div className='item'>
       <span>
        <strong>Modelo:</strong>
       </span>
       <IonInput className='input-field' disabled value={ordenActiva?.modelo || ""} />
      </div>

      <div className='item'>
       <span>
        <strong>N° de cliente:</strong>
       </span>
       <IonInput className='input-field' disabled value={ordenActiva?.id_cliente || ""} />
      </div>
     </div>

     <div className='section'>
      <h2>Chequeo de funcionamiento</h2>
      <div className='checkbox-container'>
       {textosCheckbox.map((texto, index) => (
        <div key={index} className='checkbox-item'>
         <IonCheckbox
          disabled
          checked={checkboxValues[index]}
          onIonChange={(e) => {
           const newCheckboxValues = [...checkboxValues];
           newCheckboxValues[index] = e.detail.checked;
           setCheckboxValues(newCheckboxValues);
          }}
          className='checkbox'
         />
         <span>{texto}</span>
        </div>
       ))}
      </div>
     </div>
     {ordenActiva?.observaciones && (
      <div className='section'>
       <h2>Observaciones</h2>
       <div>{ordenActiva.observaciones}</div>
      </div>
     )}

     <div className='section'>

     <IonButton style={{ "--border-radius": "20px" }} onClick={() => handleFotosClick(true)}>
      Agregar/Ver Fotos
     </IonButton>
      <h2>Conformidad de la entrega</h2>

      <h2>Firmas</h2>
      {["Cliente", "Técnico"].map((role, index) => (
       <div className='firma' key={index}>
        <h3>Firma {role}</h3>
        <SignatureCanvas
         penColor='black'
         canvasProps={{
          width: 500,
          height: 200,
          className: "sigCanvas",
         }}
         ref={index === 0 ? sigCanvas1 : sigCanvas2}
         onEnd={() => (index === 0 ? setSignature1(sigCanvas1.current?.toDataURL() || "") : setSignature2(sigCanvas2.current?.toDataURL() || ""))}
        />
        <IonButton onClick={() => (index === 0 ? sigCanvas1.current?.clear() : sigCanvas2.current?.clear())}>Borrar</IonButton>
       </div>
      ))}
     </div>
     <div className='section'>
      <h2>¿Nos recomendarías? </h2>
      <div role='radiogroup' aria-labelledby='radioOptionsLabel' className='radio-group'>
       <div className='radio-options'>
        <label className='radio-option'>
         <input type='radio' name='options' value='si' checked={selectedOption === "si"} onChange={(e) => setSelectedOption(e.target.value)} />
         <span className='custom-radio'></span>
         Sí
        </label>
        <label className='radio-option'>
         <input type='radio' name='options' value='no' checked={selectedOption === "no"} onChange={(e) => setSelectedOption(e.target.value)} />
         <span className='custom-radio'></span>
         No
        </label>
       </div>
      </div>
     </div>

 

     <div className='section'>
      {/* <IonButton
              className="button"
              style={{ "--border-radius": "20px" }}
              onClick={() => setShowConfirmEntregaAlert(true)}
            >
              Concretar entrega
            </IonButton>
             */}
      <IonAlert
       isOpen={showConfirmEntregaAlert}
       onDidDismiss={() => setShowConfirmEntregaAlert(false)}
       header={"Confirmar entrega"}
       message={"¿Estás seguro de que deseas concretar la entrega?"}
       buttons={[
        {
         text: "No",
         role: "cancel",
         cssClass: "secondary",
         handler: () => {
          setShowConfirmEntregaAlert(false);
         },
        },
        {
         text: "Sí",
         handler: handleGuardarYConfirmar,
        },
       ]}
      />
     </div>

     {/* FACTURACION */}
     <div className='facturacion-box'>
      <h2 className='text-center'>Condiciones de pago</h2>
      <div className='estado-pago'>
       <IonSelect className='placeholder-estado-pago' placeholder='Estado' value={estadoPago} onIonChange={(e) => setEstadoPago(e.detail.value)}>
        <IonSelectOption value='pendiente'>Pendiente</IonSelectOption>
        <IonSelectOption value='pagado'>Pagado</IonSelectOption>
        <IonSelectOption value='rechazado'>Rechazado</IonSelectOption>
       </IonSelect>
      </div>
      <div className='estado-pago-total'>
       <span>Total:</span>
       <span className='total-amount'>${ordenActiva.Presupuesto?.total || 0}</span>
      </div>

      {/* Mostrar Comisión Técnico */}
   {/*    <div className='estado-pago-total' style={{ marginTop: "20px" }}>
       <span>Comisión a cobrar:</span>
       <span className='total-amount'>${ordenActiva.Presupuesto?.comision_visita}</span>
      </div> */}

      <div className='subtitle-forma-pago'>
       <span>Formas de pago</span>
      </div>
      <div className='forma-pago'>
       <IonSelect placeholder='Seleccionar forma de pago' value={selectedMedioPago || ordenActiva?.Presupuesto?.id_medio_de_pago} disabled>
        {mediosPago.map((medio, index) => (
         <IonSelectOption key={index} value={medio.id}>
          {medio.medio_de_pago}
         </IonSelectOption>
        ))}
       </IonSelect>
       {/* INPUT DE TOTAL */}
       {/* <IonInput value={`$${ordenActiva.Presupuesto?.total || 0}`} /> */}
      </div>
      <div className='adjuntar-foto'>
       <input type='file' accept='image/*,application/pdf' onChange={handleFileChange} style={{ display: "none" }} id='file-upload' />

    {/*    <IonButton style={{ "--border-radius": "20px" }} onClick={() => handleFotosClick2(true)}>
        <IonIcon icon={cameraOutline} className='custom-icon' />
        Agregar comprobante de pago
       </IonButton> */}
      </div>

      <div
       style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
       }}
      >
       <IonButton
        className='button'
        style={{
         "--border": "none",
         "--background": "none",
         "--color": "#E58769",
        }}
        onClick={() => setShowCancelAlert(true)} // modified onClick for cancel
       >
        Cancelar orden
       </IonButton>
      </div>
      <IonButton expand='block' className='finalizar-button' onClick={handleGuardarYConfirmar}>
       Finalizar
      </IonButton>

      {/* Cancel order alert */}
      <IonAlert
       isOpen={showCancelAlert} // modified alert open condition
       onDidDismiss={() => setShowCancelAlert(false)} // modified dismiss handler
       header={"Cancelar"}
       message={"¿Estás seguro de que deseas cancelar la orden?"}
       buttons={[
        {
         text: "No",
         role: "cancel",
         cssClass: "secondary",
         handler: () => {
          setShowCancelAlert(false);
         },
        },
        {
         text: "Sí",
         handler: handleCancelarOrden,
        },
       ]}
      />

      <IonAlert
       isOpen={showAlert}
       onDidDismiss={() => setShowAlert(false)}
       header={"Opciones de remito"}
       message={"¿Qué desea hacer con el remito?"}
       buttons={[
        {
          text: "Agregar comprobante de pago",
          handler: () => handleFotosClick2(true),
         },
        {
         text: "Ver remito",
         handler: () => handleOptionSelection("ver"),
        },
        {
         text: "Ir al inicio",
         handler: () => handleOptionSelection("inicio"),
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
