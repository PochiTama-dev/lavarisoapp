/* import LegajoCamioneta from './Legajo-Camioneta/Legajo-Camioneta';
import ListadoDeOrdenes from './Listado de ordenes/ListadoDeOrdenes'; */
interface ContainerProps {
  name: string;
}
/* interface LegajoCamionetaData {
  name: string;
  legajo: number;
  camioneta: string;
} */
const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  /* const legajoCamioneta: LegajoCamionetaData = {
    name: 'Alan Almendra',
    legajo: 987654,
    camioneta: 'Camioneta #1',
  }; */

  return (
    <div id='container'>
      {/* <LegajoCamioneta name={legajoCamioneta.name} legajo={legajoCamioneta.legajo} camioneta={legajoCamioneta.camioneta} /> */}
      <strong>{name}</strong>
      <p>
        Explore{' '}
        <a target='_blank' rel='noopener noreferrer' href='https://ionicframework.com/docs/components'>
          UI Components
        </a>
      </p>
    </div>
  );
};

export default ExploreContainer;
