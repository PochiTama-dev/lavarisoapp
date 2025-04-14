import { useHistory } from "react-router";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./TecnicoDomicilio.css";
import { IonAlert, IonButton, IonContent, IonHeader, IonIcon } from "@ionic/react";
import { useEffect, useState } from "react";
import socket from "../services/socketService";
import { eyeOutline } from "ionicons/icons";
import { useOrden } from "../../Provider/Provider";  // Importar el hook
import GlobalRefresher from "../Refresher/GlobalRefresher";
const estadoPresupuestoMap: { [key: number]: string } = {
  1: "Aprobada",
  2: "Cancelada",
  3: "Cerrada",
  4: "Pendiente",
};

function TecnicoDomicilioComponent() {
 
  const [showAlert, setShowAlert] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0); // added state for pagination
  const history = useHistory();
  const { ordenes, cargarOrdenes, ordenActiva, setOrdenActiva } = useOrden();

  // Agregar helper para determinar el color del estado
  const getEstadoColor = (estado: string) => {
    if (estado === "Cancelada") return "red";
    if (estado === "Pendiente") return "grey";
    if (estado === "Cerrada") return "orange";
    if (estado === "Aprobada") return "green";
    return "black";
  };

  useEffect(() => {
    cargarOrdenes(); 
    setCurrentPage(0); 
  }, []);
  

  const handleButtonClick = (path: any, orden = null) => {
    history.push({ pathname: path });
  };

  const handleVerOrden = (orden: any) => {
    setOrdenSeleccionada(orden);
    setShowAlert(true);
  };

  const toggleOrdenActiva = (orden: any) => {
    setOrdenActiva(orden);
    localStorage.setItem("ordenActiva", JSON.stringify(orden));
    localStorage.removeItem("diagnosticoData");
    localStorage.removeItem("presupuestoData");
    localStorage.removeItem("equipo");
    localStorage.removeItem("estadoOrden");

    localStorage.removeItem("marca");
    localStorage.removeItem("modelo");

    localStorage.removeItem("observaciones");
    localStorage.removeItem("checkboxValues");
    socket.emit("userStatus", {
      status: orden ? "ocupado" : "conectado",
      id: localStorage.getItem("empleadoId"),
    });
  };
 
  return (
    <>
    <GlobalRefresher> 
      <IonContent className='tecnico-domicilio-container'>
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>
   {/*      <div className='tecnico-alerta-button'>
          <IonButton onClick={() => handleButtonClick("/alertas")}>Enviar Alerta</IonButton>
        </div> */}
        <div className='tecnico-domicilio-top-box' style={{marginTop: "30px"}}>
          {ordenActiva && (
            <div className="orden-activa-domicilio"> 
              <h3><strong>Orden Activa</strong> #{ordenActiva.id}</h3>
              <h3>{ordenActiva.Cliente.nombre} {ordenActiva.Cliente.apellido}</h3>
              <h3>{ordenActiva.Cliente.direccion}</h3>
              <div>
                <IonButton onClick={() => handleButtonClick("/verorden", ordenActiva)}>Ver orden</IonButton>
                <IonButton disabled onClick={() => handleButtonClick("/chat", ordenActiva.cliente)}>Chat</IonButton>
                <IonButton onClick={() => toggleOrdenActiva(null)}>Quitar</IonButton>
                <IonButton onClick={() => handleButtonClick("/feedback", ordenActiva)}>Feedback</IonButton>
              </div>
            </div>
          )}
        </div>
        <h2>Estado de las ordenes</h2>
        <div className='tecnico-domicilio-bottom-box'>
          {ordenes.length > 0 ? (
            ordenes.slice(currentPage * 8, currentPage * 8 + 8).map((orden: any) => (
              <div className="domicilio-lista-ordenes" key={orden.id}>
                <div className="orden-grid">
                  <h4>Orden #{orden.id}</h4>
                  <h4>
                    {orden.Presupuesto &&
                      <span style={{ color: getEstadoColor(estadoPresupuestoMap[orden.id_tipo_estado]) }}>
                        {estadoPresupuestoMap[orden.id_tipo_estado]}
                      </span>
                    }
                  </h4>
                  <IonIcon
                    key={`icon-${orden.id}`}  
                    icon={eyeOutline}
                    onClick={() => handleVerOrden(orden)}
                    style={{ cursor: "pointer", fontSize: "24px", strokeWidth: "2" }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No hay ordenes</p>
          )}
        <div className='pagination-controls' style={{ display: 'flex', justifyContent: 'space-between', margin: '10px' }}>
          <IonButton
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={currentPage === 0 || ordenes.length === 0} // evitar página negativa o sin órdenes
          >
            {"<"}
          </IonButton>
          <IonButton
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={ordenes.length === 0 || currentPage >= Math.ceil(ordenes.length / 8) - 1} // evitar página sin órdenes
          >
            {">"}
          </IonButton>
        </div>
        </div>
        {/* <div className='tecnico-domicilio-bottom-button'>
          <IonButton onClick={() => handleButtonClick("/repuestos")}>Repuestos</IonButton>
          <IonButton onClick={() => handleButtonClick("/rol")}>Inicio</IonButton>
        </div> */}
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={`Orden #${ordenSeleccionada?.id}`}
        message={`Cliente: ${ordenSeleccionada?.Cliente.nombre}\nDirección: ${ordenSeleccionada?.Cliente.direccion}`}
        buttons={[
          { text: "Cancelar", role: "cancel", cssClass: "secondary" },
          { text: "Aceptar", handler: () => toggleOrdenActiva(ordenSeleccionada) },
        ]}
      />
      </GlobalRefresher>
    </>
  );
}

export default TecnicoDomicilioComponent;
