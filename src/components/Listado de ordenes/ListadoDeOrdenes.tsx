import './ListadoDeOrdenes.css';
import eye from '../../images/eye.webp';
interface Ordenes {
  orden: string;
  vista: string;
}

const ExploreContainer: React.FC = () => {
  const ordenes: Ordenes[] = [
    {
      orden: '#25000',
      vista: 'Vista pendiente',
    },
    {
      orden: '#25100',
      vista: 'En taller',
    },
    {
      orden: '#25423',
      vista: 'Para retirar',
    },
    {
      orden: '#24554',
      vista: 'Concretado',
    },
    {
      orden: '#24560',
      vista: 'Concretado',
    },
    {
      orden: '#25452',
      vista: 'Concretado',
    },
  ];
  return (
    <div id='container'>
      <strong>Estado de las ordenes</strong>
      <div className='estadoOrden'>
        <ul className='itemsOrdenes'>
          {ordenes.map((orden, index) => (
            <li key={index}>
              <div className='ordenes'>
                <li>{orden.orden}</li>
                <li>
                  {orden.vista}
                  <img src={eye} alt='vista' />
                </li>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExploreContainer;
