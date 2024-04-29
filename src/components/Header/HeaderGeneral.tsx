import '../../styles/general.css';
import arrowBack from '../../images/arrow-back.webp';
import home from '../../images/home.webp';
import { IonContent, IonPage, IonHeader } from '@ionic/react';
const HeaderGeneral: React.FC = () => {
  return (
 
    <IonHeader className='azulMorado headerHome'>
      <img src={arrowBack} alt='cerrar sesión' />
      <strong>LavaRiso</strong>
      <img className='iconHome' src={home} alt='home' />
    </IonHeader>
 
  );
};

export default HeaderGeneral;
