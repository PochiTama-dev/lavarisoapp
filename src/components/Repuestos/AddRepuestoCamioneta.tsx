import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonAlert, IonList, IonModal, IonCheckbox } from "@ionic/react";
import HeaderGeneral from "../Header/HeaderGeneral";
import { guardarStockCamioneta, modificarStockCamioneta } from "./FetchsRepuestos";
import { useOrden } from "../../Provider/Provider";
import GlobalRefresher from "../Refresher/GlobalRefresher";
import NotaCompra from "./nota de compra/notaCompra";
import FotoComprobante from "./FotoComprobante";
import RepuestoUsado from "./repuesto usado/RepuestoUsado";
const AddRepuestoCamioneta: React.FC = () => {
 const [nombreRepuesto, setNombreRepuesto] = useState<string>("");
 const [cantidad, setCantidad] = useState<number>(0); // Cambiado a 0
 const [idEmpleado, setIdEmpleado] = useState<number | undefined>(undefined);
 const [showAlert, setShowAlert] = useState<{ success: boolean; message: string } | null>(null);
 const [cantidadesModificadas, setCantidadesModificadas] = useState<{ [key: number]: number }>({});
 const [modalNota, setModalNota] = useState(false);
 const [modalRep, setModalRep] = useState(false);
 const [checkbox, setCheckbox] = useState(false);
 const [precio, setPrecio] = useState("");
 const { repuestosCamioneta } = useOrden();
 const [localRepuestosCamioneta, setLocalRepuestosCamioneta] = useState<any[]>(repuestosCamioneta);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [isFotoModalOpen, setIsFotoModalOpen] = useState(false); // Nuevo estado para el modal de foto
 const [comprobanteFoto, setComprobanteFoto] = useState<string | undefined>(undefined); // URL de la foto del comprobante

 useEffect(() => {
  const empleadoId = localStorage.getItem("empleadoId");
  if (empleadoId) {
   setIdEmpleado(parseInt(empleadoId, 10));
  } else {
   setShowAlert({ success: false, message: "Error: No se pudo obtener el ID del empleado." });
  }
 }, []);

 useEffect(() => {
  // Mantiene sincronizado localRepuestosCamioneta con repuestosCamioneta en caso de cambios externos
  setLocalRepuestosCamioneta(repuestosCamioneta);
 }, [repuestosCamioneta]);

 ///////// AGREGAR REPUESTO

 const handleAgregarRepuesto = () => {
  if (!nombreRepuesto.trim() || cantidad <= 0 || !precio || parseFloat(precio) <= 0) {
   setShowAlert({ success: false, message: "Todos los campos deben ser válidos antes de continuar." });
   return;
  }
  setIsModalOpen(true); // Abrir modal
 };

 // const handleAgregarRepuesto = async () => {
 //   if (!nombreRepuesto.trim()) {
 //     setShowAlert({ success: false, message: 'El nombre del repuesto no puede estar vacío.' });
 //     return;
 //   }

 //   if (cantidad <= 0) {
 //     setShowAlert({ success: false, message: 'La cantidad debe ser mayor a 0.' });
 //     return;
 //   }

 //   if (!precio || parseFloat(precio) <= 0) {
 //     setShowAlert({ success: false, message: 'El precio debe ser mayor a 0.' });
 //     return;
 //   }

 //   if (confirm('¿Desea agregar el repuesto?')) {
 //     const repuesto = {
 //       nombre: nombreRepuesto,
 //       cantidad: cantidad,
 //       id_empleado: idEmpleado,
 //       id_repuesto: null,
 //       lote: '',
 //       isUsado: checkbox,
 //       precio: parseFloat(precio),
 //     };

 //     console.log(repuesto);

 //     //@ts-ignore
 //     const success = await guardarStockCamioneta(repuesto);

 //     if (success) {
 //       setShowAlert({ success: true, message: 'Repuesto agregado exitosamente al stock de la camioneta.' });
 //       setNombreRepuesto('');
 //       setCantidad(0);
 //       setPrecio('');
 //       setCheckbox(false);

 //       setLocalRepuestosCamioneta((prev) => [...prev, { ...repuesto, id: new Date().getTime() }]);
 //     } else {
 //       setShowAlert({ success: false, message: 'Error al agregar el repuesto al stock de la camioneta.' });
 //     }
 //   }
 // };

 const handleCargarComprobante = () => {
  setIsFotoModalOpen(true);
 };

 // Guarda la foto del comprobante y cierra el modal
 const handlePhotoTaken = (photoUrl: string) => {
  setComprobanteFoto(photoUrl);
  setIsFotoModalOpen(false);
 };

 const [imageUrl, setImageUrl] = useState("");

 useEffect(() => {
  // Nombre de la foto (puedes obtenerlo dinámicamente de alguna base de datos o del estado)
  const filename = "1732303988304-comprobante.jpg";

  // Construir la URL de la imagen
  const url = `https://lv-back.online/uploads/${filename}`;

  // Hacer el fetch para obtener la imagen
  fetch(url)
   .then((response) => {
    if (response.ok) {
     setImageUrl(url); // Si la respuesta es exitosa, mostrar la imagen
    } else {
     console.error("Error al obtener la imagen:", response.status);
    }
   })
   .catch((error) => {
    console.error("Error al hacer el fetch:", error);
   });
 }, []);

 console.log("IMAGE YRL", imageUrl);

 // Enviar los datos a la base de datos, incluyendo la foto del comprobante
 const handleGuardarConComprobante = async () => {
  const repuesto = {
   nombre: nombreRepuesto,
   cantidad,
   precio: parseFloat(precio),
   id_empleado: idEmpleado,
   comprobante_compra: comprobanteFoto, // Aquí pasamos la URL de la foto
   isUsado: checkbox,
   lote: "",
  };

  const success = await guardarStockCamioneta(repuesto);
  if (success) {
   setShowAlert({ success: true, message: "Repuesto agregado exitosamente al stock con comprobante." });
   setNombreRepuesto("");
   setCantidad(0);
   setPrecio("");
   setComprobanteFoto(undefined); // Limpiar la foto después de guardar
  } else {
   setShowAlert({ success: false, message: "Error al guardar el repuesto con comprobante." });
  }
  setIsModalOpen(false); // Cerrar el modal principal
 };

 const handleCantidadChange = (id: number, nuevaCantidad: string) => {
  const cantidadNumerica = parseInt(nuevaCantidad, 10);
  if (!isNaN(cantidadNumerica)) {
   setCantidadesModificadas((prevState) => ({
    ...prevState,
    [id]: cantidadNumerica,
   }));
  }
 };

 const aumentarCantidad = (id: number) => {
  setCantidadesModificadas((prevState) => ({
   ...prevState,
   [id]: (prevState[id] ?? 0) + 1,
  }));
 };

 const disminuirCantidad = (id: number) => {
  setCantidadesModificadas((prevState) => ({
   ...prevState,
   [id]: (prevState[id] ?? 1) > 0 ? prevState[id]! - 1 : 0,
  }));
 };

 const handleGuardarCantidades = async () => {
  try {
   const promises = repuestosCamioneta.map(async (repuesto: any) => {
    const nuevaCantidad = cantidadesModificadas[repuesto.id];
    if (nuevaCantidad !== undefined && nuevaCantidad !== repuesto.cantidad) {
     const actualizado = await modificarStockCamioneta(repuesto.id, { cantidad: nuevaCantidad });
     if (!actualizado) {
      throw new Error(`Error al modificar el stock del repuesto con ID ${repuesto.id}`);
     }
     console.log(`Stock actualizado: ${repuesto.nombre} - Nueva cantidad: ${nuevaCantidad}`);
    }
   });

   await Promise.all(promises);
   setShowAlert({ success: true, message: "Cantidades modificadas con éxito." });
  } catch (error) {
   console.error(error);
   setShowAlert({ success: false, message: "Error al modificar las cantidades." });
  }
 };
 const handleModalNota = () => {
  setModalNota(!modalNota);
 };
 const handleModalRep = () => {
  setModalRep(!modalRep);
 };

 const handleGuardarSinComprobante = async () => {
  const repuesto = {
   nombre: nombreRepuesto,
   cantidad,
   precio: parseFloat(precio),
   id_empleado: idEmpleado,
   id_repuesto: null,
   isUsado: checkbox,
   lote: "",
  };

  const success = await guardarStockCamioneta(repuesto);
  if (success) {
   setShowAlert({ success: true, message: "Repuesto agregado exitosamente al stock." });
   setNombreRepuesto("");
   setCantidad(0);
   setPrecio("");
   setCheckbox(false);
  } else {
   setShowAlert({ success: false, message: "Error al guardar el repuesto." });
  }
  setIsModalOpen(false);
 };

 return (
  <GlobalRefresher>
   <IonPage>
    <HeaderGeneral />
    <IonContent className='ion-padding'>
     <IonItem>
      <IonLabel position='stacked'>Nombre del Repuesto</IonLabel>
      <IonInput value={nombreRepuesto} placeholder='Ingresa el nombre del repuesto' onIonChange={(e) => setNombreRepuesto(e.detail.value!)} />
     </IonItem>

     <IonItem>
      <IonLabel position='stacked'>Cantidad</IonLabel>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
       <IonInput value={cantidad} onIonChange={(e) => setCantidad(parseInt(e.detail.value!, 10) || 0)} style={{ width: "80px", textAlign: "right", margin: "0 8px" }} />
       <IonButton onClick={() => setCantidad((prev) => prev + 1)}>+</IonButton>
       <IonButton onClick={() => setCantidad((prev) => (prev > 0 ? prev - 1 : 0))}>–</IonButton>
      </div>
       <IonCheckbox style={{ width: "100%" }} onClick={() => setCheckbox(!checkbox)}>
        Es usado ?
       </IonCheckbox>
       <div style={{ display: "inline-flex", width: "100%", alignItems: "center" }}>
  <span>Precio</span>
  <IonInput
    value={precio}
    onIonChange={(e) => setPrecio(e.detail.value || "")}
    placeholder="$0.00"
    style={{ marginLeft: "auto", textAlign: "right", width: "150px" }}
  />
</div>


     </IonItem>

     <IonButton expand='block' onClick={handleAgregarRepuesto}>
      Agregar Repuesto
     </IonButton>
{/* 
     <IonButton expand='block' onClick={handleModalNota}>
      Nota de compra
     </IonButton>

     {modalNota && (
      <>
       <IonModal isOpen={modalNota} onDidDismiss={() => setModalNota(false)}>
        <NotaCompra />
       </IonModal>
      </>
     )} */}

     {modalRep && (
      <>
       <IonModal isOpen={modalRep} onDidDismiss={() => setModalRep(false)}>
        <RepuestoUsado />
       </IonModal>
      </>
     )}

     <h1>Repuestos propios</h1>
     <IonList  className="lista-repuestos-propios">
      {localRepuestosCamioneta && localRepuestosCamioneta.length > 0 ? (
       localRepuestosCamioneta.map((repuesto: any) => (
        <IonItem key={repuesto.id}>
         <IonLabel>{repuesto.nombre}</IonLabel>
         <div style={{ display: "flex", width: "100%", justifyContent: "space-around" }}>
          <IonInput
           value={cantidadesModificadas[repuesto.id] ?? repuesto.cantidad}
           onIonChange={(e) => handleCantidadChange(repuesto.id, e.detail.value!)}
           style={{ width: "80px", textAlign: "right", margin: "0 8px" }}
           slot='end'
          />
          <div>
           <IonButton onClick={() => aumentarCantidad(repuesto.id)}>+</IonButton>
           <IonButton onClick={() => disminuirCantidad(repuesto.id)}>-</IonButton>
          </div>
         </div>
        </IonItem>
       ))
      ) : (
       <IonItem>
        <IonLabel>No hay repuestos disponibles.</IonLabel>
       </IonItem>
      )}
     </IonList>
     {/* Modal */}
     <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
      <IonContent className='ion-padding'>
       <h2>Cargar Comprobante</h2>
       <p>¿Quieres cargar un comprobante de compra o continuar sin él?</p>
       <IonButton expand='block' onClick={handleCargarComprobante}>
        Cargar Comprobante
       </IonButton>
       <IonButton expand='block' color='secondary' onClick={handleGuardarConComprobante}>
        Continuar con comprobante
       </IonButton>

       <IonButton expand='block' color='secondary' onClick={handleGuardarSinComprobante}>
        Continuar sin comprobante
       </IonButton>

       <IonButton expand='block' fill='outline' onClick={() => setIsModalOpen(false)}>
        Cancelar
       </IonButton>
      </IonContent>
     </IonModal>
     {isFotoModalOpen && (
      <IonModal isOpen={isFotoModalOpen} onDidDismiss={() => setIsFotoModalOpen(false)}>
       <FotoComprobante onPhotoTaken={handlePhotoTaken} />
      </IonModal>
     )}
     {showAlert && <IonAlert isOpen={!!showAlert} onDidDismiss={() => setShowAlert(null)} header={showAlert.success ? "Éxito" : "Error"} message={showAlert.message} buttons={["OK"]} />}
    </IonContent>
   </IonPage>
  </GlobalRefresher>
 );
};

export default AddRepuestoCamioneta;
