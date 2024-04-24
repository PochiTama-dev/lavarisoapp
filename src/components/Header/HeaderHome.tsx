import './ExploreContainer.css';
import logOut from '../../images/log-out.webp';

const ExploreContainer: React.FC = () => {
  return (
    <header id='container'>
      <strong>LavaRiso</strong>
      <img src={logOut} alt='cerrar sesión' />
    </header>
  );
};

export default ExploreContainer;
