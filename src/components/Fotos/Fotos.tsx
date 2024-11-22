import {
  IonButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonModal,
} from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { cameraOutline, checkmarkOutline, trash } from "ionicons/icons";
import "./Fotos.css";
import { useState, useEffect } from "react";
import HeaderGeneral from "../Header/HeaderGeneral";
import { uploadFoto, getFotosNumeroOrden, deleteFoto } from "./fetchs";
import { useOrden } from "../../Provider/Provider";
import { useHistory, useLocation } from "react-router-dom";

interface Photo {
  id: string;
  base64?: string;
  ruta_imagen?: string;
}

interface LocationState {
  isEntrega?: boolean;
  isFactura?: boolean;
}

const Fotos = () => {
  const [photosEntrega, setPhotosEntrega] = useState<Photo[]>([]);
  const [photosDiagnostico, setPhotosDiagnostico] = useState<Photo[]>([]);
  const [photosFactura, setPhotosFactura] = useState<Photo[]>([]);
  const { ordenActiva } = useOrden();
  const maxPhotos = 5;
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const history = useHistory();
  const location = useLocation<LocationState>();
  const isEntrega = location.state?.isEntrega ?? false;
  const isFactura = location.state?.isFactura ?? false;
console.log("IS FACTURA", isFactura)
  const fetchFotosFromOrder = async () => {
    try {
      const fotosOrden = await getFotosNumeroOrden(ordenActiva.id);

      const fotosEntrega = fotosOrden
        .filter((foto: { isEntrega: any; }) => foto.isEntrega)
        .map((foto: { id: any; ruta_imagen: any; }) => ({
          id: foto.id,
          ruta_imagen: foto.ruta_imagen,
        }));

      const fotosDiagnostico = fotosOrden
        .filter((foto: { isEntrega: any; isFactura: any; }) => !foto.isEntrega && !foto.isFactura)
        .map((foto: { id: any; ruta_imagen: any; }) => ({
          id: foto.id,
          ruta_imagen: foto.ruta_imagen,
        }));

      const fotosFactura = fotosOrden
        .filter((foto: { isFactura: any; }) => foto.isFactura)
        .map((foto: { id: any; ruta_imagen: any; }) => ({
          id: foto.id,
          ruta_imagen: foto.ruta_imagen,
        }));

      setPhotosEntrega(fotosEntrega);
      setPhotosDiagnostico(fotosDiagnostico);
      setPhotosFactura(fotosFactura);
    } catch (error) {
      console.error("Error al obtener las fotos de la orden:", error);
    }
  };

  useEffect(() => {
    fetchFotosFromOrder();
  }, [ordenActiva.id]);

  const takePhoto = async () => {
    const currentPhotos = isEntrega
      ? photosEntrega
      : isFactura
      ? photosFactura
      : photosDiagnostico;
    if (currentPhotos.length >= maxPhotos) return;

    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      const newPhoto = {
        id: `${Date.now()}`,
        base64: `data:image/webp;base64,${image.base64String}`,
      };

      if (isEntrega) {
        setPhotosEntrega((prevPhotos) => [newPhoto, ...prevPhotos]);
      } else if (isFactura) {
        setPhotosFactura((prevPhotos) => [newPhoto, ...prevPhotos]);
      } else {
        setPhotosDiagnostico((prevPhotos) => [newPhoto, ...prevPhotos]);
      }
    } catch (error) {
      console.error("Error tomando la foto:", error);
    }
  };

  const handleSendPhotos = async () => {
    try {
      const photosToSend = isEntrega
        ? photosEntrega
        : isFactura
        ? photosFactura
        : photosDiagnostico;
      const nuevasFotos = photosToSend.filter((photo) => photo.base64);

      if (nuevasFotos.length === 0) {
        alert("No hay fotos para enviar.");
        return;
      }

      for (const photo of nuevasFotos) {
        if (photo.base64) {
          await uploadFoto(
            ordenActiva.id,
            photo.base64,
            ordenActiva.id_empleado,
            isEntrega,
            isFactura
          );
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
          setPhotosEntrega((prevPhotos) =>
            prevPhotos.filter((photo) => photo.id !== photoId)
          );
        } else if (isFactura) {
          setPhotosFactura((prevPhotos) =>
            prevPhotos.filter((photo) => photo.id !== photoId)
          );
        } else {
          setPhotosDiagnostico((prevPhotos) =>
            prevPhotos.filter((photo) => photo.id !== photoId)
          );
        }
        console.log("Foto eliminada con éxito");
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
      }
    }
  };

  const currentPhotos = isEntrega
    ? photosEntrega
    : isFactura
    ? photosFactura
    : photosDiagnostico;

  const remainingPhotos = maxPhotos - currentPhotos.length;
  const textStyle = remainingPhotos === 1 ? { color: "red" } : { color: "black" };

  return (
    <IonContent>
      <HeaderGeneral />
      <div style={{ textAlign: "center" }}>
        <h1>
          {isEntrega
            ? "Fotos Entrega"
            : isFactura
            ? "Foto comprobante de pago"
            : "Fotos Diagnóstico"}
        </h1>
        {!isFactura && <p style={textStyle}>{remainingPhotos} fotos restantes</p>}
      </div>

      <IonGrid>
        <IonRow>
          {currentPhotos.map((photo) => (
            <IonCol size="6" key={photo.id}>
              <img
                src={photo.base64 || photo.ruta_imagen}
                alt={`Foto ${photo.id}`}
                onClick={() => {
                  setSelectedPhoto(photo.base64 || photo.ruta_imagen || null);
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

      {currentPhotos.length < (isFactura ? 1 : maxPhotos) && (
        <IonButton onClick={takePhoto} fill="clear" disabled={remainingPhotos <= 0}>
          <IonIcon slot="icon-only" icon={cameraOutline} />
        </IonButton>
      )}

{currentPhotos.length > 0 && (
  <IonButton
    onClick={handleSendPhotos}
    expand="full"
    fill="solid"
    disabled={isFactura ? false : remainingPhotos > 0}
  >
    <IonIcon slot="icon-only" icon={checkmarkOutline} />
    Enviar fotos
  </IonButton>
)}


      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        {selectedPhoto && (
          <img src={selectedPhoto} alt="Vista previa" style={{ width: "100%" }} />
        )}
      </IonModal>
    </IonContent>
  );
};

export default Fotos;
