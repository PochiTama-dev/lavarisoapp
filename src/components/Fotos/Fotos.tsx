import { IonButton, IonImg, IonContent, IonGrid, IonRow, IonCol, IonIcon } from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { cameraOutline, checkmarkOutline } from "ionicons/icons";
import "./Fotos.css";
import { useState } from "react";
import HeaderGeneral from "../Header/HeaderGeneral";

const Fotos: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const maxPhotos = 5;

  const takePhoto = async () => {
    if (photos.length >= maxPhotos) {
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      const newPhoto = `data:image/jpeg;base64,${image.base64String}`;
      setPhotos([newPhoto, ...photos]);
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const handleSendPhotos = () => {
    console.log("Fotos enviadas:", photos);
  };

  const remainingPhotos = maxPhotos - photos.length;
  const textStyle = remainingPhotos === 1 ? { color: "red" } : { color: "black" };

  return (
    <IonContent>
      <HeaderGeneral />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1>Fotos</h1>
        <p style={textStyle}>{remainingPhotos} fotos restantes</p>
      </div>

      <IonGrid>
        <IonRow>
          {photos.map((photo, index) => (
            <IonCol size='6' key={index}>
              <IonImg src={photo} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      {/* Contenedor para los botones */}
      <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "10px" }}>
        {photos.length < maxPhotos ? (
          <IonButton 
            onClick={takePhoto} 
            className='take-photo-button' 
            fill='clear'
          >
            <IonIcon slot='icon-only' icon={cameraOutline} style={{ fontSize: "48px" }} />
          </IonButton>
        ) : null}
        
        <IonButton 
          onClick={handleSendPhotos} 
          className='send-photos-button' 
          expand='full' 
          fill='solid'
        >
          <IonIcon slot='icon-only' icon={checkmarkOutline} />
        </IonButton>
      </div>
    </IonContent>
  );
};

export default Fotos;
