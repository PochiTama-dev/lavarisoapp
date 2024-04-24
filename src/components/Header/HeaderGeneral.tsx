import '../..styles/general.css';
import arrowBack from '../../images/arrow-back.webp';
import home from '../../images/home.webp';

const ExploreContainer: React.FC = () => {
  return (
    <header className='azulMorado'>
      <img src={arrowBack} alt='cerrar sesión' />
      <strong>LavaRiso</strong>
      <img src={home} alt='home' />
    </header>
  );
};

export default ExploreContainer;
