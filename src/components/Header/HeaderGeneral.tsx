import '../../styles/general.css';
import arrowBack from '../../images/arrow-back.webp';
import home from '../../images/home.webp';
import { IonHeader } from '@ionic/react';
import { useHistory } from 'react-router';

const HeaderGeneral: React.FC = () => {
  const history = useHistory();
  const handleNavigate = (text: string) => {
    history.push(`/${text}`);
  };
  return (
    <IonHeader className='azulMorado headerHome'>
      <img onClick={() => window.history.back()} src={arrowBack} alt='cerrar sesión' />
      <strong className='headerTitle'>LavaRiso</strong>
      <img onClick={() => handleNavigate('rol')} className='iconHome' src={home} alt='home' />
      <div className='headerSesion'>
        <h3>Sesión de Alan Almendra</h3>
        <span>leg.987654 - Camioneta #1</span>
      </div>
    </IonHeader>
  );
};

export default HeaderGeneral;
