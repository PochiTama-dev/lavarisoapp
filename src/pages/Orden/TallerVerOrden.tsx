import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonIcon,
  IonCheckbox,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonRadioGroup,
  IonItem,
  IonLabel,
  IonRadio,
  IonRow,
  IonCol,
  IonHeader,
} from '@ionic/react';
import '../Diagnostico/diagnostico.css';
import '../Entrega/entrega.css';
import HeaderGeneral from '../../components/Header/HeaderGeneral';
import './orden.css'
const TallerVerOrden: React.FC = () => {
 
  const [producto, setProducto] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cliente, setCliente] = useState('');
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>(Array(10).fill(false));
  const [observaciones, setObservaciones] = useState('');
 
  const textosCheckbox = [
    'Enciende',
    'Ingresa agua',
    'No ingresa agua',
    'Gira motor para los dos lados',
    'Centrifuga',
    'No centrifuga',
    'Desagota',
    'No desagota',
    'Sin prueba de funcionamiento',
    'No enciende',
  ];
  const limpiezaSalida = [
    'Limpieza de carcaza',
    'Limpieza de puerta',
    'Limpieza de comando',
    'Limpieza jabonera',
    'Limpieza fuelle',
    'Limpieza de conductos S/D',
    'Limpieza de conductos C/D',
    'Calcomanía',
   
  ];

  const estimado = [
    "1 a 3 horas",
    "2 a 4 horas",
    "1/2 dia",
    "1 dia",
    "dias",
   
  ];
  const numeroOrden = "#25645";
  const orden = {
    cliente: "Martín Inchausti",
    telefono: 112345678,
    legajo: "0123456",
    direccion: "Corrientes 654",
    precio: 17800,
    producto: "Lavarropas",
    marca: "Whirlpool",
    modelo: "WLF123",
    Ncliente: 123456,
  };



  const handleConfirmarClick = () => {
    const dataToSend = {
      producto,
      marca,
      modelo,
      cliente,
      checkboxValues,
      observaciones,
    };
    console.log(dataToSend);
  };

 
 

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>
        <div className='diagnostico-ctn'>
        <div className="section">
        <h1 style={{fontSize:'28px', marginBottom:'-20px'}}><strong>En taller</strong> </h1>
        <h2>Orden: {numeroOrden}</h2>
        <h3>
          <strong>Datos del cliente</strong>
        </h3>
        <div className='orden-datosCliente'>
        <h4>
          <strong>Nombre:</strong> {orden.cliente}
        </h4>
        <h4>
          <strong>Teléfono:</strong> {orden.telefono}
        </h4>
        <h4>
          <strong>Legajo:</strong> {orden.legajo}
        </h4>
        <h4>
          <strong>Producto:</strong> {orden.producto}
        </h4>
        <h4>
          <strong>Marca:</strong> {orden.marca}
        </h4>
        <h4>
          <strong>Modelo:</strong> {orden.modelo}
        </h4>
        <h4>
          <strong>N° de cliente:</strong> {orden.Ncliente}
        </h4>
    
        </div>
      </div>
          
          <div className='section'>
            <h2>Chequeo de funcionamiento</h2>
            <div className='checkbox-container'>
              {textosCheckbox.map((texto, index) => (
                <div key={index} className='checkbox-item'>
                  <IonCheckbox
                    checked={checkboxValues[index]}
                    onIonChange={(e) => {
                      const newCheckboxValues = [...checkboxValues];
                      newCheckboxValues[index] = e.detail.checked;
                      setCheckboxValues(newCheckboxValues);
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
              value={observaciones}
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
                    checked={checkboxValues[index]}
                    onIonChange={(e) => {
                      const newCheckboxValues = [...checkboxValues];
                      newCheckboxValues[index] = e.detail.checked;
                      setCheckboxValues(newCheckboxValues);
                    }}
                    className='checkbox'
                  />
                  <span>{texto}</span>
 
                </div>
              ))}
            </div>
            
          </div>
          <div>
                <IonSelect placeholder="Estado" className="estado-select">
                  <IonSelectOption value="option1">Visitado</IonSelectOption>
                  <IonSelectOption value="option2">En taller</IonSelectOption>
                  <IonSelectOption value="option3">Entregado</IonSelectOption>
                </IonSelect>
              </div>
          <div className="section">
              <h2>Cierre extendido</h2>
              <div className="checkbox-container">
                {estimado.map((texto, index) => (
                  <div key={index} className="checkbox-item">
                    <IonCheckbox
                      checked={checkboxValues[index]}
                      onIonChange={(e) => {
                        const newCheckboxValues = [...checkboxValues];
                        newCheckboxValues[index] = e.detail.checked;
                        setCheckboxValues(newCheckboxValues);
                      }}
                      className="checkbox"
                    />
                    <span>{texto}</span>
                  </div>
                ))}
              </div>
      
            </div>
            <div className='section'>
            <h2>Repuestos del taller</h2>
            <span>Fuelle de cambio lineal</span>
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
