import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonLabel,
  IonIcon,
  IonAlert,
} from "@ionic/react";
import { addOutline, cameraOutline } from "ionicons/icons";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./Facturacion.css";
import { useHistory, useLocation } from "react-router-dom";
import { useOrden } from "../../Provider/Provider";
import Fotos from "../Fotos/Fotos";
interface MedioDePago {
  id: number;
  value: string;
  medio_de_pago: string;
}

const FacturacionComponent = () => {
  const location = useLocation();
  const history = useHistory();
  const { orden } = location.state as { orden: any };
 
  const [mediosPago, setMediosPago] = useState<MedioDePago[]>([]);
   const [importe, setImporte] = useState<string>("");
  const [estadoPago, setEstadoPago] = useState<string>("pendiente");
  const [imagenComprobante, setImagenComprobante] = useState<string>("");
  const [entregaId, setEntregaId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const { ordenActiva} = useOrden();
  const [selectedMedioPago, setSelectedMedioPago] = useState( ordenActiva.Presupuesto.id_medio_de_pago);
 
  const entregaPago = async (idEntrega:any) => {
    try {
      const response = await fetch(`https://lv-back.online/pagos/entrega/${idEntrega}`);
      const pagos = await response.json();
      if (pagos && pagos.length > 0) {
        console.log(`Se encontraron pagos asociados a la entrega id ${idEntrega}`);
        return pagos[0]; // Retorna el primer pago encontrado
      } else {
        console.log(`No se encontró ningún pago asociado a la entrega id ${idEntrega}`);
        return null;
      }
    } catch (error) {
      console.error("Error al verificar pagos asociados a la entrega.", error);
      return null;
    }
  };
  const guardarPago = async () => {
    if (!selectedMedioPago) {
      console.error("No se ha seleccionado un medio de pago.");
      return;
    }
  
    const pago = {
      id_medio_de_pago: selectedMedioPago,
      id_entrega: entregaId || ordenActiva.Entrega.id,  
      importe: ordenActiva.Presupuesto.total,
      imagen_comprobante: imagenComprobante,
    };
  
    try {
      const pagoExistente = await entregaPago(ordenActiva.Entrega.id);
      
      console.log("Pago existente:", pagoExistente);
      const url = pagoExistente
        ? `https://lv-back.online/pagos/modificar/${pagoExistente.id}`
        : "https://lv-back.online/pagos/guardar";
      const method = pagoExistente ? "PUT" : "POST";
  
      console.log(`URL de la solicitud: ${url}`);
      console.log(`Método de la solicitud: ${method}`);
      console.log(`Datos del pago a enviar:`, pago);
  
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pago),
      });
  
      if (response.ok) {
        console.log("Pago procesado exitosamente.");
        setShowAlert(true);
      } else {
        const errorText = await response.text();
        console.error("Error al procesar el pago:", errorText);
      }
    } catch (error) {
      console.error("Error al guardar el pago.", error);
    }
  };
 

  const fetchMediosDePago = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/pago");
      const mediosDePago: MedioDePago[] = await response.json();
      setMediosPago(mediosDePago[0] !== undefined ? mediosDePago : []);
      console.log(mediosDePago);
    } catch (error) {
      console.error(
        "Error, no se encontraron medios de pago en la base de datos....",
        error
      );
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
      history.push("/remito", { orden });
      // } else if (option === "descargar") {
      //   window.print();
    } else if (option === "enviar") {
      console.log("Enviando remito al cliente...");
    } else if (option === "inicio") {
      history.push("/domicilio");
    }
  };

 
  const handleFotosClick = (isFactura: boolean) => {
    history.push({
      pathname: '/fotos',
      state: {isFactura},
    });
  };
  return (
    <IonContent className="facturacion-container">
       <IonHeader>
        <HeaderGeneral />
      </IonHeader>  
      <div className="facturacion-box">
        <h2 className="text-center">Condiciones de pago</h2>
        <div className="estado-pago">
          <IonSelect
            className="placeholder-estado-pago"
            placeholder="Estado"
            value={estadoPago}
            onIonChange={(e) => setEstadoPago(e.detail.value)}
          >
            <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
            <IonSelectOption value="pagado">Pagado</IonSelectOption>
            <IonSelectOption value="rechazado">Rechazado</IonSelectOption>
          </IonSelect>
        </div>
        <div className="estado-pago-total">
  <span>Total:</span>
  <span className="total-amount">${ordenActiva.Presupuesto?.total || 0}</span>
</div>

{/* Mostrar Comisión Técnico */}
<div className="estado-pago-total" style={{marginTop:'20px'}}>
  <span>Comisión a cobrar:</span>
  <span  className="total-amount">
    ${ ordenActiva.Presupuesto?.comision_visita }
  </span>
</div>

        <div className="subtitle-forma-pago">
          <span>Formas de pago</span>
        </div>
        <div className="forma-pago">
        <IonSelect
  placeholder="Seleccionar forma de pago"
  value={selectedMedioPago || ordenActiva?.Presupuesto?.id_medio_de_pago}  
 disabled
>
  {mediosPago.map((medio, index) => (
    <IonSelectOption key={index} value={medio.id}>
      {medio.medio_de_pago}
    </IonSelectOption>
  ))}
</IonSelect>
 {/* INPUT DE TOTAL */}
          {/* <IonInput value={`$${ordenActiva.Presupuesto?.total || 0}`} /> */}
        </div>
        <div className="adjuntar-foto">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
       
          
  
          <IonButton style={{ '--border-radius': '20px' }} onClick={() => handleFotosClick(true)}>
          <IonIcon icon={cameraOutline} className="custom-icon" />
              Agregar comprobante de pago
            </IonButton>
          
        </div>
        <IonButton
          expand="block"
          className="finalizar-button"
          onClick={guardarPago}
        >
          Finalizar
        </IonButton>
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Opciones de remito"}
          message={"¿Qué desea hacer con el remito?"}
          buttons={[
            {
              text: "Ver remito",
              handler: () => handleOptionSelection("ver"),
            },
            // {
            //   text: "Descargar remito",
            //   handler: () => handleOptionSelection("descargar"),
            // },
      
            {
              text: "Ir al inicio",
              handler: () => handleOptionSelection("inicio"),
            },
          ]}
        />
      </div>
    </IonContent>
  );
};

export default FacturacionComponent;
