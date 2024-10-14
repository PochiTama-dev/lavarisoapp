import React, { createContext, useState, useContext, ReactNode, Key } from 'react';

interface Repuesto {
  id_repuesto_camioneta: any;
  id: any;
  nombre: ReactNode;
  cantidad: number;
  StockPrincipal: any;
  id_repuesto: any;
  
}

interface OrdenContextProps {
  ordenSeleccionada: any;
  setOrdenSeleccionada: (orden: any) => void;
  selectedRepuestos: Repuesto[];
  setSelectedRepuestos: (repuestos: Repuesto[]) => void;
  selectedRepuestosTaller: Repuesto[];
  setSelectedRepuestosTaller: (repuestos: Repuesto[]) => void;
}

const OrdenContext = createContext<OrdenContextProps | undefined>(undefined);

interface OrdenProviderProps {
  children: ReactNode;
}

export const OrdenProvider: React.FC<OrdenProviderProps> = ({ children }) => {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<any>(null);
  const [selectedRepuestos, setSelectedRepuestos] = useState<Repuesto[]>([]);
  const [selectedRepuestosTaller, setSelectedRepuestosTaller] = useState<Repuesto[]>([]);

  const handleSetOrdenSeleccionada = (orden: any) => {
    setOrdenSeleccionada(orden);
    setSelectedRepuestos([]);
    setSelectedRepuestosTaller([]);
  };

  return (
    <OrdenContext.Provider value={{ 
      ordenSeleccionada, 
      setOrdenSeleccionada: handleSetOrdenSeleccionada, 
      selectedRepuestos, 
      setSelectedRepuestos,
      selectedRepuestosTaller,  
      setSelectedRepuestosTaller  
    }}>
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


 