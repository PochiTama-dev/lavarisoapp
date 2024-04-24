import '../../styles/general.css';
import arrowBack from '../../images/arrow-back.webp';
import home from '../../images/home.webp';

const ExploreContainer: React.FC = () => {
  return (
    <header className='azulMorado headerHome'>
      <img src={arrowBack} alt='cerrar sesión' />
      <strong>LavaRiso</strong>
      <img className='iconHome' src={home} alt='home' />
    </header>
  );
};

export default ExploreContainer;
