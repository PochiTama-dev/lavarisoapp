import '../../styles/general.css';
import './Header.css';
import logOut from '../../images/log-out.webp';
import { useHistory } from 'react-router-dom';

const HeaderHome: React.FC = () => {
  const history = useHistory();
  const handleNavigate = (text: string) => {
    history.push(`${text}`);
  };
  return (
    <header className='azulMorado headerHome'>
      <strong className='headerTitle'>LavaRiso</strong>
      <img onClick={() => handleNavigate('/login')} src={logOut} alt='cerrar sesión' />
    </header>
  );
};

export default HeaderHome;
