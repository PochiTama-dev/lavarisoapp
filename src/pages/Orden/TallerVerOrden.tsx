import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCheckbox,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonHeader,
} from '@ionic/react';
import '../Diagnostico/diagnostico.css';
import '../Entrega/entrega.css';
import HeaderGeneral from '../../components/Header/HeaderGeneral';
import './orden.css';
import { useLocation } from "react-router-dom";

interface Repuesto {
  id: any;
  descripcion: string;
  nombre: string;
  cantidad: number;
}

const TallerVerOrden: React.FC = () => {
  interface LocationState {
    ordenSeleccionada: any; 
  }
  const [cierresExtendidosMap, setCierresExtendidosMap] = useState<{ [key: string]: number }>({});
  const [producto, setProducto] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cliente, setCliente] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
  const [limpiezaSalida, setLimpiezaSalida] = useState<string[]>([]);
  const [estadosPresupuestos, setEstadosPresupuestos] = useState<{ id: any; texto: any }[]>([]);
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>([]);
  const location = useLocation<LocationState>();
  const ordenSeleccionada = location.state?.ordenSeleccionada;
  const [checkboxValuesFunciones, setCheckboxValuesFunciones] = useState<boolean[]>([]);
const [checkboxValuesLimpieza, setCheckboxValuesLimpieza] = useState<boolean[]>([]);
const [checkboxValuesCierresExtendidos, setCheckboxValuesCierresExtendidos] = useState<boolean[]>([]);
const [cierresExtendidos, setCierresExtendidos] = useState<{ id: number, tipo_cierre_extendido: string }[]>([]);
const [estadoSeleccionado, setEstadoSeleccionado] = useState<any>(null); // Estado seleccionado en IonSelect


  interface LocationState {
    selectedRepuestos: Repuesto[];
    ordenActiva: any
  }
  const { selectedRepuestos } = location.state;


  const fetchEstadosPresupuestos = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/presupuesto");
      const data = await response.json();
      if (data.length > 0) {
        const estados = data.map((item: { id: any; estado_presupuesto: any }) => ({
          id: item.id,
          texto: item.estado_presupuesto,
        }));
        setEstadosPresupuestos(estados);
      } else {
        console.log('Aún no se registra ningún estado de presupuesto...');
      }
    } catch (error) {
      console.error("Error, no se encontraron estados de los presupuestos en la base de datos....", error);
    }
  };

  
  const fetchTiposFunciones = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/funcion");
      const funciones = await response.json();
      if (funciones && funciones.length > 0) {
        console.log(`Se encontró un listado con ${funciones.length} tipos de funciones!!`);
        setTextosCheckbox(funciones.map((funcion: { tipo_funcion: string }) => funcion.tipo_funcion));
        setCheckboxValues(new Array(funciones.length).fill(false));
      } else {
        console.log('Aún no se registra ningún tipo de funcion...');
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de funciones en la base de datos....", error);
    }
  };

  const tiposLimpieza = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/limpieza");
      const limpieza = await response.json();
      if (limpieza && limpieza.length > 0) {
        console.log(`Se encontró un listado con ${limpieza.length} tipos de limpieza!!`);
        setLimpiezaSalida(limpieza.map((item: { tipo_limpieza: string }) => item.tipo_limpieza));
   
        setCheckboxValues(prev => [...prev, ...new Array(limpieza.length).fill(false)]);
      } else {
        console.log('Aún no se registra ningún tipo de limpieza...');
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de limpieza en la base de datos....", error);
    }
  };
  const tiposCierresExtendidos = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/cierre");
      const cierres = await response.json();
      if (cierres && cierres.length > 0) {
        setCierresExtendidos(cierres);
        const checkboxValues = cierres.map((cierre: { id: number, tipo_cierre_extendido: string }) =>
          cierre.id === ordenSeleccionada.id_tipo_cierre_extendido
        );
        setCheckboxValuesCierresExtendidos(checkboxValues);
      } else {
        console.log('Aún no se registra ningún tipo de cierre extendido...');
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de cierres extendidos en la base de datos....", error);
    }
  };

  useEffect(() => {
    fetchTiposFunciones();
    tiposLimpieza();
    tiposCierresExtendidos();
    fetchEstadosPresupuestos();
  }, []);

  const handleConfirmarClick = () => {
    const dataToSend = {
      producto,
      marca,
      modelo,
      cliente,
      checkboxValuesFunciones,
      checkboxValuesLimpieza,
      checkboxValuesCierresExtendidos,
      observaciones,
    };
    console.log(dataToSend);
  };
console.log(ordenSeleccionada)
useEffect(() => {
  if (textosCheckbox.length > 0) {
    setCheckboxValuesFunciones(
      textosCheckbox.map((texto, index) => ordenSeleccionada.diagnostico.includes(texto))
    );
  }
  if (limpiezaSalida.length > 0) {
    setCheckboxValuesLimpieza(new Array(limpiezaSalida.length).fill(false));
  }
  if (cierresExtendidos.length > 0) {
    const checkboxValues = cierresExtendidos.map((cierre) =>
      cierre.id === ordenSeleccionada.id_tipo_cierre_extendido
    );
    setCheckboxValuesCierresExtendidos(checkboxValues);
  }
  
}, [ordenSeleccionada, textosCheckbox, limpiezaSalida, cierresExtendidos]);
useEffect(() => {
  if (ordenSeleccionada) {
    setEstadoSeleccionado(ordenSeleccionada.id_tipo_estado);
  }
}, [ordenSeleccionada]);
const handleEstadoChange = (event: CustomEvent) => {
  setEstadoSeleccionado(event.detail.value);
};
  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>
        <div className='diagnostico-ctn'>
          <div className="section">
            <h1 style={{ fontSize: '28px', marginBottom: '-20px' }}><strong>En taller</strong> </h1>
            <h2>Orden: {ordenSeleccionada?.id}</h2>
            <h3>
              <strong>Datos del cliente</strong>
            </h3>
            <div className='orden-datosCliente'>
              <h4>
                <strong>Nombre:</strong> {ordenSeleccionada?.Cliente?.nombre}
              </h4>
              <h4>
                <strong>Teléfono:</strong> {ordenSeleccionada?.Cliente?.telefono}
              </h4>
              <h4>
                <strong>N° Cliente:</strong> {ordenSeleccionada?.Cliente?.numero_cliente}
              </h4>
              <h4>
                <strong>Producto:</strong> {ordenSeleccionada?.equipo}
              </h4>
              <h4>
                <strong>Marca:</strong> {ordenSeleccionada?.marca}
              </h4>
              <h4>
                <strong>Modelo:</strong> {ordenSeleccionada?.modelo}
              </h4>
            </div>
          </div>

          <div className='section'>
            <h2>Chequeo de funcionamiento</h2>
            <div className='checkbox-container'>
              {textosCheckbox.map((texto, index) => (
                <div key={index} className='checkbox-item'>
              <IonCheckbox
  checked={checkboxValuesFunciones[index]}
  onIonChange={(e) => {
    const newCheckboxValues = [...checkboxValuesFunciones];
    newCheckboxValues[index] = e.detail.checked;
    setCheckboxValuesFunciones(newCheckboxValues);
  }}
     className='checkbox'
/>
                  <span>{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='section'>
            <h2>Observaciones</h2>
            <IonInput
              className='obs-input'
              value={ordenSeleccionada.motivo}
              onIonChange={(e) => setObservaciones(e.detail.value!)}
              placeholder='Ingrese observaciones'
            />
          </div>

          <div className='section'>
            <h2>Chequeo de limpieza y salida</h2>
            <div className='checkbox-container'>
              {limpiezaSalida.map((texto, index) => (
                <div key={index} className='checkbox-item'>
                  <IonCheckbox
                    checked={checkboxValuesLimpieza[index]}
                    onIonChange={(e) => {
                      const newCheckboxValues = [...checkboxValuesLimpieza];
                      newCheckboxValues[index] = e.detail.checked;
                      setCheckboxValuesLimpieza(newCheckboxValues);
                    }}
                    className='checkbox'
                  />
                  <span>{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
          <IonSelect
              value={estadoSeleccionado}
              placeholder="Estado"
              className="estado-select"
              onIonChange={handleEstadoChange}
            >
              {estadosPresupuestos.map((estado) => (
                <IonSelectOption key={estado.id} value={estado.id}>
                  {estado.texto}
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>

          <div className="section">
       
            <h2>Cierre extendido</h2>
            <div className='checkbox-container'>
    {cierresExtendidos.map((cierre, index) => (
      <div key={cierre.id} className='checkbox-item'>
        <IonCheckbox
          checked={checkboxValuesCierresExtendidos[index]}
          onIonChange={(e) => {
            const newCheckboxValues = [...checkboxValuesCierresExtendidos];
            newCheckboxValues[index] = e.detail.checked;
            setCheckboxValuesCierresExtendidos(newCheckboxValues);
          }}
          className='checkbox'
        />
        <span>{cierre.tipo_cierre_extendido}</span>
      </div>
    ))}
            </div>
          </div>

          <div className='section'>
            <h2>Repuestos del taller</h2>
            <ul>
              {selectedRepuestos.map((repuesto, index) => (
                <li key={index}>
                  {repuesto.descripcion}: {repuesto.cantidad}
                </li>
              ))}
            </ul>
          </div>

          <div className='section'>
            <IonButton className='buttonOrder' style={{ '--border-radius': '20px' }} onClick={handleConfirmarClick}>
              Finalizar operacion
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TallerVerOrden;
