import { IonAlert, IonButton, IonContent, IonInput, IonPage } from '@ionic/react';
import './Login.css';
import { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import socket from '../services/socketService'; // Import the socket service
import { Geolocation } from '@capacitor/geolocation'; // Import Geolocation from Capacitor
import { registerPlugin } from '@capacitor/core';

const LoginComponent: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const history = useHistory();
  const emailRef = useRef<HTMLIonInputElement>(null);
  const cuilRef = useRef<HTMLIonInputElement>(null);
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
        locationIntervalRef.current = null;
      }
    };
  }, []);

  /* const startGeolocation = async () => {
    const logPosition = async () => {
      if (localStorage.getItem("userStatus") !== 'desconectado') {
        try {
          const position = await Geolocation.getCurrentPosition();
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          console.log("Enviando ubicación:", coords);  

          socket.emit('locationUpdate', {
            id: localStorage.getItem('empleadoId'),
            nombre: localStorage.getItem('empleadoNombre'),
            ...coords
          });
        } catch (error) {
          console.error("Error al obtener ubicación:", error);
        }
      }
    };
 
    await logPosition();
 
    locationIntervalRef.current = setInterval(logPosition, 2000);
  }; */

  interface BackgroundGeolocationPlugin {
    addWatcher(options: any, callback: (location: any, error: any) => void): Promise<string>;
    removeWatcher(options: { id: string }): Promise<void>;
    openSettings(): Promise<void>;
  }
  const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');
  const locationWatcherRef = useRef<string | undefined>();
  const startGeolocation = async () => {
    try {
      locationWatcherRef.current = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: 'Cancel to prevent battery drain.',
          backgroundTitle: 'Tracking You.',
          requestPermissions: true,
          stale: false,
          distanceFilter: 10, // Puedes ajustar este valor según tus necesidades
        },
        (position, error) => {
          if (error) {
            if (error.code === 'NOT_AUTHORIZED') {
              if (window.confirm('This app needs your location, but does not have permission.\n\n' + 'Open settings now?')) {
                BackgroundGeolocation.openSettings();
              }
            }
            return console.error('Error al obtener ubicación:', error);
          }
          const coords = {
            latitude: position.latitude,
            longitude: position.longitude,
          };

          console.log('Enviando ubicación:', coords);

          socket.emit('locationUpdate', {
            id: localStorage.getItem('empleadoId'),
            nombre: localStorage.getItem('empleadoNombre'),
            ...coords,
          });
        }
      );
    } catch (error) {
      console.error('Error al iniciar geolocalización:', error);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const email = emailRef.current?.value as string;
    const cuil = cuilRef.current?.value as string;
    if (!email || !email.includes('@') || !email.includes('.com')) {
      setAlertMessage('Por favor, ingrese un correo electrónico válido.');
      setShowAlert(true);
      return;
    }
    try {
      const response = await fetch('https://lv-back.online/empleados');
      const empleados = await response.json();
      const empleado = empleados.find((empleado: any) => empleado.email === email && empleado.cuil === cuil);

      if (!empleado) {
        setAlertMessage('El correo electrónico o el cuil no coinciden en la base de datos.');
        setShowAlert(true);
        return;
      }

      if (empleado.id_rol !== 5 && empleado.id_rol !== 4) {
        setAlertMessage('Acceso denegado. Solo los técnicos pueden acceder a esta pantalla.');
        setShowAlert(true);
        return;
      }

      // Guardo el email, el nombre y el id del empleado en localStorage para usarlo en LoginRol
      localStorage.setItem('empleadoEmail', email);
      localStorage.setItem('empleadoNombre', empleado.nombre);
      localStorage.setItem('empleadoId', empleado.id);
      localStorage.setItem('empleadoLegajo', empleado.legajo);

      // Emitir el estado del usuario como conectado
      socket.emit('userStatus', { status: 'conectado', id: empleado.id, nombre: empleado.nombre });
      localStorage.setItem('userStatus', 'conectado');

      // Iniciar el seguimiento de la geolocalización
      startGeolocation();

      history.push('/rol');
    } catch (error) {
      setAlertMessage('Ocurrió un error al verificar el correo electrónico.');
      setShowAlert(true);
    }
  };

  return (
    <IonPage className='login'>
      <IonContent>
        <IonAlert isOpen={showAlert} onDidDismiss={() => setShowAlert(false)} message={alertMessage} buttons={['Cerrar']} />
        <div className='login-content'>
          <h1>LavaRiso</h1>
          <h2>Credenciales requeridas</h2>
          <form onSubmit={handleSubmit}>
            <IonInput ref={emailRef} className='inputs' type='text' placeholder='E-mail' />
            <IonInput ref={cuilRef} className='inputs' type='number' placeholder='Número de cuil' />
            <IonButton className='login-button' type='submit'>
              Iniciar sesión
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginComponent;
