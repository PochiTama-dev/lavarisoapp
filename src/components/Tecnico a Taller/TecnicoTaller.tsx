import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./TecnicoTaller.css";
import { IonAlert, IonButton, IonContent, IonHeader } from "@ionic/react";
import { useOrden } from "../../pages/Orden/ordenContext";

function TecnicoTallerComponent() {
  const history = useHistory();
  const [ordenes, setOrdenes] = useState<any>([]);
  const [ordenActiva, setOrdenActiva] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const { ordenSeleccionada, setOrdenSeleccionada } = useOrden();

  const handleButtonClick = (path: any, orden = null) => {
    if (orden) {
      history.push({
        pathname: path,
        state: { orden },
      });
    } else {
      history.push(path);
    }
  };

  const estadoPresupuestoMap: { [key: number]: string } = {
    1: "Aprobada",
    2: "Cancelada",
    3: "Cerrada",
    4: "Pendiente",
  };

  useEffect(() => {
    const fetchOrdenes = async () => {
      const empleadoId = localStorage.getItem("empleadoId");
      if (!empleadoId) {
        console.error("Empleado ID no encontrado en el localStorage");
        return;
      }

      try {
        const ordenesResponse = await fetch("https://lv-back.online/ordenes");
        const clientesResponse = await fetch(
          "https://lv-back.online/clientes/lista"
        );

        if (!ordenesResponse.ok || !clientesResponse.ok) {
          throw new Error("Error al obtener datos de las APIs");
        }

        const ordenesData = await ordenesResponse.json();
        const clientesData = await clientesResponse.json();

        if (ordenesData.length > 0 && clientesData.length > 0) {
          const clientesMap = new Map(
            clientesData.map((cliente: { id: any }) => [cliente.id, cliente])
          );
          const ordenesConClientes = ordenesData
            .map((orden: { cliente_id: any; Empleado: { id: any } }) => ({
              ...orden,
              cliente: clientesMap.get(orden.cliente_id),
            }))
            .filter(
              (orden: {
                Presupuesto: any;
                id_tipo_estado: number;
                Empleado: { id: string | null };
              }) =>
                orden.Empleado.id == empleadoId &&
                orden.id_tipo_estado == 1 &&
                (orden.Presupuesto.id_estado_presupuesto === 2 ||
                  orden.Presupuesto.id_estado_presupuesto === 4)
            );

          setOrdenes(ordenesConClientes);
        } else {
          console.log(
            "No se encontraron ordenes o clientes en la base de datos."
          );
          setOrdenes([]);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchOrdenes();
  }, []);

  const handleVerOrden = (orden: any) => {
    setOrdenSeleccionada(orden);
    setShowAlert(true);
  };

  return (
    <IonContent className="tecnico-taller-container">
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      <div className="tecnico-taller-top-box">
        {ordenActiva && (
          <div>
            <h3>
              <strong>Orden Activa</strong> #{ordenActiva.id}
            </h3>
            <div>
              <h4>
                <strong>Equipo:</strong> {ordenActiva.equipo}
              </h4>
              <h4>
                <strong>Marca:</strong> {ordenActiva.marca}
              </h4>
              <h4>
                <strong>Modelo:</strong> {ordenActiva.modelo}
              </h4>
              <h4>
                <strong>N° Cliente:</strong>{" "}
                {ordenActiva.Cliente.numero_cliente}
              </h4>
            </div>
          </div>
        )}
        <div className="tecnico-taller-repuestos-button">
          <IonButton onClick={() => handleButtonClick("/repuestos")}>
            Repuestos
          </IonButton>
          {ordenActiva ? (
            <IonButton
              onClick={() => handleButtonClick("/presupuesto", ordenActiva)}
            >
              Presupuesto
            </IonButton>
          ) : (
            ""
          )}
        </div>
      </div>
      <h2>Ordenes activas en taller</h2>
      <div className="tecnico-taller-bottom-box">
        {ordenes.map(
          (orden: {
            id_tipo_estado: any;
            id: any;
            orden: { id_tipo_estado: any };
          }) => (
            <div key={orden.id} className="orden-item">
              <h4>
                {`Orden #${orden.id}`}{" "}
                <span>{estadoPresupuestoMap[orden.id_tipo_estado]}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => handleVerOrden(orden)}
                  style={{ cursor: "pointer" }}
                >
                  <path
                    d="M9 6.75C8.40326 6.75 7.83097 6.98705 7.40901 7.40901C6.98705 7.83097 6.75 8.40326 6.75 9C6.75 9.59674 6.98705 10.169 7.40901 10.591C7.83097 11.0129 8.40326 11.25 9 11.25C9.59674 11.25 10.169 11.0129 10.591 10.591C11.0129 10.169 11.25 9.59674 11.25 9C11.25 8.40326 11.0129 7.83097 10.591 7.40901C10.169 6.98705 9.59674 6.75 9 6.75ZM9 12.75C8.00544 12.75 7.05161 12.3549 6.34835 11.6517C5.64509 10.9484 5.25 9.99456 5.25 9C5.25 8.00544 5.64509 7.05161 6.34835 6.34835C7.05161 5.64509 8.00544 5.25 9 5.25C9.99456 5.25 10.9484 5.64509 11.6517 6.34835C12.3549 7.05161 12.75 8.00544 12.75 9C12.75 9.99456 12.3549 10.9484 11.6517 11.6517C10.9484 12.3549 9.99456 12.75 9 12.75ZM9 3.375C5.25 3.375 2.0475 5.7075 0.75 9C2.0475 12.2925 5.25 14.625 9 14.625C12.75 14.625 15.9525 12.2925 17.25 9C15.9525 5.7075 12.75 3.375 9 3.375Z"
                    fill="#283959"
                  />
                </svg>
              </h4>
            </div>
          )
        )}
      </div>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={`Orden #${ordenSeleccionada?.id}`}
        message={`¿Desea cambiar a la orden seleccionada?`}
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            cssClass: "secondary",
            handler: () => {
              console.log("Cancelar");
            },
          },
          {
            text: "Aceptar",
            handler: () => {
              setOrdenActiva(ordenSeleccionada);
              localStorage.setItem(
                "ordenActiva",
                JSON.stringify(ordenSeleccionada)
              );
              localStorage.removeItem("diagnosticoData");
              localStorage.removeItem("presupuestoData");
            },
          },
        ]}
      />
      <div className="tecnico-taller-bottom-button">
        <IonButton onClick={() => handleButtonClick("/rol")}>Inicio</IonButton>
      </div>
    </IonContent>
  );
}

export default TecnicoTallerComponent;
