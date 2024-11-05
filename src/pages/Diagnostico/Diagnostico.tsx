import React, { useState, useEffect, useRef } from "react";
import { IonContent, IonPage, IonIcon, IonCheckbox, IonInput, IonButton, IonHeader, IonAlert, IonSelect, IonSelectOption } from "@ionic/react";
import { pencilOutline } from "ionicons/icons";
import "./diagnostico.css";
import HeaderGeneral from "../../components/Header/HeaderGeneral";
import { useHistory } from "react-router-dom";
import { modificarOrden, getFotosNumeroOrden, Orden, listaReparaciones} from "./fetchs";
import { useOrden } from "../../Provider/Provider";
import Fotos from "../../components/Fotos/Fotos";
interface Foto {
  ruta_imagen: string;
}
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
 const [reparaciones, setReparaciones] = useState<any[]>([]);
 const [selectedReparaciones, setSelectedReparaciones] = useState<number[]>([]);
 const [motivoCheckboxValues, setMotivoCheckboxValues] = useState<boolean[]>([]);
 const [fotos, setFotos] = useState<Foto[]>([]);
 
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

    const reparacionesData = await listaReparaciones();
    setReparaciones(reparacionesData || []);

    const diagnosticoOrden = ordenActiva.diagnostico || "";
    const nuevosCheckboxValues = textosCheckbox.map((texto) =>
      diagnosticoOrden.includes(texto)
    );
    setCheckboxValues(nuevosCheckboxValues);

    if (ordenActiva.motivo) {
      const motivosSeleccionados = ordenActiva.motivo.split(", ");
      setSelectedReparaciones(motivosSeleccionados);
    }

    const numeroOrden = ordenActiva.id;
    if (numeroOrden) {
      const fotosObtenidas = await getFotosNumeroOrden(numeroOrden);
      setFotos(fotosObtenidas);
    }
  }
};

useEffect(() => {
  loadData();
}, [ordenActiva, textosCheckbox, tiposDeFunciones]);
 const handleConfirmarClick = async () => {
  const diagnostico = textosCheckbox.filter((texto, index) => checkboxValues[index]).join(", ");

  const dataToSend = {
   equipo,
   marca,
   modelo,
   cliente,
   diagnostico,
   motivo: selectedReparaciones.join(", "), 
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
 
 const handleReparacionChange = (value: number[]) => {
  setSelectedReparaciones(value);
  console.log(selectedReparaciones)
};

const handleMotivoCheckboxChange = (index: number, checked: boolean) => {
  const newMotivoCheckboxValues = [...motivoCheckboxValues];
  newMotivoCheckboxValues[index] = checked;
  setMotivoCheckboxValues(newMotivoCheckboxValues);

  const newSelectedReparaciones = reparaciones
    .filter((_, i) => newMotivoCheckboxValues[i])
    .map(reparacion => reparacion.reparacion);
  setSelectedReparaciones(newSelectedReparaciones);
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
        <h2>Motivos de la reparación</h2>
        <IonSelect
          placeholder="Seleccione reparaciones"
          multiple
          value={selectedReparaciones} // Aquí reflejamos las reparaciones seleccionadas
          onIonChange={(e) => handleReparacionChange(e.detail.value)}
        >
          {reparaciones.map((reparacion, index) => (
            <IonSelectOption key={index} value={reparacion.reparacion}>
              {reparacion.reparacion}
            </IonSelectOption>
          ))}
        </IonSelect>
      </div>



<div>
<IonButton onClick={() => handleFotosClick(false)}>
 Agregar Fotos
</IonButton>


</div>


<div className="fotos-miniaturas-container">
                {fotos.length > 0 ? (
                    fotos.map((foto, index) => (
                        <div key={index} className="foto-miniatura">
                            <img 
                                src={foto.ruta_imagen} 
                                 alt={`Foto ${index}`} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                            />
                        </div>
                    ))
                ) : (
                    <p>No hay fotos disponibles.</p>
                )}
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
