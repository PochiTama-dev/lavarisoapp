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
  
      const base64Data = image.base64String;
      if (!base64Data) return;
  
      const compressedBase64 = await compressImage(base64Data);
  
      const newPhoto = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        base64: `data:image/jpeg;base64,${compressedBase64}`,
      };
  
      if (isEntrega) {
        setPhotosEntrega((prevPhotos) => [newPhoto, ...prevPhotos]);
      } else if (isFactura) {
        setPhotosFactura((prevPhotos) => [newPhoto, ...prevPhotos]);
      } else {
        setPhotosDiagnostico((prevPhotos) => [newPhoto, ...prevPhotos]);
      }
  
      // No llamar a handleSendPhotos aquí, solo actualizamos el estado
    } catch (error) {
      console.error("Error tomando la foto:", error);
    }
  };
  
  
  const compressImage = async (base64Data: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${base64Data}`;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject("No se pudo obtener el contexto del canvas");
  
        const maxWidth = 800;
        const scaleFactor = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * scaleFactor;
  
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
        const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
        const compressedBase64 = dataUrl.split(',')[1];
        resolve(compressedBase64);
      };
  
      img.onerror = (err) => reject(err);
    });
  };

  const handleSendPhotos = async () => {
    try {
  
      const photosToSend = isEntrega
        ? photosEntrega
        : isFactura
        ? photosFactura
        : photosDiagnostico;
  
      // Filtrar solo las fotos con base64
      const nuevasFotos = photosToSend.filter((photo) => photo.base64);
  
      if (nuevasFotos.length === 0) {
        alert("No hay fotos para enviar.");
        return;
      }
  
      // Subir cada foto
      for (const photo of nuevasFotos) {
        if (photo.base64) {
          try {
            // Convertir base64 a un archivo Blob
            const byteCharacters = atob(photo.base64.split(',')[1]); // Remover el prefijo base64
            const byteArray = new Uint8Array(byteCharacters.length);
  
            // Convertir los caracteres en bytes
            for (let i = 0; i < byteCharacters.length; i++) {
              byteArray[i] = byteCharacters.charCodeAt(i);
            }
  
            // Crear el archivo a partir de los bytes
            const file = new Blob([byteArray], { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('file', file, `photo_${photo.id}.jpg`);  
  
        
  
       
            const uploadResponse = await fetch('https://lv-back.online/upload', {
              method: 'POST',
              body: formData,
            });
  
            if (!uploadResponse.ok) throw new Error("Error al subir la foto a /uploads");
  
            // Procesar la respuesta
            const uploadData = await uploadResponse.json();
          
            const photoUrl = `https://lv-back.online${uploadData.file.path}`;

            // Validar que photoUrl es una cadena
            if (typeof photoUrl !== 'string') {
              console.error('La URL de la foto no es una cadena');
              return;  // Detener la ejecución si no es una cadena válida
            }
            
            const updatedPhoto = { ...photo, ruta_imagen: photoUrl };
            
            const photoLink = await uploadFoto(
              ordenActiva.id,
              photoUrl, // Ahora estamos enviando un string explícitamente
              ordenActiva.id_empleado,
              isEntrega,
              isFactura
            );
           
            if (isEntrega) {
              setPhotosEntrega((prevPhotos) => [...prevPhotos, updatedPhoto]);
            } else if (isFactura) {
              setPhotosFactura((prevPhotos) => [...prevPhotos, updatedPhoto]);
            } else {
              setPhotosDiagnostico((prevPhotos) => [...prevPhotos, updatedPhoto]);
            }
  
            console.log("Foto subida con éxito:", photoLink);
  
          } catch (error) {
            console.error("Error al subir la foto:", error);
          }
        }
      }
  
      console.log("Fotos enviadas con éxito");
      if (isFactura) {
        history.push('/verOrden');
      } else {
        history.goBack();
      }
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
    {currentPhotos.map((photo, index) => (
      <IonCol size="6" key={`${photo.id}-${index}`}> 
        <img
          src={photo.base64 || photo.ruta_imagen}
          alt={`Foto ${photo.id}`}
          onClick={() => {
            setSelectedPhoto(photo.base64 || photo.ruta_imagen || null);
            setShowModal(true);
          }}
          style={{ cursor: "pointer", width: "140px", height: "150px" }}
        />
        <IonButton onClick={() => handleDeletePhoto(photo.id)} fill="clear">
          <IonIcon icon={trash} />
        </IonButton>
      </IonCol>
    ))}
  </IonRow>
</IonGrid>

      {currentPhotos.length < (isFactura ? 1 : maxPhotos) && (
        <IonButton className="ion-button-fotos" onClick={takePhoto} fill="clear" disabled={remainingPhotos <= 0}>
          <IonIcon slot="icon-only" icon={cameraOutline} />
        </IonButton>
      )}

{currentPhotos.length > 0 && (
  <IonButton
    onClick={handleSendPhotos}
    expand="full"
    fill="solid"
  
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
