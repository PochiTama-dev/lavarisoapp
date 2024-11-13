import { IonButton, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonModal } from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { cameraOutline, checkmarkOutline, trash } from "ionicons/icons";
import "./Fotos.css";
import { useState, useEffect } from "react";
import HeaderGeneral from "../Header/HeaderGeneral";
import { uploadFoto, getFotosNumeroOrden, deleteFoto } from "./fetchs";
import { useOrden } from "../../Provider/Provider";
import { useHistory, useLocation } from "react-router-dom";

interface LocationState {
  isEntrega: boolean;
}

const Fotos = () => {
  const [photosEntrega, setPhotosEntrega] = useState<{ id: string; base64?: string; ruta_imagen?: string }[]>([]);
  const [photosDiagnostico, setPhotosDiagnostico] = useState<{ id: string; base64?: string; ruta_imagen?: string }[]>([]);
  const { ordenActiva } = useOrden();
  const maxPhotos = 5;
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const history = useHistory();
  const location = useLocation<LocationState>();
  const isEntrega = location.state?.isEntrega ?? false;

  const fetchFotosFromOrder = async () => {
    try {
      const fotosOrden = await getFotosNumeroOrden(ordenActiva.id);

      const fotosEntrega = fotosOrden
        .filter((foto: { isEntrega: boolean }) => foto.isEntrega)
        .map((foto: { id: string; ruta_imagen: string }) => ({
          id: foto.id,
          ruta_imagen: foto.ruta_imagen,
        }));

      const fotosDiagnostico = fotosOrden
        .filter((foto: { isEntrega: boolean }) => !foto.isEntrega)
        .map((foto: { id: string; ruta_imagen: string }) => ({
          id: foto.id,
          ruta_imagen: foto.ruta_imagen,
        }));

      setPhotosEntrega(fotosEntrega);
      setPhotosDiagnostico(fotosDiagnostico);
    } catch (error) {
      console.error("Error al obtener las fotos de la orden:", error);
    }
  };

  useEffect(() => {
    fetchFotosFromOrder();
  }, [ordenActiva.id]);

  const takePhoto = async () => {
    const currentPhotos = isEntrega ? photosEntrega : photosDiagnostico;
    if (currentPhotos.length >= maxPhotos) {
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      const newPhoto = { id: `${Date.now()}`, base64: `data:image/webp;base64,${image.base64String}` };
      if (isEntrega) {
        setPhotosEntrega((prevPhotos) => [newPhoto, ...prevPhotos]);
      } else {
        setPhotosDiagnostico((prevPhotos) => [newPhoto, ...prevPhotos]);
      }
    } catch (error) {
      console.error("Error tomando la foto:", error);
    }
  };

  const handleSendPhotos = async () => {
    try {
      const photosToSend = isEntrega ? photosEntrega : photosDiagnostico;
      const nuevasFotos = photosToSend.filter((photo) => photo.base64);

      for (const photo of nuevasFotos) {
        if (photo.base64) {
          await uploadFoto(ordenActiva.id, photo.base64, ordenActiva.id_empleado, isEntrega);
        }
      }

      console.log("Fotos enviadas con éxito");
      history.goBack();
    } catch (error) {
      console.error("Error al enviar las fotos:", error);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta foto?");
    if (confirmed) {
      try {
        await deleteFoto(photoId);
        if (isEntrega) {
          setPhotosEntrega((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
        } else {
          setPhotosDiagnostico((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
        }
        console.log("Foto eliminada con éxito");
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
      }
    }
  };

  const currentPhotos = isEntrega ? photosEntrega : photosDiagnostico;
  const remainingPhotos = isEntrega ? maxPhotos - photosEntrega.length : maxPhotos - photosDiagnostico.length;
  const textStyle = remainingPhotos === 1 ? { color: "red" } : { color: "black" };

  return (
    <IonContent>
      <HeaderGeneral />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1>{isEntrega ? "Fotos Entrega" : "Fotos Diagnóstico"}</h1>
        <p style={textStyle}>{remainingPhotos} fotos restantes</p>
      </div>

      <IonGrid>
        <IonRow>
          {currentPhotos.map((photo) => (
            <IonCol size="6" key={photo.id}>
              <img
                src={photo.base64 ? photo.base64 : photo.ruta_imagen}
                alt={`Foto ${photo.id}`}
                onClick={() => {
                  const imageToShow = photo.base64 || photo.ruta_imagen || null;
                  setSelectedPhoto(imageToShow);
                  setShowModal(true);
                }}
                style={{ cursor: "pointer", width: "100%", height: "auto" }}
              />
              <IonButton onClick={() => handleDeletePhoto(photo.id)} fill="clear">
                <IonIcon icon={trash} />
              </IonButton>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      <div className="photo-buttons-container">
  {currentPhotos.length < maxPhotos && (
    <IonButton onClick={takePhoto} className="take-photo-button" fill="clear">
      <IonIcon slot="icon-only" icon={cameraOutline} className="camera-icon" />
    </IonButton>
  )}

  {currentPhotos.length > 0 && (
    <IonButton onClick={handleSendPhotos} className="send-photos-button" expand="full" fill="solid">
      <IonIcon slot="icon-only" icon={checkmarkOutline} />
    </IonButton>
  )}
</div>



      {/* Modal para mostrar la foto ampliada */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonContent style={{ padding: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt="Foto Ampliada"
                style={{ width: "100%", height: "auto", maxHeight: "80vh", objectFit: "contain" }}
              />
            )}
          </div>
          <IonButton onClick={() => setShowModal(false)} fill="clear" style={{ position: "absolute", top: "10px", right: "10px" }}>
            Cerrar
          </IonButton>
        </IonContent>
      </IonModal>
    </IonContent>
  );
};

export default Fotos;
