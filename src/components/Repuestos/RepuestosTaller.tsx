import React, { useState, useEffect, ReactNode } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { IonContent, IonHeader, IonList, IonItem, IonLabel, IonButton, IonButtons, IonToast } from "@ionic/react";
import HeaderGeneral from "../Header/HeaderGeneral";
import { useOrden } from "../../pages/Orden/ordenContext";
import { fetchRepuestos, modificarStockPrincipal } from "./FetchsRepuestos";

interface Repuesto {
  id_repuesto_taller: any;
  id: any;
  nombre: ReactNode;
  cantidad: number;
  StockPrincipal: any;
  id_repuesto: any;
}

const RepuestosTaller: React.FC = () => {
  const history = useHistory();
  const [repuestos, setRepuestos] = useState<Repuesto[]>([]);
  const [repuestosOrden, setRepuestosOrden] = useState<Repuesto[]>([]);
  const [showToast, setShowToast] = useState(false);
  const { selectedRepuestosTaller, setSelectedRepuestosTaller } = useOrden();
  const location = useLocation();
  const [ordenId, setOrdenId] = useState<number | null>(null);
  const [reload, setReload] = useState(false);
  useEffect(() => {
    console.log("Location state:", location.state);
      // @ts-ignore
    if (location.state?.ordenSeleccionada) {
          // @ts-ignore
      setOrdenId(location.state.ordenSeleccionada.id);
      setSelectedRepuestosTaller([]);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchRepuestosData = async () => {
      const idEmpleado = localStorage.getItem("empleadoId") || "";
      try {
        const repuestosData = await fetchRepuestos("taller", idEmpleado);
        setRepuestos(repuestosData);
      } catch (error) {
        console.error("Error al obtener repuestos:", error);
      }
    };
  
    fetchRepuestosData();
  }, [reload]);

  

  const getRepuestosOrdenById = async (id: any) => {
    const API_URL = 'https://lv-back.online/orden/repuestos';
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener los repuestos de la orden');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchRepuestosOrdenData = async () => {
      if (ordenId) {
        try {
          const repuestosOrdenData = await getRepuestosOrdenById(ordenId);
          setRepuestosOrden(repuestosOrdenData);
        } catch (error) {
          console.error("Error al obtener los repuestos de la orden:", error);
        }
      }
    };

    fetchRepuestosOrdenData();
  }, [ordenId]);

  const updateRepuestoCantidad = async (id: number, nuevaCantidad: number) => {
    const repuestoActualizado = { cantidad: nuevaCantidad };

    try {
      await modificarStockPrincipal(id, repuestoActualizado);
    } catch (error) {
      console.error("Error al actualizar la cantidad del repuesto:", error);
    }
  };

  const handleAddRepuesto = (index: number) => {
    const repuestoToAdd = repuestos[index];
    if (repuestoToAdd.cantidad <= 0) {
      console.log("No se puede agregar, la cantidad es cero.");
      return;
    }

    const exists = selectedRepuestosTaller.find((repuesto) => repuesto.id_repuesto === repuestoToAdd.id_repuesto);
    
    if (!exists) {  // @ts-ignore
      setSelectedRepuestosTaller((prev) => [...prev, { ...repuestoToAdd, cantidad: 1 }]);
    } else {  // @ts-ignore
      setSelectedRepuestosTaller((prev) => prev.map((repuesto) =>
        repuesto.id_repuesto === repuestoToAdd.id_repuesto
          ? { ...repuesto, cantidad: repuesto.cantidad + 1 }
          : repuesto
      ));
    }

    updateRepuestoCantidad(repuestoToAdd.id, repuestoToAdd.cantidad - 1);
    setRepuestos((prevState) => prevState.map((repuesto) =>
      repuesto.id_repuesto === repuestoToAdd.id_repuesto
        ? { ...repuesto, cantidad: repuesto.cantidad - 1 }
        : repuesto
    ));
  };

  const handleRemoveRepuesto = (id_repuesto: number) => {
    const repuestoToRemove = selectedRepuestosTaller.find((repuesto) => repuesto.id_repuesto === id_repuesto);
    
    if (!repuestoToRemove) {
      console.error("Repuesto no encontrado.");
      return;
    }

    const repuestoOriginal = repuestos.find((repuesto) => repuesto.id_repuesto === id_repuesto);
    if (!repuestoOriginal) {
      console.error("El repuesto no se encuentra en la lista de stock disponible.");
      return;
    }

    updateRepuestoCantidad(repuestoToRemove.id, repuestoOriginal.cantidad + 1);
    setRepuestos((prevState) => prevState.map((repuesto) =>
      repuesto.id_repuesto === id_repuesto
        ? { ...repuesto, cantidad: repuesto.cantidad + 1 }
        : repuesto
    ));

    if (repuestoToRemove.cantidad > 1) {
  // @ts-ignore
      setSelectedRepuestosTaller((prev) =>
      
        prev.map((repuesto: { id_repuesto: any; cantidad: number; }) =>
          repuesto.id_repuesto === repuestoToRemove.id_repuesto
            ? { ...repuesto, cantidad: repuesto.cantidad - 1 }
            : repuesto
        )
      );
    } else {  // @ts-ignore
      setSelectedRepuestosTaller((prev) => prev.filter((repuesto) => repuesto.id_repuesto !== repuestoToRemove.id_repuesto));
    }
  };





 const updateRepuestoOrden = async (idRepuestoOrden: any, repuestoOrdenData: { cantidad: number; id_repuesto_taller: any; id: any; nombre: ReactNode; StockPrincipal: any; id_repuesto: any; }) => {
    const API_URL = 'https://lv-back.online/orden/repuestos';
    try {
        const response = await fetch(`${API_URL}/${idRepuestoOrden}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(repuestoOrdenData),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error al actualizar:', errorDetails);
            throw new Error('Error al actualizar los repuestos de la orden: ' + errorDetails.message);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};

const deleteRepuestoOrden = async (id: any) => {
    const API_URL = 'https://lv-back.online/orden/repuestos';
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar el repuesto de la orden');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const handleRemoveRepuestoOrden = async (id_repuesto_taller: any, cantidad = 1) => {
    if (ordenId === null) {
      console.error("ordenId no está definido.");
      return;
    }
  
    const repuestoToRemove = repuestosOrden.find((repuesto) => repuesto.id_repuesto_taller === id_repuesto_taller);
    if (!repuestoToRemove) {
      console.error("Repuesto de la orden no encontrado.");
      return;
    }
  
    const repuestoOriginal = repuestos.find((repuesto) => repuesto.id_repuesto === repuestoToRemove.id_repuesto_taller);
    if (repuestoOriginal) {
      await updateRepuestoCantidad(repuestoOriginal.id, repuestoOriginal.cantidad + cantidad);
    }
  
    if (repuestoToRemove.cantidad > cantidad) {
      const updatedRepuesto = { ...repuestoToRemove, cantidad: repuestoToRemove.cantidad - cantidad };
      await updateRepuestoOrden(repuestoToRemove.id, updatedRepuesto);
  
      setRepuestosOrden((prev) =>
        prev.map((repuesto) =>
          repuesto.id_repuesto_taller === id_repuesto_taller
            ? updatedRepuesto
            : repuesto
        )
      );
    } else {
      await deleteRepuestoOrden(repuestoToRemove.id);
  
      setRepuestosOrden((prev) =>
        prev.filter((repuesto) => repuesto.id_repuesto_taller !== id_repuesto_taller)
      );
    }
  
    // Aquí cambias el valor de reload para disparar la recarga
    setReload((prevReload) => !prevReload);
  };
  




 
  
  const handleConfirm = () => {
    history.push("/tallerorden");
  };

  const renderRepuestos = () => (
    <>
      <div className='container-listado-respuestos'>
        <IonList className='listado-respuestos'>
          {repuestos.map((repuesto, index) => (
            <IonItem key={index}>
              <IonLabel>{repuesto.nombre}</IonLabel>
              <IonButtons slot='end'>
                <IonLabel className={repuesto.cantidad > 0 ? "repuesto-incrementado" : ""}>{repuesto.cantidad}</IonLabel>
                <IonButton onClick={() => handleAddRepuesto(index)}>+</IonButton>
                <IonButton onClick={() => handleRemoveRepuesto(repuesto.id_repuesto)}>-</IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </div>

      <IonItem className='listado-seleccionados'>
        <IonLabel className='subtitle-listado-seleccionados'>Seleccionado:</IonLabel>
      </IonItem>
      <IonList>
        {selectedRepuestosTaller.map((repuesto, index) => (
          <IonItem key={index}>
            <IonLabel>{repuesto.nombre}</IonLabel>
            <IonLabel>{repuesto.cantidad}</IonLabel>
          </IonItem>
        ))}
      </IonList>

      <IonItem className='listado-orden'>
        <IonLabel className='subtitle-listado-orden'>Repuestos de la Orden:</IonLabel>
      </IonItem>
      <IonList>
        {repuestosOrden.map((repuesto, index) => (
          <IonItem key={index}>
            <IonLabel>{repuesto.nombre}</IonLabel>
            <IonLabel>{repuesto.cantidad}</IonLabel>
            <IonButton onClick={() => handleRemoveRepuestoOrden(repuesto.id_repuesto_taller)}>-</IonButton>
          </IonItem>
        ))}
      </IonList>
    </>
  );

  return (
    <IonContent>
      <IonHeader>
        <HeaderGeneral  />
      </IonHeader>
      {renderRepuestos()}
      <IonButton expand="full" onClick={handleConfirm}>Confirmar</IonButton>
      <IonToast isOpen={showToast} message="Repuesto agregado." duration={2000} onDidDismiss={() => setShowToast(false)} />
    </IonContent>
  );
};

export default RepuestosTaller;
