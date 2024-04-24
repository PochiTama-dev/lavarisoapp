import './Legajo-Camioneta.css';

interface ContainerProps {
  name: string;
  legajo: number;
  camioneta: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name, legajo, camioneta }) => {
  return (
    <div className='celesteMorado'>
      <span>Sesion de {name}</span>
      <span>
        leg.{legajo} - {camioneta && camioneta}
      </span>
    </div>
  );
};

export default ExploreContainer;
