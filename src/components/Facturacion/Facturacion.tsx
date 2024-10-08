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
  const [selectedMedioPago, setSelectedMedioPago] = useState<number | null>(
    null
  );
  const [importe, setImporte] = useState<string>("");
  const [estadoPago, setEstadoPago] = useState<string>("pendiente");
  const [imagenComprobante, setImagenComprobante] = useState<string>("");
  const [entregaId, setEntregaId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const entregaPago = async (idEntrega: number) => {
    try {
      const response = await fetch(
        `https://lv-back.online/pagos/entrega/${idEntrega}`
      );
      const pagos = await response.json();
      if (pagos && pagos.length > 0) {
        console.log(
          `Se encontraron pagos asociados a la entrega id ${idEntrega}`
        );
        return pagos[0]; // Retorna el primer pago encontrado
      } else {
        console.log(
          `No se encontró ningún pago asociado a la entrega id ${idEntrega}`
        );
        return null;
      }
    } catch (error) {
      console.error("Error al verificar pagos asociados a la entrega.", error);
      return null;
    }
  };

  const guardarPago = async () => {
    if (selectedMedioPago === null || entregaId === null) {
      console.error("No se ha seleccionado un medio de pago o no hay entrega.");
      return;
    }

    const pago = {
      id_medio_de_pago: selectedMedioPago,
      id_entrega: entregaId,
      importe: orden.Presupuesto.total,
      imagen_comprobante: imagenComprobante,
    };

    try {
      const pagoExistente = await entregaPago(entregaId);
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
        setShowAlert(true);
      } else {
        console.log("Error al procesar el pago.");
      }
    } catch (error) {
      console.error("Error al guardar el pago.", error);
    }
  };

  const ordenEntrega = async (entregaId: any) => {
    try {
      const response = await fetch(
        `https://lv-back.online/entregas/orden/${entregaId}`
      );
      const entrega = await response.json();
      if (entrega) {
        console.log(
          `Se encontró una entrega asociada a la órden id ${entregaId}`
        );
        console.log(entrega);
        setEntregaId(entrega.id);
        return entrega;
      } else {
        console.log(
          `No se encontró ninguna entrega asociada a la órden id ${entregaId}`
        );
        return false;
      }
    } catch (error) {
      console.error("Error, entrega no encontrada.", error);
    }
  };

  useEffect(() => {
    ordenEntrega(orden.id);
  }, [orden.id]);

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
      setImagenComprobante(fileURL); // Guardar la URL del archivo
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

  useEffect(() => {
    if (orden && orden.id) {
      ordenEntrega(orden.id);
    } else {
      console.error("No se encontró la orden.");
    }
  }, [orden]);

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
          <span className="total-amount">${orden.Presupuesto?.total || 0}</span>
        </div>
        <div className="subtitle-forma-pago">
          <span>Formas de pago</span>
        </div>
        <div className="forma-pago">
          <IonSelect
            placeholder="Seleccionar forma de pago"
            value={selectedMedioPago}
            onIonChange={(e) => setSelectedMedioPago(parseInt(e.detail.value))}
          >
            {mediosPago.map((medio, index) => (
              <IonSelectOption key={index} value={medio.id}>
                {medio.medio_de_pago}
              </IonSelectOption>
            ))}
          </IonSelect>

          <IonInput value={`$${orden.Presupuesto?.total || 0}`} />
        </div>
        <div className="adjuntar-foto">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
          />
          <IonButton
            className="custom-button"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <IonIcon icon={cameraOutline} className="custom-icon" />
            Adjuntar foto de comprobante
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
              text: "Enviar remito al cliente",
              handler: () => handleOptionSelection("enviar"),
            },
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
