import { useHistory } from "react-router";
import HeaderGeneral from "../Header/HeaderGeneral";
import "./TecnicoDomicilio.css";
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
} from "@ionic/react";
import { useEffect, useState } from "react";

function TecnicoDomicilioComponent() {
  const [ordenesList, setOrdenesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | any>(null);
  const [ordenActiva, setOrdenActiva] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<any>(null);

  const estadoPresupuestoMap: { [key: number]: string } = {
    1: "Pendiente",
    2: "Aprobado",
    3: "Rechazado",
    4: "Para retirar"
  };

  const ordenes = async () => {
    try {
      const ordenesResponse = await fetch("https://lv-back.online/ordenes");
      const clientesResponse = await fetch("https://lv-back.online/clientes/lista");

      if (!ordenesResponse.ok || !clientesResponse.ok) {
        throw new Error('Error al obtener datos de las APIs');
      }

      const ordenes = await ordenesResponse.json();
      const clientes = await clientesResponse.json();

      if (ordenes.length > 0 && clientes.length > 0) {
        const clientesMap = new Map(clientes.map((cliente: { id: any; }) => [cliente.id, cliente]));
        const ordenesConClientes = ordenes.map((orden: { cliente_id: any; }) => ({
          ...orden,
          cliente: clientesMap.get(orden.cliente_id)
        }));

        console.log(ordenesConClientes);
        return ordenesConClientes;
      } else {
        console.log("No se encontraron ordenes o clientes en la base de datos.");
        return [];
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOrdenes = await ordenes();

        if (fetchedOrdenes) {
          setOrdenesList(fetchedOrdenes);
        }

        // Recuperar la orden activa desde localStorage
        const savedOrden = localStorage.getItem("ordenActiva");
        if (savedOrden) {
          setOrdenActiva(JSON.parse(savedOrden));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const history = useHistory();

  const handleButtonClick = (path: any, orden = null) => {
    if (orden) {
      history.push({
        pathname: path,
        state: { orden }, // Pasamos el cliente como estado de la ruta si está definido
      });
    } else {
      history.push(path); // Si no se pasa un cliente, navegamos a la ruta sin estado
    }
  };

  const handleVerOrden = (orden: any) => {
    setOrdenSeleccionada(orden);
    setShowAlert(true); // Mostrar el alert al hacer clic en el ojito
  };

  return (
    <>
      <IonContent className="tecnico-domicilio-container">
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>
        <div className="tecnico-alerta-button">
          <IonButton onClick={() => handleButtonClick("/alertas")}>
            Enviar Alerta
          </IonButton>
        </div>
        <div className="tecnico-domicilio-top-box">
          {ordenActiva && (
            <div>
              <h3><strong>Orden Activa</strong> #{ordenActiva.numero_orden}</h3>
              <h3>{ordenActiva.Cliente.nombre}</h3>
              <h3>
                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 9.5C6.33696 9.5 5.70107 9.23661 5.23223 8.76777C4.76339 8.29893 4.5 7.66304 4.5 7C4.5 6.33696 4.76339 5.70107 5.23223 5.23223C5.70107 4.76339 6.33696 4.5 7 4.5C7.66304 4.5 8.29893 4.76339 8.76777 5.23223C9.23661 5.70107 9.5 6.33696 9.5 7C9.5 7.3283 9.43534 7.65339 9.3097 7.95671C9.18406 8.26002 8.99991 8.53562 8.76777 8.76777C8.53562 8.99991 8.26002 9.18406 7.95671 9.3097C7.65339 9.43534 7.3283 9.5 7 9.5ZM7 0C5.14348 0 3.36301 0.737498 2.05025 2.05025C0.737498 3.36301 0 5.14348 0 7C0 12.25 7 20 7 20C7 20 14 12.25 14 7C14 5.14348 13.2625 3.36301 11.9497 2.05025C10.637 0.737498 8.85652 0 7 0Z" fill="#69688C"/>
                </svg>
                {ordenActiva.Cliente.direccion}
              </h3>
              <div>
                <IonButton style={{ borderRadius: "0" }} onClick={() => handleButtonClick('/verorden', ordenActiva)}>Ver orden</IonButton>
                <IonButton onClick={() => handleButtonClick('/chat', ordenActiva.cliente)}>Chat</IonButton>
              </div>
            </div>
          )}
        </div>
        <h2>Estado de las ordenes</h2>
        <div className="tecnico-domicilio-bottom-box">
          {ordenesList.map((orden: any, index: number) => (
            orden.Presupuesto ? (
              <h4 key={index}>
                Orden #{orden.numero_orden} <span>{estadoPresupuestoMap[orden.Presupuesto.id_estado_presupuesto]}</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => handleVerOrden(orden)}
                  style={{ cursor: 'pointer' }}
                >
                  <path
                    d="M9 6.75C8.40326 6.75 7.83097 6.98705 7.40901 7.40901C6.98705 7.83097 6.75 8.40326 6.75 9C6.75 9.59674 6.98705 10.169 7.40901 10.591C7.83097 11.0129 8.40326 11.25 9 11.25C9.59674 11.25 10.169 11.0129 10.591 10.591C11.0129 10.169 11.25 9.59674 11.25 9C11.25 8.40326 11.0129 7.83097 10.591 7.40901C10.169 6.98705 9.59674 6.75 9 6.75ZM9 12.75C8.00544 12.75 7.05161 12.3549 6.34835 11.6517C5.64509 10.9484 5.25 9.99456 5.25 9C5.25 8.00544 5.64509 7.05161 6.34835 6.34835C7.05161 5.64509 8.00544 5.25 9 5.25C9.99456 5.25 10.9484 5.64509 11.6517 6.34835C12.3549 7.05161 12.75 8.00544 12.75 9C12.75 9.99456 12.3549 10.9484 11.6517 11.6517C10.9484 12.3549 9.99456 12.75 9 12.75ZM9 3.375C5.25 3.375 2.0475 5.7075 0.75 9C2.0475 12.2925 5.25 14.625 9 14.625C12.75 14.625 15.9525 12.2925 17.25 9C15.9525 5.7075 12.75 3.375 9 3.375Z"
                    fill="#283959"
                  />
                </svg>
              </h4>
            ) : null
          ))}
        </div>
        <div className="tecnico-domicilio-bottom-button">
          <IonButton onClick={() => handleButtonClick("/repuestos")}>
            Repuestos
          </IonButton>
        </div>
        <div className="tecnico-domicilio-bottom-button">
          <IonButton onClick={() => handleButtonClick("/rol")}>Inicio</IonButton>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={`Orden #${ordenSeleccionada?.numero_orden}`}
        message={`Cliente: ${ordenSeleccionada?.Cliente.nombre}\nDirección: ${ordenSeleccionada?.Cliente.direccion}`}
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
              localStorage.setItem("ordenActiva", JSON.stringify(ordenSeleccionada)); 

              // Borrar "diagnosticoData" y "presupuestoData" del localStorage
              localStorage.removeItem("diagnosticoData");
              localStorage.removeItem("presupuestoData");

              console.log("Aceptar");
            },
          },
        ]}
      />
    </>
  );
}

export default TecnicoDomicilioComponent;
