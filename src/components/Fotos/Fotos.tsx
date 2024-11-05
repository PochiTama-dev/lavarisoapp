import { IonButton, IonContent, IonGrid, IonRow, IonCol, IonIcon, IonAlert, IonModal } from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { cameraOutline, checkmarkOutline, trash } from "ionicons/icons"; // Asegúrate de importar el icono de basura
import "./Fotos.css";
import { useState, useEffect } from "react";
import HeaderGeneral from "../Header/HeaderGeneral";
import { uploadFoto, getFotosNumeroOrden, deleteFoto } from './fetchs';
import { useOrden } from "../../Provider/Provider";

interface FotosProps {
  isEntrega: boolean; // Prop para controlar si es true o false
}

const Fotos: React.FC<FotosProps> = ({ isEntrega }) => {
  const [photos, setPhotos] = useState<{ id: string, base64?: string, ruta_imagen?: string }[]>([]); // Agregamos id
  const { ordenActiva } = useOrden();
  const maxPhotos = 5;
  const [showAlert, setShowAlert] = useState(false); // Estado para el alert
  const [photoToDelete, setPhotoToDelete] = useState<string | null>(null); // Para almacenar el ID de la foto a eliminar
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null); // Estado para la foto seleccionada
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

  // Función para obtener las fotos relacionadas con la orden
  const fetchFotosFromOrder = async () => {
    try {
      const fotosOrden = await getFotosNumeroOrden(ordenActiva.id); // Llamada a la API para obtener las fotos
      const fotosMapeadas = fotosOrden.map((foto: { id: string, ruta_imagen: string }) => ({
        id: foto.id, // Asegúrate de obtener el ID de la foto
        ruta_imagen: foto.ruta_imagen
      }));
      
      setPhotos(fotosMapeadas); // Establecemos solo las fotos de la API, sin duplicar
    } catch (error) {
      console.error("Error al obtener las fotos de la orden:", error);
    }
  };

  useEffect(() => {
    fetchFotosFromOrder();
  }, [ordenActiva.id]);

  const takePhoto = async () => {
    if (photos.length >= maxPhotos) {
      return;
    }

    try {
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
      });

      const newPhoto = { id: `${Date.now()}`, base64: `data:image/webp;base64,${image.base64String}` }; // Generamos un ID temporal
      setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);  
    } catch (error) {
      console.error("Error tomando la foto:", error);
    }
  };

  const handleSendPhotos = async () => {
    try {
      const nuevasFotos = photos.filter(photo => photo.base64);

      for (const photo of nuevasFotos) {
        if (photo.base64) {
          await uploadFoto(ordenActiva.id, photo.base64, ordenActiva.id_empleado, isEntrega);
        }
      }

      console.log("Fotos enviadas con éxito");
    } catch (error) {
      console.error("Error al enviar las fotos:", error);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres eliminar esta foto?");
    if (confirmed) {
      try {
        await deleteFoto(photoId); // Llama a la función de eliminación de la API
        setPhotos(photos.filter(photo => photo.id !== photoId)); // Actualiza el estado eliminando la foto
        console.log("Foto eliminada con éxito");
      } catch (error) {
        console.error("Error al eliminar la foto:", error);
      }
    }
  };

  const remainingPhotos = maxPhotos - photos.length;
  const textStyle = remainingPhotos === 1 ? { color: "red" } : { color: "black" };

  return (
    <IonContent>
      <HeaderGeneral />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1>{isEntrega ? "Fotos Entrega" : "Fotos Diagnostico"}</h1>
        <p style={textStyle}>{remainingPhotos} fotos restantes</p>
      </div>

      <IonGrid>
        <IonRow>
          {photos.map((photo) => (
            <IonCol size='6' key={photo.id}>
              <img
                src={photo.base64 ? photo.base64 : photo.ruta_imagen}
                alt={`Foto ${photo.id}`}
                onClick={() => {
                  const imageToShow = photo.base64 || photo.ruta_imagen || null; // Asigna null si no hay ninguna imagen
                  setSelectedPhoto(imageToShow);
                  setShowModal(true); // Mostrar el modal al hacer clic
                }}
                style={{ cursor: "pointer", width: "100%", height: "auto" }} // Añadir estilos para que el cursor indique que es clickeable
              />
              <IonButton onClick={() => handleDeletePhoto(photo.id)} fill="clear">
                <IonIcon icon={trash} />
              </IonButton>
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>

      <div style={{ 
        position: "fixed", 
        bottom: "20px", 
        left: "50%", 
        transform: "translateX(-50%)", 
        display: "flex", 
        gap: "10px",
        zIndex: 1000  
      }}>
        {photos.length < maxPhotos && (
          <IonButton 
            onClick={takePhoto} 
            className='take-photo-button' 
            fill='clear'
          >
            <IonIcon slot='icon-only' icon={cameraOutline} style={{ fontSize: "48px" }} />
          </IonButton>
        )}

        <IonButton 
          onClick={handleSendPhotos} 
          className='send-photos-button' 
          expand='full' 
          fill='solid'
        >
          <IonIcon slot='icon-only' icon={checkmarkOutline} />
        </IonButton>
      </div>

      {/* Modal para mostrar la foto ampliada */}
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
  <IonContent style={{ padding: 0 }}>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',  // Centra horizontalmente
        alignItems: 'center',      // Centra verticalmente
        height: '90vh',            // Asegura que ocupe gran parte de la altura de la pantalla
      }}
    >
      {selectedPhoto && (
        <img
          src={selectedPhoto}
          alt="Foto Ampliada"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '80vh',      // Ajuste para evitar que se desborde
            objectFit: 'contain',
          }} // Estilos para ajustar la imagen al modal
        />
      )}
    </div>
    <IonButton
      onClick={() => setShowModal(false)}
      fill="clear"
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
      }}
    >
      Cerrar
    </IonButton>
  </IonContent>
</IonModal>

    </IonContent>
  );
};

export default Fotos;
