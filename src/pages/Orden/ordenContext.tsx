import React, { createContext, useState, useContext, ReactNode } from 'react';

interface OrdenContextProps {
  ordenSeleccionada: any;
  setOrdenSeleccionada: (orden: any) => void;
}

const OrdenContext = createContext<OrdenContextProps | undefined>(undefined);

interface OrdenProviderProps {
  children: ReactNode;  
}

export const OrdenProvider: React.FC<OrdenProviderProps> = ({ children }) => {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<any>(null);

  return (
    <OrdenContext.Provider value={{ ordenSeleccionada, setOrdenSeleccionada }}>
      {children}
    </OrdenContext.Provider>
  );
};

export const useOrden = () => {
  const context = useContext(OrdenContext);
  if (context === undefined) {
    throw new Error('useOrden must be used within an OrdenProvider');
  }
  return context;
};
