import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  position: {
    latitude: number;
    longitude: number;
  };
  zoom: number;
}
declare module 'react-leaflet' {
  interface MapContainerProps {
    center?: [number, number];
    zoom?: number;
    scrollWheelZoom?: boolean;
  }
}
const Map: React.FC<MapProps> = ({ position, zoom }) => {
  const { latitude, longitude } = position;

  return (
    <div style={{ height: '200px', width: '100%' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[latitude, longitude]}>
          <Popup>Ubicación actual del usuario.</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
