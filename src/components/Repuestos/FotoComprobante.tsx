import React, { useState } from 'react';
import { IonImg, IonContent, IonButton } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const FotoComprobante: React.FC<{ onPhotoTaken: (photoUrl: string) => void }> = ({ onPhotoTaken }) => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const takePhoto = async () => {
    try {
      setIsLoading(true);

      const image = await Camera.getPhoto({
        quality: 70,  
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      const base64Data = image.base64String;
      if (!base64Data) {
        throw new Error('No se obtuvo la imagen');
      }

 
      const compressedBase64 = await compressImage(base64Data);

 
      setPhoto(`data:image/jpeg;base64,${compressedBase64}`);

   
      await uploadPhotoFromBase64(compressedBase64);

    } catch (err) {
      console.error('Error tomando foto:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const compressImage = async (base64Data: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${base64Data}`;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject('No se pudo obtener el contexto del canvas');
        }
  
  
        const maxWidth = 800;
        const scaleFactor = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleFactor;
  
   
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
   
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);  
        const compressedBase64 = dataUrl.split(',')[1];  
        resolve(compressedBase64);
      };
  
      img.onerror = (err) => {
        reject(err);
      };
    });
  };
  

  const uploadPhotoFromBase64 = async (base64Data: string) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteArray = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }

      const file = new Blob([byteArray], { type: 'image/jpeg' });

      const formData = new FormData();
      formData.append('file', file, 'comprobante.jpg');

      const response = await fetch('https://lv-back.online/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la foto');
      }

      const data = await response.json();
      const photoUrl = `https://lv-back.online${data.file.path}`;
      onPhotoTaken(photoUrl);

    } catch (error) {
      console.error('Error al subir la foto:', error);
    }
  };

  return (
    <IonContent className="ion-padding">
      <h2>Tomando Foto del Comprobante...</h2>
      {isLoading ? (
        <p>Esperando la foto...</p>
      ) : (
        photo && <IonImg src={photo} style={{ width: '100%', marginBottom: '20px' }} />
      )}
      <IonButton onClick={takePhoto} expand="full">Tomar Foto</IonButton>
    </IonContent>
  );
};

export default FotoComprobante;
