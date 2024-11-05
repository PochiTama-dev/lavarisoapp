import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonPage, IonCheckbox, IonInput, IonButton, IonSelect, IonSelectOption, IonRadioGroup, IonItem, IonLabel, IonRadio, IonRow, IonCol, IonHeader, IonAlert } from "@ionic/react";
import { useLocation } from "react-router-dom";
import "../Diagnostico/diagnostico.css";
import SignatureCanvas from "react-signature-canvas";
import "./entrega.css";
import CancelarOrden from "../../components/Orden/CancelarOrden";
import HeaderGeneral from "../../components/Header/HeaderGeneral";
import { useOrden } from "../../Provider/Provider";
import { getRepuestosOrdenById, listaRepuestos } from "../Presupuesto/fetchs";

const Entrega: React.FC = () => {
 const location = useLocation();
 const { orden } = location.state as { orden: any };

 
 const [checkboxValues, setCheckboxValues] = useState<boolean[]>([]);
 const [observaciones, setObservaciones] = useState("");
 const [selectedOption, setSelectedOption] = useState("");
 const [selectedEntrega, setSelectedEntrega] = useState("");
 const [signature1, setSignature1] = useState("");
 const [signature2, setSignature2] = useState("");
 const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
 const [ordenSelected, setordenActiva] = useState<any>(null);
 const [showAlert, setShowAlert] = useState(false);
 const [showConfirmEntregaAlert, setShowConfirmEntregaAlert] = useState(false);
 const [firmaCliente, setFirmaCliente] = useState<string>("");
 const [firmaTecnico, setFirmaTecnico] = useState<string>("");
 const sigCanvasCliente = useRef<SignatureCanvas | null>(null);
 const sigCanvasTecnico = useRef<SignatureCanvas | null>(null);

 const [showConfirmation, setShowConfirmation] = useState(false);
 const history = useHistory();

 const [repuestosOrden, setRepuestosOrden] = useState([]);
 const sigCanvas1 = useRef<SignatureCanvas>(null);
 const sigCanvas2 = useRef<SignatureCanvas>(null);
 const { cargarOrdenes, selectedRepuestos, ordenActiva, setOrdenActiva , repuestosCamioneta} = useOrden();

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
   } else {
    console.log(`No se encontró ninguna entrega con el id ${id}, usando las firmas del presupuesto.`);
    if (orden && orden.Presupuesto) {
     setFirmaCliente(orden.Presupuesto.firma_cliente || "");
     setFirmaTecnico(orden.Presupuesto.firma_empleado || "");
    } else {
     console.log("No se encontraron las firmas en el presupuesto.");
    }
   }
  } catch (error) {
   console.error("Error al obtener la entrega, mostrando las firmas del presupuesto.", error);

   if (orden && orden.Presupuesto) {
    setFirmaCliente(orden.Presupuesto.firma_cliente || "");
    setFirmaTecnico(orden.Presupuesto.firma_empleado || "");
   }
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
   const firmaClienteDataURL = ordenActiva.Presupuesto.firma_cliente;
   const firmaEmpleadoDataURL = ordenActiva.Presupuesto.firma_empleado;

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
  const entregaGuardada = await guardarEntrega();
  if (entregaGuardada) {
   history.push("/domicilio");
  } else {
   console.log("Error al concretar la entrega.");
  }
 };

 

 const handleCancelarOrden = async () => {
  setShowAlert(true);
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

 const handleFotosClick = (isEntrega: boolean) => {
  history.push({
    pathname: '/fotos',
    state: { isEntrega }  
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
  <h2>Entrega</h2>
  
  <div className='item'>
    <span><strong>Producto:</strong></span>
    <IonInput className='input-field' disabled value={ordenActiva?.equipo || ""} />
  </div>
  
  <div className='item'>
    <span><strong>Marca:</strong></span>
    <IonInput className='input-field' disabled value={ordenActiva?.marca || ""} />
  </div>
  
  <div className='item'>
    <span><strong>Modelo:</strong></span>
    <IonInput className='input-field' disabled value={ordenActiva?.modelo || ""} />
  </div>
  
  <div className='item'>
    <span><strong>N° de cliente:</strong></span>
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
     <div className='section'>
      <h2>Tipo de entrega</h2>
      <IonSelect value={selectedEntrega} placeholder='Seleccionar' onIonChange={(e) => setSelectedEntrega(e.detail.value)}>
       <IonSelectOption value='option1'>Option 1</IonSelectOption>
       <IonSelectOption value='option2'>Option 2</IonSelectOption>
       <IonSelectOption value='option3'>Option 3</IonSelectOption>
      </IonSelect>
     </div>
     {ordenActiva?.observaciones && (
  <div className='section'>
    <h2>Observaciones</h2>
    <div>{ordenActiva.observaciones}</div>
  </div>
)}

     <div className='section'>
      <h2>Conformidad de la entrega</h2>
     


      <h2>Firmas</h2>
       {["Cliente", "Técnico"].map((role, index) => (
        <div className='firma' key={index}>
         <h3>Firma {role}</h3>
         <SignatureCanvas
          penColor='black'
          canvasProps={{ width: 500, height: 200, className: "sigCanvas" }}
          ref={index === 0 ? sigCanvas1 : sigCanvas2}
          onEnd={() => (index === 0 ? setSignature1(sigCanvas1.current?.toDataURL() || "") : setSignature2(sigCanvas2.current?.toDataURL() || ""))}
         />
         <IonButton onClick={() => (index === 0 ? sigCanvas1.current?.clear() : sigCanvas2.current?.clear())}>Borrar</IonButton>
        </div>
       ))}
      






     </div>
     <div className='section'>
      <h2>¿Nos recomendarías? </h2>
      <IonRadioGroup value={selectedOption} onIonChange={(e) => setSelectedOption(e.detail.value)}>
       <IonRow>
        <IonCol>
         <IonItem>
          <IonLabel>Si</IonLabel>
          <IonRadio slot='start' value='si' />
         </IonItem>
        </IonCol>
        <IonCol>
         <IonItem>
          <IonLabel>No</IonLabel>
          <IonRadio slot='start' value='no' />
         </IonItem>
        </IonCol>
       </IonRow>
      </IonRadioGroup>
     </div>




     <IonButton onClick={() => handleFotosClick(true)}>
 Agregar Fotos
</IonButton>














     <div className='section'>
      <IonButton className='button' style={{ "--border-radius": "20px" }} onClick={() => setShowConfirmEntregaAlert(true)}>
       Concretar entrega
      </IonButton>
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
         handler: handleConfirmarClick,
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
   </IonContent>
  </IonPage>
 );
};

export default Entrega;
