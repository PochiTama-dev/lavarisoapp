import '../../styles/general.css';
import './Header.css';
import logOut from '../../images/log-out.webp';
import { useHistory } from 'react-router-dom';
import socket from '../services/socketService';
import { useEffect, useRef } from 'react';

const HeaderHome: React.FC = () => {
  const history = useHistory();
  const locationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Limpiar los listeners de socket al desmontar el componente
    return () => {
      socket.off('userLoggedIn');
      socket.off('userLoggedOut');
      socket.off('userStatus');
    };
  }, []);

  const stopGeolocation = () => {
    // Clear the interval that sends location updates
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }
  };

  const handleLogout = () => {
    // Stop sending location data
    stopGeolocation();

    // Emit user status as disconnected
    const empleadoId = localStorage.getItem("empleadoId");
    if (empleadoId) {
      socket.emit("userStatus", { status: "desconectado", id: empleadoId });
    }

    // Clear localStorage
    localStorage.removeItem('empleadoNombre');
    localStorage.removeItem('empleadoLegajo');
    localStorage.removeItem('empleadoId');
    localStorage.removeItem('ordenSeleccionada');
    localStorage.removeItem('empleadoEmail');

    // Redirect to login page
    history.push('/login');
    window.location.reload();
  };

  return (
    <header className='azulMorado headerHome'>
      <strong className='headerTitle'>LavaRiso</strong>
      <img onClick={handleLogout} src={logOut} alt='cerrar sesión' />
    </header>
  );
};

export default HeaderHome;
