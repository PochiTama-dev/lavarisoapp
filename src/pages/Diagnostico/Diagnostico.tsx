import React, { useState, useEffect, useRef } from "react";
import { IonContent, IonPage, IonIcon, IonCheckbox, IonInput, IonButton, IonHeader, IonAlert } from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import "./diagnostico.css";
import HeaderGeneral from "../../components/Header/HeaderGeneral";
import { useHistory } from "react-router-dom";
import { modificarOrden, fetchTiposFunciones, Orden } from "./fetchs";
import { useOrden } from "../../Provider/Provider";

const Diagnostico: React.FC = () => {
 const [equipo, setEquipo] = useState("");
 const [marca, setMarca] = useState("");
 const [modelo, setModelo] = useState("");
 const [cliente, setCliente] = useState("");
 const [checkboxValues, setCheckboxValues] = useState<boolean[]>(Array(10).fill(false));
 const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
 const history = useHistory();
 const motivoRef = useRef<HTMLIonInputElement>(null);
 const [showConfirm, setShowConfirm] = useState(false);
 const { cargarOrdenes, ordenActiva, setOrdenActiva, tiposDeFunciones } = useOrden();
 
 useEffect(() => {
  const loadData = async () => {
   
    if (ordenActiva) {
     setTextosCheckbox(tiposDeFunciones);
     setEquipo(ordenActiva.equipo || "");
     setMarca(ordenActiva.marca || "");
     setModelo(ordenActiva.modelo || "");
     setCliente(ordenActiva.Cliente?.numero_cliente || "");
     if (motivoRef.current) {
      motivoRef.current.value = ordenActiva.motivo || "";
     }
     const diagnosticoOrden = ordenActiva.diagnostico || "";
     const nuevosCheckboxValues = textosCheckbox.map((texto) => diagnosticoOrden.includes(texto));
     setCheckboxValues(nuevosCheckboxValues);
    }
   }  
   
  {
   loadData();
  }
 }, [ordenActiva, textosCheckbox, tiposDeFunciones]);

 const handleConfirmarClick = async () => {
  const diagnostico = textosCheckbox.filter((texto, index) => checkboxValues[index]).join(", ");

  const dataToSend = {
   equipo,
   marca,
   modelo,
   cliente,
   diagnostico,
   motivo: String(motivoRef.current?.value || ""),
   checkboxValues,
  };

  if (ordenActiva && ordenActiva.id) {
   const success = await modificarOrden(ordenActiva.id, dataToSend);
   if (success) {
    console.log("Orden guardada", dataToSend);

    // Actualiza la orden activa en el contexto
    setOrdenActiva({
     ...ordenActiva,
     ...dataToSend,
    });

    cargarOrdenes();
    history.push('/verOrden');
   } else {
    
    console.log("Error al guardar en la base de datos.");
   }
  } else {
   console.error("No se pudo obtener el ID de la orden.");
  }
 };
 function setMotivo(arg0: string): void {
  throw new Error("Function not implemented.");
 }

 return (
  <IonPage>
   <IonContent>
    <IonHeader>
     <HeaderGeneral />
    </IonHeader>

    <div className='diagnostico-ctn'>
     <div className='section'>
      <h2>Diagnosticar</h2>

      <div className='item2'>
       <span>
        <strong>Equipo:</strong>
       </span>
       <IonInput style={{ marginLeft: "10px" }} value={equipo} placeholder='Ingrese equipo' onIonChange={(e) => setEquipo(e.detail.value!)} />
       <IonIcon icon={pencilOutline} className='icon-pencil' style={{ fontSize: "22px" }} />
      </div>
      <div className='item2'>
       <span>
        <strong>Marca:</strong>
       </span>
       <IonInput style={{ marginLeft: "10px" }} value={marca} placeholder='Ingrese marca' onIonChange={(e) => setMarca(e.detail.value!)} />
       <IonIcon icon={pencilOutline} className='icon-pencil' style={{ fontSize: "22px" }} />
      </div>
      <div className='item2'>
       <span>
        <strong>Modelo:</strong>
       </span>
       <IonInput style={{ marginLeft: "10px" }} value={modelo} placeholder='Ingrese modelo' onIonChange={(e) => setModelo(e.detail.value!)} />
       <IonIcon icon={pencilOutline} className='icon-pencil' style={{ fontSize: "22px" }} />
      </div>
      <div className='item2'>
       <span>
        <strong>N° de cliente:</strong>
       </span>
       <IonInput style={{ marginLeft: "10px" }} value={cliente} placeholder='Ingrese N° de cliente' onIonChange={(e) => setCliente(e.detail.value!)} />
      </div>
     </div>
     <div className='section'>
      <h2>Chequeo de funcionamiento</h2>
      <div className='checkbox-container'>
       {textosCheckbox.map((texto, index) => (
        <div key={index} className='checkbox-item'>
         <IonCheckbox
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
      <h2>Diagnostico</h2>
      <IonInput className='obs-input' ref={motivoRef} onIonChange={(e) => setMotivo(e.detail.value!)} placeholder='Ingrese diagnóstico' />
     </div>
     <div className='section'>
      <IonButton className='button' style={{ "--border-radius": "20px" }} onClick={() => setShowConfirm(true)}>
       Confirmar
      </IonButton>

      <IonAlert
       isOpen={showConfirm}
       onDidDismiss={() => setShowConfirm(false)}
       header={"Confirmar acción"}
       message={"¿Deseas confirmar este diagnóstico?"}
       buttons={[
        {
         text: "Cancelar",
         role: "cancel",
         cssClass: "secondary",
        },
        {
         text: "Aceptar",
         handler: handleConfirmarClick,
        },
       ]}
      />
     </div>
    </div>
   </IonContent>
  </IonPage>
 );
};

export default Diagnostico;
