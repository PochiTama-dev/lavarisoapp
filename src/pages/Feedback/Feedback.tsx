import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonAlert,
  IonLoading,
} from '@ionic/react';

interface Empleado {
  id: number;
  nombre: string;
}

interface LocationState {
  id_orden?: number;
}

const Feedback: React.FC = () => {
  const location = useLocation<LocationState>();
  const id_orden = location.state?.id_orden ?? null;
  const empleadoId = Number(localStorage.getItem('empleadoId')); // Obtener el id_empleado del localStorage
 
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedEmpleado, setSelectedEmpleado] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchEmpleados = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://lv-back.online/empleados');
        if (!response.ok) {
          throw new Error('Error al obtener la lista de empleados');
        }
        const data: Empleado[] = await response.json();
        setEmpleados(data);
      } catch (error) {
        setError((error as Error).message);
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpleados();
  }, []);

  const handleFeedbackSubmit = async () => {
    const feedbackData = {
      id_empleado: empleadoId, 
      to_id_employee: id_orden ? null : selectedEmpleado, // Si no hay id_orden, se usa selectedEmpleado
      id_orden: id_orden ?? null, // Enviar id_orden o null
      feedback: feedback.trim(),
    };

    console.log('Feedback data:', feedbackData); // Verifica los datos aquí

    try {
      setLoading(true);
      const response = await fetch('https://lv-back.online/feedbacks/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el feedback');
      }

      setSelectedEmpleado(null);
      setFeedback('');
      setError('¡Feedback enviado con éxito!');
      setShowAlert(true);
    } catch (error) {
      setError((error as Error).message);
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Feedback</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonLoading isOpen={loading} message="Cargando..." />

        {id_orden !== null && (
          <IonItem className="ion-margin-top">
            <IonLabel>N° Orden</IonLabel>
            <div>{id_orden}</div>
          </IonItem>
        )}
        {id_orden === null && (
          <IonItem className="ion-margin-bottom">
            <IonLabel>Empleado</IonLabel>
            <IonSelect
              placeholder="Selecciona un empleado"
              value={selectedEmpleado}
              onIonChange={(e) => setSelectedEmpleado(e.detail.value)}
            >
              {empleados.map((empleado) => (
                <IonSelectOption key={empleado.id} value={empleado.id}>
                  {empleado.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        )}

        <IonItem className="ion-margin-bottom">
          <IonLabel position="stacked">Feedback</IonLabel>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Escribe tu feedback aquí..."
            rows={5}
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '20px',
              marginBottom: '20px',
              borderRadius: '4px',
              fontSize: '16px',
              outline: 'none', // Evita el borde de enfoque predeterminado
              backgroundColor: 'transparent',
              resize: 'none', // Opcional: desactiva el redimensionamiento
            }}
          />
        </IonItem>

        <IonButton expand="full" onClick={handleFeedbackSubmit} className="ion-margin-top">
          Enviar Feedback
        </IonButton>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Información"
          message={error}
          buttons={['OK']}
        />
 
      </IonContent>
    </IonPage>
  );
};

export default Feedback;
