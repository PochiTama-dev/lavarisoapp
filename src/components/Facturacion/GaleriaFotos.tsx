import { useState } from "react";
import { IonModal, IonButton, IonContent } from "@ionic/react";
import "./GaleriaFotos.css";

const GaleriaFotos = ({ fotos }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!fotos || fotos.length === 0) {
    return <p>No hay fotos disponibles.</p>;
  }

  const handlePhotoClick = (photo) => {
    const imageToShow = photo.base64 || photo.ruta_imagen || null;
    setSelectedPhoto(imageToShow);
    setShowModal(true);
  };

  return (
    <>
      <div className="galeria-container">
        {fotos.map((foto, index) => {
          const imageSrc = foto.base64 || foto.ruta_imagen;
          if (!imageSrc) return null;

          return (
            <div key={index} className="galeria-item">
              <img
                src={imageSrc}
                alt={`Foto ${index + 1}`}
                className="galeria-img"
                onClick={() => handlePhotoClick(foto)}
                style={{ cursor: "pointer" }}
              />
            </div>
          );
        })}
      </div>

      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonContent style={{ padding: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "90vh",
            }}
          >
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt="Foto Ampliada"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
          <IonButton
            onClick={() => setShowModal(false)}
            fill="clear"
            style={{ position: "absolute", top: "10px", right: "10px" }}
          >
            Cerrar
          </IonButton>
        </IonContent>
      </IonModal>
    </>
  );
};

export default GaleriaFotos;
