import '../../styles/general.css';
import arrowBack from '../../images/arrow-back.webp';
import home from '../../images/home.webp';
import { IonHeader } from '@ionic/react';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';

const HeaderGeneral: React.FC = () => {
  const history = useHistory();
  const [empleadoNombre, setEmpleadoNombre] = useState('');
  const [empleadoLegajo, setEmpleadoLegajo] = useState('');
  useEffect(() => {
    const nombre = localStorage.getItem('empleadoNombre');
    const legajo = localStorage.getItem('empleadoLegajo');
    if (nombre && legajo) {
      setEmpleadoNombre(nombre)
      setEmpleadoLegajo(legajo)
    }
  }, []);

  const handleNavigate = (text: string) => {
    history.push(`/${text}`);
  };

  return (
    <IonHeader className='azulMorado headerHome'>
      <img onClick={() => window.history.back()} src={arrowBack} alt='cerrar sesión' />
      <strong className='headerTitle'>LavaRiso</strong>
      <img onClick={() => handleNavigate('rol')} className='iconHome' src={home} alt='home' />
      <div className='headerSesion'>
        <h3>Sesión de {empleadoNombre}</h3>
        {/* <span>leg.{empleadoLegajo} - Camioneta #1</span> */}
      </div>
    </IonHeader>
  );
};

export default HeaderGeneral;
