import '../../styles/general.css';
import './Header.css';
import logOut from '../../images/log-out.webp';
import { useHistory } from 'react-router-dom';
import socket from '../services/socketService';
import { useEffect, useState } from 'react';
const HeaderHome: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]); // State for online users
  useEffect(() => {
    // Listen for user login event
    socket.on('userLoggedIn', (data) => {
      setOnlineUsers((prev) => [...prev, data.email]);
    });

    // Listen for user logout event if implemented
    socket.on('userLoggedOut', (data) => {
      setOnlineUsers((prev) => prev.filter(email => email !== data.email));
    });

    // Clean up the socket listeners on component unmount
    return () => {
      socket.off('userLoggedIn');
      socket.off('userLoggedOut');
    };
  }, []);

  const history = useHistory();
  const handleNavigate = (text: string) => {
    history.push(`${text}`);
    socket.emit("userStatus", { status: "desconectado", id: localStorage.getItem("empleadoId") });
  /*  socket.emit('userLoggedIn', { isLogged: "false"});*/
  };
  return (
    <header className='azulMorado headerHome'>
      <strong className='headerTitle'>LavaRiso</strong>
      <img onClick={() => handleNavigate('/login')} src={logOut} alt='cerrar sesión' />
    </header>
  );
};

export default HeaderHome;
