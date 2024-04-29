import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage, IonList, IonItem, IonLabel, IonInput, IonIcon } from '@ionic/react';
import { paperPlaneOutline } from 'ionicons/icons';
import './chat.css'
const Chat: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const inputRef = useRef<HTMLIonInputElement>(null);

    useEffect(() => {
        // Enfocar el cuadro de entrada al cargar el componente
        inputRef.current?.setFocus();
    }, []);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            setMessages([...messages, message]);
            setMessage('');
            // Enfocar el cuadro de entrada después de enviar el mensaje
            inputRef.current?.setFocus();
        }
    };

    return (
        <IonPage>
            <IonContent>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ flex: '1', overflowY: 'auto' }}>
                        <IonList>
                            {messages.map((msg, index) => (
                                <IonItem key={index}>
                                    <IonLabel>{msg}</IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </div>
                    <div style={{ position: 'fixed', bottom: '0', width: '100%', padding: '15px', backgroundColor: '#69688C', display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: '1' }}>
                            <IonInput
                                  style={{ '--padding-start': '10px'  } as React.CSSProperties } //
                                className='chat-input'
                                value={message}
                                placeholder="Escribe un mensaje..."
                                onIonChange={(e) => setMessage(e.detail.value!)}
                                ref={inputRef}
                            />
                        </div>
                        <IonIcon icon={paperPlaneOutline} style={{ marginLeft: '10px', cursor: 'pointer', fontSize: '24px' }} onClick={handleSendMessage} />
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Chat;