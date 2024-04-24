import '../../styles/general.css';
import './Header.css';
import logOut from '../../images/log-out.webp';

const ExploreContainer: React.FC = () => {
  return (
    <header className='azulMorado headerHome'>
      <strong>LavaRiso</strong>
      <img src={logOut} alt='cerrar sesión' />
    </header>
  );
};

export default ExploreContainer;
