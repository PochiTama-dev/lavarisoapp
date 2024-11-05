import React, { useEffect, useState } from "react";
import { IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonButtons, IonAlert } from "@ionic/react";
import { tecnicoStockReserva, eliminarStockReserva } from './FetchsRepuestos';
import { useOrden } from '../../Provider/Provider';
import HeaderGeneral from "../Header/HeaderGeneral";

interface ReservasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservasModal: React.FC<ReservasModalProps> = ({ isOpen, onClose }) => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertaEliminar, setAlertaEliminar] = useState<{ id: any, isOpen: boolean }>({ id: null, isOpen: false });
  const { repuestosTaller } = useOrden();

  useEffect(() => {
    const fetchReservasYStock = async () => {
      const id_tecnico = localStorage.getItem("empleadoId");
      if (id_tecnico) {
        try {
          setLoading(true);

          const reservasDelTecnico = await tecnicoStockReserva(id_tecnico);

          const reservasConDatos = reservasDelTecnico.map((reserva: any) => {
            const stockItem = repuestosTaller.find((item: any) => item.id_repuesto === reserva.id_repuesto);
            return {
              ...reserva,
              nombre: stockItem ? stockItem.nombre : "Desconocido",
              precio: stockItem ? stockItem.precio * reserva.cantidad : 0,
            };
          });

          setReservas(reservasConDatos);
        } catch (error) {
          console.error("Error al obtener las reservas o el stock principal:", error);
          setReservas([]);
        } finally {
          setLoading(false);
        }
      }
    };

    if (isOpen) {
      fetchReservasYStock();
    }
  }, [isOpen, repuestosTaller]);

  const handleEliminarReserva = async (id_reserva: any) => {
    const eliminado = await eliminarStockReserva(id_reserva);
    if (eliminado) {
      setReservas(prevReservas => prevReservas.filter(reserva => reserva.id !== id_reserva));
    } else {
      alert("Hubo un error al eliminar la reserva.");
    }
  };

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
  <HeaderGeneral/>
        </IonHeader>
        <IonContent>
          {loading ? (
            <IonItem>
              <IonLabel>Cargando reservas...</IonLabel>
            </IonItem>
          ) : (
            <IonList>
              {reservas.length > 0 ? (
                reservas.map((reserva, index) => (
                  <IonItem key={index}>
                    <IonLabel>
                      {reserva.nombre} - x{reserva.cantidad}
                    </IonLabel>
                    <IonLabel> 
                      Total: ${reserva.precio}
                    </IonLabel>
                    <IonButton
                      color="danger"
                      onClick={() => setAlertaEliminar({ id: reserva.id, isOpen: true })}
                    >
                      Cancelar 
                    </IonButton>
                  </IonItem>
                ))
              ) : (
                <IonItem>
                  <IonLabel>No hay reservas realizadas.</IonLabel>
                </IonItem>
              )}
            </IonList>
          )}
        </IonContent>
      </IonModal>

 
      <IonAlert
        isOpen={alertaEliminar.isOpen}
        onDidDismiss={() => setAlertaEliminar({ id: null, isOpen: false })}
        header={'Confirmar cancelación'}
        message={'¿Estás seguro de que deseas cancelar esta reserva?'}
        buttons={[
          {
            text: 'No',
            role: 'cancel',
            handler: () => setAlertaEliminar({ id: null, isOpen: false }),
          },
          {
            text: 'Sí',
            handler: () => {
              if (alertaEliminar.id) {
                handleEliminarReserva(alertaEliminar.id);
                setAlertaEliminar({ id: null, isOpen: false });
              }
            },
          },
        ]}
      />
    </>
  );
};

export default ReservasModal;
