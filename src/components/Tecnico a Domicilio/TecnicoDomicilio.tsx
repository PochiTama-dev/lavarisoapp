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
  const history = useHistory();
  const { ordenes, cargarOrdenes, ordenActiva, setOrdenActiva } = useOrden();

  useEffect(() => {
    cargarOrdenes(); 
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
        <div className='tecnico-alerta-button'>
          <IonButton onClick={() => handleButtonClick("/alertas")}>Enviar Alerta</IonButton>
        </div>
        <div className='tecnico-domicilio-top-box'>
          {ordenActiva && (
            <div className="orden-activa-domicilio"> 
              <h3><strong>Orden Activa</strong> #{ordenActiva.id}</h3>
              <h3>{ordenActiva.Cliente.nombre} {ordenActiva.Cliente.apellido}</h3>
              <h3>{ordenActiva.Cliente.direccion}</h3>
              <div>
                <IonButton onClick={() => handleButtonClick("/verorden", ordenActiva)}>Ver orden</IonButton>
                <IonButton onClick={() => handleButtonClick("/chat", ordenActiva.cliente)}>Chat</IonButton>
                <IonButton onClick={() => toggleOrdenActiva(null)}>Quitar</IonButton>
                <IonButton onClick={() => handleButtonClick("/feedback", ordenActiva)}>Feedback</IonButton>
              </div>
            </div>
          )}
        </div>
        <h2>Estado de las ordenes</h2>
        <div className='tecnico-domicilio-bottom-box'>
          {ordenes.map((orden: any) => (
       <div className="domicilio-lista-ordenes">
       <div className="orden-grid">
         <h4  >Orden #{orden.id}</h4>
         <h4 key={orden.id}>
           {orden.Presupuesto && <span>{estadoPresupuestoMap[orden.id_tipo_estado]}</span>}
         </h4>
         <IonIcon
        key={`icon-${orden.id}`} // Unique key for the icon
           icon={eyeOutline}
           onClick={() => handleVerOrden(orden)}
           style={{ cursor: "pointer", fontSize: "24px", strokeWidth: "2" }}
         />
       </div>
     </div>
     
          ))}
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
