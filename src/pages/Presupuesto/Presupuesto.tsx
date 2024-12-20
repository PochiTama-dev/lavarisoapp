import React, { useState, useEffect, useRef } from "react";
import { IonContent, IonPage, IonCheckbox, IonInput, IonButton, IonSelect, IonSelectOption, IonModal, IonSearchbar, IonList, IonItem, IonLabel, IonHeader, IonAlert } from "@ionic/react";
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
 guardarRepuestoOrden,
 updateRepuestoOrden,
 modificarStockPrincipal,
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
 const [inputErrors, setInputErrors] = useState({
  montos: false,
  medioPago: false,
  estadoPresupuesto: false,
  acceptedPolicies: false,
  plazos: false,
 });
 const [dpg, setDpg] = useState("");
 const [descuento, setDescuento] = useState("");
 const {
  cargarOrdenes,
  selectedRepuestos,
  ordenActiva,
  setOrdenActiva,
  repuestosCamioneta,
  selectedRepuestosTaller,
  repuestoOrden,
  cargarRepuestosOrden,
  repuestosTaller,
  setSelectedRepuestosTaller,
  setSelectedRepuestos,
 } = useOrden();

 const servicios = ["Viaticos", "DPG", "Descuentos", "Precio"] as const;
 //  const servicios = ["Viaticos", "DPG", "Descuentos", "Comisión visita", "Comisión reparación", "Comisión entrega", "Comisión rep. a domicilio", "Gasto impositivo"] as const;

 type Servicio = (typeof servicios)[number];

 const servicioToDBFieldMap: Record<Servicio, string> = {
  Viaticos: "viaticos",
  DPG: "dpg",
  Descuentos: "descuento",
  Precio: "gasto_impositivo",
 };

 useEffect(() => {
  if (ordenActiva && ordenActiva.id) {
   cargarRepuestosOrden(ordenActiva.id);
  }
 }, [ordenActiva]);

 const handleMontoChange = (index: number, value: any) => {
  const newMontos = [...montos];
  newMontos[index] =  value;
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
  }
 }, [ordenActiva]);

 ///////////TOTAL

 let totalRepuestos = 0;

// Suma repuestos de la camioneta
if (Array.isArray(selectedRepuestos) && selectedRepuestos.length > 0) {
  totalRepuestos += selectedRepuestos.reduce((acc, repuesto) => {
    const precio = repuesto.StockPrincipal?.precio || repuesto.precio;
    return acc + precio * repuesto.cantidad;
  }, 0);
}

// Sumar repuestos del taller
if (Array.isArray(selectedRepuestosTaller) && selectedRepuestosTaller.length > 0) {
  totalRepuestos += selectedRepuestosTaller.reduce((acc, repuesto) => {
    const precio = repuesto.StockPrincipal?.precio || repuesto.precio;
    return acc + precio * repuesto.cantidad;
  }, 0);
}

// Calculo montos sin descuento ni DPG
const descuentosIndex = servicios.indexOf("Descuentos");
const dpgIndex = servicios.indexOf("DPG");
const totalMontosSinDescuentoYDPG = montos.filter((_, index) => index !== descuentosIndex && index !== dpgIndex)
  .reduce((a, b) => a + parseFloat(b || 0), 0);

// Calcular descuento
const descuentoPorcentaje = descuentosIndex !== -1 ? parseFloat(montos[descuentosIndex]) : 0;
const montoDescuento = totalMontosSinDescuentoYDPG * (descuentoPorcentaje / 100);

// Calcular el total antes de aplicar descuentos, DPG y otros
let total = totalMontosSinDescuentoYDPG + totalRepuestos - montoDescuento;

// Verificar medio de pago y aplicar el ajuste correspondiente
if (selectedMedioPago) {
  const medio = medioPago.find((mp) => mp.id === selectedMedioPago)?.medio_de_pago.toLowerCase();
  if (medio) {
    if (medio === "efectivo en dólares" || medio === "efectivo en pesos" || medio === "mercadopago" || medio === "transferencia en dólares" || medio === "transferencia en pesos") {
      total *= 0.95; // Descuento para estos métodos de pago
    } else if (medio === "tarjeta de crédito") {
      total *= 1.21; // Aumento por pago con tarjeta
    }
  }
}

// Calcular DPG
const dpgMonto = dpgIndex !== -1 ? parseFloat(montos[dpgIndex] || 0) : 0;
total += dpgMonto;

// Total repuestos Taller
let totalRepuestosTaller = 0;

// Sumar los repuestos seleccionados del taller
if (Array.isArray(selectedRepuestosTaller) && selectedRepuestosTaller.length > 0) {
  totalRepuestosTaller += selectedRepuestosTaller.reduce((acc, repuesto) => {
    const precio = repuesto.StockPrincipal?.precio || repuesto.precio;
    return acc + precio * repuesto.cantidad;
  }, 0);
}

// Incluir los repuestos de repuestoOrden que tengan `id_repuesto_repuesto_taller`
if (Array.isArray(repuestoOrden) && repuestoOrden.length > 0) {
  totalRepuestosTaller += repuestoOrden
    .filter((repuesto) => repuesto.id_repuesto_taller) // Filtrar los que tienen id_repuesto_repuesto_taller definido
    .reduce((acc, repuesto) => {
      const precio = repuesto.StockPrincipal?.precio || repuesto.precio;
      return acc + precio * repuesto.cantidad;
    }, 0);
}
total += totalRepuestosTaller;

// Calcular la comisión a cobrar
const totalParaComision = total - dpgMonto - totalRepuestos;
const comisionCobrar = totalParaComision / 2 + dpgMonto;
const comisionCobrarRedondeado = Math.round(totalParaComision / 2 + dpgMonto);
 
 // Mostrar el total y la comisión
 // console.log("Total con repuestos, descuento, y medio de pago:", total);
 // console.log("Comisión a cobrar:", comisionCobrarRedondeado);
 // console.log("SELECTED",selectedRepuestos)
 // console.log("TOTAL REP", totalRepuestos)
 // console.log("TOTAL REP TALLER", totalRepuestosTaller)

 // AGREGAR RESPUESTOS DE CAMIONETA
 const agregarRepuestos = async () => {
  try {
   const repuestosData = [
    ...selectedRepuestos.map((repuesto) => ({
     id_orden: ordenActiva.id,
     id_repuesto_taller: null,
     id_repuesto_camioneta: repuesto.id,
     nombre: repuesto.StockPrincipal?.nombre || repuesto.nombre,
     cantidad: repuesto.cantidad,
     precio: repuesto.precio,
    })),
    ...selectedRepuestosTaller.map((repuesto) => ({
     id_orden: ordenActiva.id,
     id_repuesto_taller: repuesto.id_repuesto,
     id_repuesto_camioneta: null,
     nombre: repuesto.StockPrincipal?.nombre || repuesto.nombre,
     cantidad: repuesto.cantidad,
     precio: repuesto.StockPrincipal?.precio || repuesto.precio,
    })),
   ];

   await Promise.all(repuestosData.map(createRepuestoOrden));
   console.log("Todos los repuestos se han agregado correctamente.");
  } catch (error) {
   console.error("Error al agregar repuestos:", error);
  }
 };

 useEffect(() => {
  (async () => {
   const [plazosData, estadosData, repuestosData, medioPagoData] = await Promise.all([fetchPlazosReparacion(), estadosPresupuestos(), listaRepuestos(), mediosDePago()]);

   setPlazos(plazosData);
   setEstados(estadosData);
   setRepuestos(repuestosData);
   setMedioPago(medioPagoData);
  })();
 }, []);

 useEffect(() => {
  if (!ordenActiva) return;

  const { Presupuesto } = ordenActiva || {};
  const firmaClienteDataURL = Presupuesto?.firma_cliente || "";
  const firmaEmpleadoDataURL = Presupuesto?.firma_empleado || "";

  setFormaPago(Presupuesto?.formaPago || null);
  setEstado(Presupuesto?.estado || "");
  setDpg(Presupuesto?.dpg || "");
  setDescuento(Presupuesto?.descuento || "");
  setSelectedList(Presupuesto?.selectedList || []);
  setAcceptedPolicies(Presupuesto?.acceptedPolicies ?? true);
  setPlazosCheckboxValues([Presupuesto?.id_plazo_reparacion] || []);
  setSelectedMedioPago(Presupuesto?.id_medio_de_pago || null);
  setSelectedEstadoPresupuesto(Presupuesto?.id_estado_presupuesto || null);

  setMontos([
   Presupuesto?.viaticos || 0,
   Presupuesto?.dpg || 0,
   Presupuesto?.descuento || 0,

   // Presupuesto?.comision_visita || 0,
   // Presupuesto?.comision_reparacion || 0,
   // Presupuesto?.comision_entrega || 0,
   // Presupuesto?.comision_reparacion_domicilio || 0,
    Presupuesto?.gasto_impositivo || 0,
  ]);

  sigCanvas1.current?.fromDataURL(firmaClienteDataURL);
  sigCanvas2.current?.fromDataURL(firmaEmpleadoDataURL);
 }, [ordenActiva]);

 const handleMedioPagoChange = (event: CustomEvent) => {
  setSelectedMedioPago(event.detail.value);
 };

 const handleEstadoPresupuestoChange = (event: CustomEvent) => {
  setSelectedEstadoPresupuesto(event.detail.value);
 };

 const handleConfirmarClick = async () => {
  try {
   // Validaciones
   if (!selectedMedioPago) {
    alert("Por favor, seleccione un medio de pago.");
    return;
   }

   if (!selectedEstadoPresupuesto) {
    alert("Por favor, seleccione un estado para el presupuesto.");
    return;
   }

   if (!acceptedPolicies) {
    alert("Debe aceptar las políticas antes de continuar.");
    return;
   }

   if (plazosCheckboxValues.length === 0) {
    alert("Por favor, seleccione al menos un plazo para la reparación.");
    return;
   }

   // Confirmación del alert
   setShowConfirmAlert(false);
   localStorage.setItem("comisionTecnico", comisionCobrarRedondeado.toString());

   let presupuestoId = ordenActiva?.Presupuesto?.id || null;

   const firma_cliente = sigCanvas1.current?.toDataURL();
   const firma_empleado = sigCanvas2.current?.toDataURL();

   const serviciosMontos: Record<string, number> = {};
   montos.forEach((monto, index) => {
    const servicio = servicios[index];
    const dbField = servicioToDBFieldMap[servicio];
    if (dbField) {
     serviciosMontos[dbField] = monto;
    }
   });

   const id_plazo_reparacion = plazosCheckboxValues.length > 0 ? plazosCheckboxValues[1] : 0;

   const dataToSend = {
    id_orden: ordenActiva?.id,
    id_plazo_reparacion,
    id_medio_de_pago: selectedMedioPago,
    id_estado_presupuesto: selectedEstadoPresupuesto,
    firma_cliente,
    firma_empleado,
    selectedList,
    acceptedPolicies,
    comision_visita: comisionCobrarRedondeado,
    ...serviciosMontos,
    total,
   };
console.log("DATA TO SEND",dataToSend)
   let response;

   if (presupuestoId) {
    // Manejo de repuestos de camioneta
    for (const repuesto of selectedRepuestos) {
     const repuestoOriginal = repuestosCamioneta.find((item) => item.id === repuesto.id);

     if (repuestoOriginal) {
      console.log("Actualizando repuesto camioneta", repuestoOriginal);
      await updateRepuestoCantidad(repuestoOriginal.id, repuestoOriginal.cantidad);
     } else {
      console.warn("No se encontró el repuesto original para la camioneta:", repuesto);
     }
    }

    for (const repuestoTaller of selectedRepuestosTaller) {
     const repuestoOriginalTaller = repuestosTaller.find((item) => item.id_repuesto === repuestoTaller.id_repuesto);

     if (repuestoOriginalTaller) {
      const cantidadRestante = repuestoOriginalTaller.cantidad - repuestoTaller.cantidad;

      console.log(`Restando ${repuestoTaller.cantidad} del stock. Cantidad restante: ${cantidadRestante}`);

      try {
       const result = await modificarStockPrincipal(repuestoOriginalTaller.id, {
        cantidad: cantidadRestante + repuestoTaller.cantidad,
       });

       if (result) {
        console.log("Stock modificado exitosamente en la base de datos.");
       }
      } catch (error) {
       console.error("Hubo un error al actualizar el stock:", error);
      }
     } else {
      console.warn("No se encontró el repuesto original del taller:", repuestoTaller);
     }
    }

    //@ts-ignore
    response = await modificarPresupuesto(presupuestoId, dataToSend);
   } else {
    //@ts-ignore
    response = await guardarPresupuesto(dataToSend);
   }

   if (response && response.ok) {
    console.log("Presupuesto guardado/modificado con éxito!!!");
    setSelectedRepuestosTaller([]);
    setSelectedRepuestos([]);
    setOrdenActiva((prevOrden: any) => ({
     ...prevOrden,
     Presupuesto: { ...dataToSend },
    }));

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
  setSelectedOptions((prevOptions) => (prevOptions.includes(selectedValue) ? prevOptions.filter((option) => option !== selectedValue) : [...prevOptions, selectedValue]));
 };

 const handleRemove = (itemToRemove: string) => {
  setSelectedList((list) => list.filter((item) => item !== itemToRemove));
 };

 const handleCancelarOrden = async () => {
  setShowAlert(false);
  try {
   console.log("Cancelando orden:", ordenActiva.id);
   const response = await cancelarOrden(ordenActiva.id);

   if (response.ok) {
    alert("Orden cancelada exitosamente");
    window.history.back();
   } else {
    alert("Error al cancelar la orden. Intente nuevamente.");
    console.error(`Error: ${response.status} ${response.statusText}`);
   }
  } catch (error) {
   alert("Error al realizar la solicitud. Verifique su conexión e intente nuevamente.");
   console.error("Error al realizar la solicitud:", error);
  }
 };

 const handleConfirmAlertCancel = () => setShowConfirmAlert(false);

 const handleRepuestos = () => history.push("/repuestosDomicilio");
 const combinedRepuestos = [...(selectedRepuestos || []), ...(selectedRepuestosTaller || []), ...(repuestoOrden || [])];

 return (
  <IonPage>
   <IonHeader>
    <HeaderGeneral />
   </IonHeader>
   <IonContent>
    <div className='diagnostico-ctn'>
     <div className='section'>
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
        Seleccionar
       </IonButton>
      </div>

      {/*  repuestos de camioneta */}
      <IonList>
       {combinedRepuestos.length > 0 ? (
        combinedRepuestos.map((repuesto) => (
         <IonItem key={repuesto.id}>
          <IonLabel
           style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: "16px",
            border: "none",
           }}
          >
           <span>
            {repuesto.StockPrincipal?.nombre || repuesto.nombre} x{repuesto.cantidad}
           </span>
           <span>${repuesto.StockPrincipal?.precio * repuesto.cantidad || repuesto.precio * repuesto.cantidad}</span>
          </IonLabel>
         </IonItem>
        ))
       ) : (
        <IonItem>
         <IonLabel style={{ fontSize: "18px" }}>No hay repuestos disponibles.</IonLabel>
        </IonItem>
       )}
      </IonList>

      <IonModal isOpen={showModal}>
       <IonSearchbar value={searchText || ""} onIonChange={(e) => setSearchText(e.detail.value || "")} />
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
         setSelectedList((prevList) => [...prevList, ...selectedOptions.filter((option) => !prevList.includes(option))]);
         setShowModal(false);
        }}
       >
        Cerrar
       </IonButton>
      </IonModal>

      <div
       className='separador'
       style={{
        borderBottom: "2px solid #000",
        margin: "20px 10px",
        width: "90%",
       }}
      />

      <div className='servicios' style={{ display: "flex", flexDirection: "column" }}>
       <h2>Servicios</h2>
       <div className='presupuesto-forma-pago'>
        <span className='forma-pago-label'>Forma de pago</span>
        <div>
         <IonSelect className={`forma-pago-select ${inputErrors.medioPago ? "select-error" : ""}`} value={selectedMedioPago} placeholder='Seleccione medio de pago' onIonChange={handleMedioPagoChange}>
          {medioPago.map((medio) => (
           <IonSelectOption key={medio.id} value={medio.id}>
            {medio.medio_de_pago}
           </IonSelectOption>
          ))}
         </IonSelect>
        </div>
       </div>
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
          {servicios[index] === "DPG" ? (
           <select
            style={{
             margin: "10px 0 10px 20px",
             width: "120px",
             color: "black",
             background: "white",
             border: "none",
            }}
            value={monto}
            onChange={(e) => handleMontoChange(index, e.target.value)}
           >
            <option value=''>Seleccione</option>
            {[5000, 10000, 15000, 20000, 25000, 30000].map((valor) => (
             <option key={valor} value={valor}>
              {valor}
             </option>
            ))}
           </select>
          ) : servicios[index] === "Descuentos" ? (
           <select
            style={{ width: "120px", margin: "10px 0 10px 20px", color: "black", background: "white ", border: "none" }}
            value={monto}
            onChange={(e) => handleMontoChange(index, e.target.value)}
           >
            <option value={0}>Sin desc.</option>
            <option value={5}>5%</option>
            <option value={10}>10%</option>
            <option value={15}>15%</option>
           </select>
          ) : (
           <>
            <span>$</span>
            <IonInput
             className={inputErrors.montos ? "input-error" : ""}
             style={{ width: "100px", marginLeft: "20px" }}
             type='number'
             value={monto}
             onIonChange={(e) => handleMontoChange(index, e.detail.value)}
            />
           </>
          )}
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
       <div style={{ width: "100%", marginTop: "30px" }}>
        <span>
         <strong>Comisión a cobrar :</strong>
        </span>
       </div>
       <div
        style={{
         textAlign: "right",
         marginRight: "65px",
         marginTop: "-20px",
        }}
       >
        <span>${comisionCobrarRedondeado}</span>
       </div>
      </div>
      <div
       className='separador'
       style={{
        borderBottom: "2px solid #000",
        margin: "20px 10px",
        width: "90%",
       }}
      />

      <div className='section'>
       <h2>Tiempo estimado de reparación/diagnóstico</h2>
       <div className='checkbox-container'>
        {plazos.map((plazo, index) => (
         <div key={index} className='checkbox-item'>
          <IonCheckbox
           checked={plazosCheckboxValues.includes(plazo.id)}
           onIonChange={(e) => {
            const isChecked = e.detail.checked;
            setPlazosCheckboxValues((prevValues) => (isChecked ? [...prevValues, plazo.id] : prevValues.filter((id) => id !== plazo.id)));
           }}
           className='checkbox'
          />
          <span>{plazo.texto}</span>
         </div>
        ))}
       </div>
      </div>

      <div
       className='separador'
       style={{
        borderBottom: "2px solid #000",
        margin: "20px 10px",
        width: "90%",
       }}
      />

      <div className='section'>
       <h2>Estado de reparación</h2>

       <IonSelect value={selectedEstadoPresupuesto} placeholder='Seleccione estado' onIonChange={handleEstadoPresupuestoChange}>
        {estados.map((estado) => (
         <IonSelectOption key={estado.id} value={estado.id}>
          {estado.texto}
         </IonSelectOption>
        ))}
       </IonSelect>
      </div>

      <div>
       <div
        className='separador'
        style={{
         borderBottom: "2px solid #000",
         margin: "20px 10px",
         width: "90%",
        }}
       />
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
         <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eget ultricies lectus...</p>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
         <IonCheckbox checked={acceptedPolicies} className={acceptedPolicies ? "" : "checkbox-error"} onIonChange={handleAcceptPoliciesChange} />
         <span style={{ marginLeft: "20px" }}>Acepto las políticas de garantía</span>
         <IonAlert isOpen={showAlert2} onDidDismiss={() => setShowAlert2(false)} header='Error' message='Debe aceptar las políticas de privacidad para continuar.' buttons={["OK"]} />
        </div>
       </div>
       <div
        className='separador'
        style={{
         borderBottom: "2px solid #000",
         margin: "20px 10px",
         width: "90%",
        }}
       />

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
         { text: "Confirmar", handler: handleConfirmarClick },
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
          handler: () => setShowAlert(false),
         },
         { text: "Sí", handler: handleCancelarOrden },
        ]}
       />
       <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} header={"Error de validación"} message={"Por favor, complete todos los campos requeridos."} buttons={["OK"]} />
      </div>
     </div>
    </div>
   </IonContent>
  </IonPage>
 );
};

export default Presupuesto;
