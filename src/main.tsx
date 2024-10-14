import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Importa los elementos PWA
import { defineCustomElements } from '@ionic/pwa-elements/loader';

const container = document.getElementById('root');
const root = createRoot(container!);

// Esto asegura que los PWA Elements se registren
defineCustomElements(window);

root.render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);
