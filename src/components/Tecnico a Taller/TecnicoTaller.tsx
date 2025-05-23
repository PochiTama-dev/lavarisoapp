import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./TecnicoTaller.css";
import { IonAlert, IonButton, IonContent, IonHeader, IonIcon } from "@ionic/react";
import { useOrden } from "../../Provider/Provider";
import { eyeOutline } from "ionicons/icons";
function TecnicoTallerComponent() {
  const history = useHistory();
  const [ordenes, setOrdenes] = useState<any>([]);
  const [ordenActiva, setOrdenActiva] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const { ordenSeleccionada, setOrdenSeleccionada } = useOrden();
 
 
  const handleButtonClick = ( ) => {
    history.push({
      pathname: '/repuestosTaller',
      state: { ordenSeleccionada: { id: ordenSeleccionada.id } }
    });
 
  }
  
  const handleButtonClick2 = (path: any, orden = null) => {
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
  const handleInicioClick = () => {
    history.push("/rol");
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
            .map(
              (orden: {
                cliente_id: any;
                Empleado: { id: any };
                updated_at: string;
              }) => ({
                ...orden,
                cliente: clientesMap.get(orden.cliente_id),
              })
            )
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

          const today = new Date().toISOString().split("T")[0];

          const ordenesOrdenadas = ordenesConClientes.sort(
            (a: { updated_at: string }, b: { updated_at: string }) => {
              const updatedAtA = new Date(a.updated_at)
                .toISOString()
                .split("T")[0];
              const updatedAtB = new Date(b.updated_at)
                .toISOString()
                .split("T")[0];

              if (updatedAtA === today && updatedAtB !== today) {
                return -1;
              } else if (updatedAtA !== today && updatedAtB === today) {
                return 1;
              } else {
                return 0;
              }
            }
          );

          setOrdenes(ordenesOrdenadas);
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
          <IonButton onClick={() => handleButtonClick()}>
            Repuestos
          </IonButton>
          {ordenActiva ? (
            <IonButton
              onClick={() => handleButtonClick2("/presupuesto", ordenActiva)}
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
        {(() => {
          const today = new Date().toISOString().split("T")[0];

          const ordenesHoy = ordenes.filter((orden: { updated_at: string }) => {
            const updatedAt = new Date(orden.updated_at)
              .toISOString()
              .split("T")[0];
            return updatedAt === today;
          });

          const ordenesDiasAnteriores = ordenes.filter(
            (orden: { updated_at: string }) => {
              const updatedAt = new Date(orden.updated_at)
                .toISOString()
                .split("T")[0];
              return updatedAt !== today;
            }
          );

          return (
            <>
              {ordenesHoy.length > 0 && (
                <>
                  <h3 style={{ marginLeft: "5px" }}>Hoy</h3>
                  {ordenesHoy.map(
                    (orden: {
                      id_tipo_estado: any;
                      id: any;
                      updated_at: string;
                    }) => (
                      <div key={orden.id} className="orden-item">
                        <h4>
                          {`Orden #${orden.id}`}{" "}
                          <span>
                            {estadoPresupuestoMap[orden.id_tipo_estado]}
                          </span>
                          <IonIcon icon={eyeOutline} onClick={() => handleVerOrden(orden)} style={{ cursor: "pointer", fontSize: "24px", strokeWidth: "2" }} />

                        </h4>
                      </div>
                    )
                  )}
                </>
              )}

              {ordenesDiasAnteriores.length > 0 && (
                <>
                  <h3 style={{ marginLeft: "5px" }}>Días anteriores</h3>
                  {ordenesDiasAnteriores.map(
                    (orden: {
                      id_tipo_estado: any;
                      id: any;
                      updated_at: string;
                    }) => (
                      <div key={orden.id} className="orden-item">
                        <h4>
                          {`Orden #${orden.id}`}{" "}
                          <span>
                            {estadoPresupuestoMap[orden.id_tipo_estado]}
                          </span>
                          <IonIcon icon={eyeOutline} onClick={() => handleVerOrden(orden)} style={{ cursor: "pointer", fontSize: "24px", strokeWidth: "2" }} />

                        </h4>
                      </div>
                    )
                  )}
                </>
              )}
            </>
          );
        })()}
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
        <IonButton onClick={() => handleInicioClick()}>Inicio</IonButton>
      </div>
    </IonContent>
  );
}

export default TecnicoTallerComponent;
