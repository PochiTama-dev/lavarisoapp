import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonCheckbox, IonInput, IonButton } from '@ionic/react';
import { pencilOutline } from 'ionicons/icons';
import './diagnostico.css';
 

const Diagnostico: React.FC = () => {
    const [producto, setProducto] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [cliente, setCliente] = useState('');
    const [checkboxValues, setCheckboxValues] = useState<boolean[]>(Array(10).fill(false));
    const [observaciones, setObservaciones] = useState('');

    const textosCheckbox = ['Enciende', 'Ingresa agua', 'No ingresa agua', 'Gira motor para los dos lados', 'Centrifuga', 'No centrifuga', 'Desagota', 'No desagota', 'Sin prueba de funcionamiento', 'No enciende'];

    const handleConfirmarClick = () => {
        const dataToSend = {
            producto,
            marca,
            modelo,
            cliente,
            checkboxValues,
            observaciones
        };
        console.log(dataToSend);
    };

    return (
        <IonPage>
            <IonContent>
         
                <div className="diagnostico-ctn">
                    <div className="section">
                        <h2>Diagnosticar</h2>
                        <div className="item">
                            <span><strong>Producto:</strong></span>
                            <IonInput
                            style={{ marginLeft: '10px' }}
                                value={producto}
                                placeholder="Ingrese producto"
                                onIonChange={(e) => setProducto(e.detail.value!)}
                               
                            />
                            <IonIcon icon={pencilOutline} className="icon-pencil" style={{fontSize:'22px'}} />
                        </div>
                        <div className="item">
                            <span><strong>Marca:</strong></span>
                            <IonInput
                            style={{ marginLeft: '10px' }}
                                value={marca}
                                placeholder="Ingrese marca"
                                onIonChange={(e) => setMarca(e.detail.value!)}
                                 
                            />
                            <IonIcon icon={pencilOutline} className="icon-pencil" style={{fontSize:'22px'}} />
                        </div>
                        <div className="item">
                            <span><strong>Modelo:</strong></span>
                            <IonInput
                            style={{ marginLeft: '10px' }}
                                value={modelo}
                                placeholder="Ingrese modelo"
                                onIonChange={(e) => setModelo(e.detail.value!)}
                               
                            />
                            <IonIcon icon={pencilOutline} className="icon-pencil" style={{fontSize:'22px'}} />
                        </div>
                        <div className="item">
                            <span><strong>N° de cliente:</strong></span>
                            <IonInput
                            style={{ marginLeft: '10px' }}
                                value={cliente}
                                placeholder="Ingrese N° de cliente"
                                onIonChange={(e) => setCliente(e.detail.value!)}
                                
                            />
                            <IonIcon icon={pencilOutline} className="icon-pencil" style={{fontSize:'22px'}} />
                        </div>
                    </div>
                    <div className="section">
                        <h2>Chequeo de funcionamiento</h2>
                        <div className="checkbox-container">
                            {textosCheckbox.map((texto, index) => (
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
                    <div className="section">
                        <h2>Observaciones</h2>
                        <IonInput
                        className='obs-input'
                            value={observaciones}
                            onIonChange={(e) => setObservaciones(e.detail.value!)}
                            placeholder="Ingrese observaciones"
                        />
                    </div>
                    <div className="section">
                        <IonButton className='button' style={{ '--border-radius': '20px' }} onClick={handleConfirmarClick}>
                            Confirmar
                        </IonButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Diagnostico;