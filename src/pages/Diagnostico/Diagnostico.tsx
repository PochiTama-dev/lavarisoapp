import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonIcon, IonCheckbox, IonInput, IonButton, IonHeader, IonAlert, IonSelect, IonSelectOption, IonSearchbar, IonModal, IonList, IonItem, IonLabel } from '@ionic/react';
import { pencilOutline } from 'ionicons/icons';
import './diagnostico.css';
import HeaderGeneral from '../../components/Header/HeaderGeneral';
import { useHistory } from 'react-router-dom';
import { modificarOrden, getFotosNumeroOrden, Orden, listaReparaciones } from './fetchs';
import { useOrden } from '../../Provider/Provider';
import Fotos from '../../components/Fotos/Fotos';

interface Foto {
  ruta_imagen: string;
}

const Diagnostico: React.FC = () => {

  
  const [equipo, setEquipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cliente, setCliente] = useState('');
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>(() => {
    const savedCheckboxValues = localStorage.getItem('checkboxValues');
    return savedCheckboxValues ? JSON.parse(savedCheckboxValues) : Array(10).fill(false);
  });
  const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
  const history = useHistory();
  const motivoRef = useRef<HTMLIonInputElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const { cargarOrdenes, ordenActiva, setOrdenActiva, tiposDeFunciones } = useOrden();
  const [reparaciones, setReparaciones] = useState<any[]>([]);
  const [selectedReparaciones, setSelectedReparaciones] = useState<number[]>([]);
  const [motivoCheckboxValues, setMotivoCheckboxValues] = useState<boolean[]>([]);
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [inputErrors, setInputErrors] = useState({
    equipo: false,
    marca: false,
    modelo: false,
    cliente: false,
    checkbox: false,
    reparaciones: false,
  });
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReparaciones, setFilteredReparaciones] = useState(reparaciones);
  const [observaciones, setObservaciones] = useState('');
//@ts-ignore
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setFilteredReparaciones(reparaciones.filter((rep) => rep.reparacion.toLowerCase().includes(term.toLowerCase())));
  };

  const loadData = async () => {
    if (ordenActiva) {
      setTextosCheckbox(tiposDeFunciones);
      setEquipo(localStorage.getItem('equipo') || ordenActiva.equipo || '');
      setMarca(localStorage.getItem('marca') || ordenActiva.marca || '');
      setModelo(localStorage.getItem('modelo') || ordenActiva.modelo || '');
      setCliente(localStorage.getItem('cliente') || ordenActiva.Cliente?.numero_cliente || '');
      setObservaciones(localStorage.getItem('observaciones') || ordenActiva.observaciones || '');

      if (motivoRef.current) {
        motivoRef.current.value = localStorage.getItem('motivo') || ordenActiva.motivo || '';
      }

      const savedCheckboxValues = localStorage.getItem('checkboxValues');
      if (savedCheckboxValues) {
        setCheckboxValues(JSON.parse(savedCheckboxValues));
      } else {
        const diagnosticoOrden = ordenActiva.diagnostico || '';
        const nuevosCheckboxValues = textosCheckbox.map((texto) => diagnosticoOrden.includes(texto));
        setCheckboxValues(nuevosCheckboxValues);
      }

      if (ordenActiva.motivo) {
        const motivosSeleccionados = ordenActiva.motivo.split(', ');
        setSelectedReparaciones(motivosSeleccionados);
      }

      const numeroOrden = ordenActiva.id;
      if (numeroOrden) {
        const fotosObtenidas = await getFotosNumeroOrden(numeroOrden);
        setFotos(fotosObtenidas);
      }
    }
  };

  useEffect(() => {
    loadData();
    getReparaciones();
  }, [ordenActiva, textosCheckbox, tiposDeFunciones]);

  const getReparaciones = async () => {
    const reparacionesData = await listaReparaciones();
    setReparaciones(reparacionesData);
    setFilteredReparaciones(reparacionesData);
  };
  const handleModal = () => {
    setShowModal(true);
  };
  const handleConfirmarClick = async () => {
    const camposFaltantes: string[] = [];
    const newInputErrors = { ...inputErrors };

    if (!equipo) {
      camposFaltantes.push('Equipo');
      newInputErrors.equipo = true;
    } else newInputErrors.equipo = false;

    if (!marca) {
      camposFaltantes.push('Marca');
      newInputErrors.marca = true;
    } else newInputErrors.marca = false;

    if (!modelo) {
      camposFaltantes.push('Modelo');
      newInputErrors.modelo = true;
    } else newInputErrors.modelo = false;

    if (!cliente) {
      camposFaltantes.push('N° de cliente');
      newInputErrors.cliente = true;
    } else newInputErrors.cliente = false;

    if (!checkboxValues.some((checked) => checked)) {
      camposFaltantes.push('Chequeo de funcionamiento');
      newInputErrors.checkbox = true;
    } else newInputErrors.checkbox = false;

    if (selectedReparaciones.length === 0) {
      camposFaltantes.push('Motivos de reparación');
      newInputErrors.reparaciones = true;
    } else newInputErrors.reparaciones = false;

    setInputErrors(newInputErrors);

    if (camposFaltantes.length > 0) {
      setErrorAlertMessage(`Por favor, complete los siguientes campos: ${camposFaltantes.join(', ')}`);
      setShowErrorAlert(true);
      return;
    }

    const diagnostico = textosCheckbox.filter((texto, index) => checkboxValues[index]).join(', ');

    const dataToSend = {
      equipo,
      marca,
      modelo,
      cliente,
      diagnostico,
      observaciones,
    };

    if (ordenActiva && ordenActiva.id) {
      const success = await modificarOrden(ordenActiva.id, dataToSend);
      if (success) {
        console.log('Orden guardada', dataToSend);
        localStorage.clear();
        cargarOrdenes();
        history.push('/verOrden');
      } else {
        console.log('Error al guardar en la base de datos.');
      }
    }
  };

  const handleReparacionChange = (value: number[]) => {
    setSelectedReparaciones(value);
  };

  const handleMotivoCheckboxChange = (index: number, checked: boolean) => {
    const newMotivoCheckboxValues = [...motivoCheckboxValues];
    newMotivoCheckboxValues[index] = checked;
    setMotivoCheckboxValues(newMotivoCheckboxValues);

    const newSelectedReparaciones = reparaciones.filter((_, i) => newMotivoCheckboxValues[i]).map((reparacion) => reparacion.reparacion);
    setSelectedReparaciones(newSelectedReparaciones);
  };

  const handleFotosClick = (isEntrega: boolean) => {
    history.push({
      pathname: '/fotos',
      state: { isEntrega },
    });
  };
  const handleCheckboxChange = (index: number) => (e: CustomEvent) => {
    const newCheckboxValues = [...checkboxValues];
    newCheckboxValues[index] = e.detail.checked;
    setCheckboxValues(newCheckboxValues);
    localStorage.setItem('checkboxValues', JSON.stringify(newCheckboxValues));
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, key: string) => (e: CustomEvent) => {
    const value = e.detail.value!;
    setter(value);
    localStorage.setItem(key, value);
  };

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>

        <div className='diagnostico-ctn'>
          <div className='section'>
            <h2>Diagnosticar</h2>

            <div className='item2'>
              <span>
                <strong>Equipo:</strong>
              </span>
              <IonInput
                className={inputErrors.equipo ? 'input-error' : ''}
                style={{ marginLeft: '10px' }}
                value={equipo}
                placeholder='Ingrese equipo'
                onIonChange={handleInputChange(setEquipo, 'equipo')}
              />
            </div>
            <div className='item2'>
              <span>
                <strong>Marca:</strong>
              </span>
              <IonInput className={inputErrors.marca ? 'input-error' : ''} style={{ marginLeft: '10px' }} value={marca} placeholder='Ingrese marca' onIonChange={handleInputChange(setMarca, 'marca')} />
            </div>
            <div className='item2'>
              <span>
                <strong>Modelo:</strong>
              </span>
              <IonInput
                className={inputErrors.modelo ? 'input-error' : ''}
                style={{ marginLeft: '10px' }}
                value={modelo}
                placeholder='Ingrese modelo'
                onIonChange={handleInputChange(setModelo, 'modelo')}
              />
            </div>
            <div className='item2'>
              <span>
                <strong>N° de cliente:</strong>
              </span>
              <IonInput
                className={inputErrors.cliente ? 'input-error' : ''}
                style={{ marginLeft: '10px' }}
                value={cliente}
                placeholder='Ingrese N° de cliente'
                onIonChange={handleInputChange(setCliente, 'cliente')}
                disabled
              />
            </div>
          </div>

          <div className='section'>
            <h2>Chequeo de funcionamiento</h2>
            <div className={`checkbox-container ${inputErrors.checkbox ? 'checkbox-error' : ''}`}>
              {textosCheckbox.map((texto, index) => (
                <div key={index} className='checkbox-item'>
                  <IonCheckbox
                    checked={checkboxValues[index]}
                    onIonChange={handleCheckboxChange(index)}
                    className='checkbox'
                  />
                  <span>{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='section'>
  <h2>Falla / Observaciones</h2>
  <div className='item2'>
    <span></span>
    <IonInput
      value={observaciones}
      placeholder='Ingrese observaciones'
      onIonChange={handleInputChange(setObservaciones, 'observaciones')}
      style={{  fontSize:'18px' }}
    />
  </div>
</div>

          <div className='bottom-buttons-diagnostico'>
            <IonButton style={{ '--border-radius': '20px' }} onClick={() => handleFotosClick(false)}>
              Agregar/Ver Fotos
            </IonButton>
            <IonButton className='button' style={{ '--border-radius': '20px' }} onClick={() => setShowConfirm(true)}>
              Confirmar
            </IonButton>

            <IonAlert
              isOpen={showConfirm}
              onDidDismiss={() => setShowConfirm(false)}
              header={'Confirmar acción'}
              message={'¿Deseas confirmar este diagnóstico?'}
              buttons={[
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  cssClass: 'secondary',
                },
                {
                  text: 'Aceptar',
                  handler: handleConfirmarClick,
                },
              ]}
            />
            <IonAlert isOpen={showErrorAlert} onDidDismiss={() => setShowErrorAlert(false)} header={'Error de validación'} message={errorAlertMessage} buttons={['OK']} />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Diagnostico;
