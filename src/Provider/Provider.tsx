import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { entregaPago, fetchOrdenes, fetchRepuestosCamioneta, fetchStockPrincipal, fetchTiposFunciones } from "./fetchs"; // Importar los fetchs necesarios

interface Repuesto {
  lote: any;
  precio: number;
  id_repuesto_camioneta: any;
  id: any;
  nombre: ReactNode;
  cantidad: number;
  StockPrincipal: any;
  id_repuesto: any;
}

interface OrdenContextProps {
  ordenes: any[];
  cargarOrdenes: () => void;
  ordenSeleccionada: any;
  setOrdenSeleccionada: (orden: any) => void;
  selectedRepuestos: Repuesto[];
  setSelectedRepuestos: (repuestos: Repuesto[]) => void;
  selectedRepuestosTaller: Repuesto[];
  setSelectedRepuestosTaller: (repuestos: Repuesto[]) => void;
  ordenActiva: any;
  setOrdenActiva: (orden: any) => void;
  toggleOrdenActiva: (orden: any) => void;
  cargarRepuestosCamioneta: () => void;
  repuestosCamioneta: Repuesto[];
  setRepuestosCamioneta: React.Dispatch<React.SetStateAction<Repuesto[]>>;
  cargarRepuestosTaller: () => void;
  repuestosTaller: Repuesto[];
  tiposDeFunciones: string[]; // Nuevo estado para tipos de funciones
  cargarTiposFunciones: () => void; // Nueva función para cargar tipos de funciones
  pagos: any[]; // Nuevo estado para pagos
  cargarPagos: (idEntrega: any) => void; // Nueva función para cargar pagos
}

const OrdenContext = createContext<OrdenContextProps | undefined>(undefined);

interface OrdenProviderProps {
  children: ReactNode;
}

export const OrdenProvider: React.FC<OrdenProviderProps> = ({ children }) => {
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<any>(null);
  const [selectedRepuestos, setSelectedRepuestos] = useState<Repuesto[]>([]);
  const [selectedRepuestosTaller, setSelectedRepuestosTaller] = useState<Repuesto[]>([]);
  const [ordenes, setOrdenes] = useState<any[]>([]);
  const [ordenActiva, setOrdenActiva] = useState<any>(null);
  const [repuestosCamioneta, setRepuestosCamioneta] = useState<Repuesto[]>([]);
  const [repuestosTaller, setRepuestosTaller] = useState<Repuesto[]>([]);
  const [tiposDeFunciones, setTiposDeFunciones] = useState<string[]>([]); // Nuevo estado para tipos de funciones
  const [pagos, setPagos] = useState<any[]>([]);

  const cargarPagos = async (idEntrega: any) => {
    try {
      const pagos = await entregaPago(idEntrega); // Llamar al fetch que ya tienes
      if (pagos) {
        setPagos(pagos); // Si se encuentran pagos, los almacenamos
      } else {
        setPagos([]); // Si no se encuentran, dejamos el estado vacío
      }
    } catch (error) {
      console.error("Error al cargar los pagos:", error);
      setPagos([]); // Si hay un error, dejamos el estado vacío
    }
  };
  // Función para cargar las órdenes
  const cargarOrdenes = async () => {
    const empleadoId = localStorage.getItem("empleadoId");
    if (!empleadoId) {
      console.error("No se encontró el ID del empleado en el localStorage");
      setOrdenes([]);
      return;
    }
  
    try {
      const todasLasOrdenes = await fetchOrdenes();
      if (todasLasOrdenes.length > 0) {
        const ordenesFiltradas = todasLasOrdenes.filter((orden: { Empleado: { id: string }; id_tipo_estado: number }) =>
          orden.Empleado.id == empleadoId && orden.id_tipo_estado === 1
        );
        setOrdenes(ordenesFiltradas);
  
        // Si hay una orden activa en el localStorage, verificar si sigue siendo válida
        const ordenActivaGuardada = localStorage.getItem("ordenActiva");
        if (ordenActivaGuardada) {
          const ordenActivaParsed = JSON.parse(ordenActivaGuardada);
          const ordenValida = ordenesFiltradas.find((orden: { id: any; }) => orden.id === ordenActivaParsed.id);
          if (ordenValida) {
            setOrdenActiva(ordenValida); // Si la orden activa sigue existiendo, actualizarla
          } else {
            setOrdenActiva(null); // Si no existe, resetear
            localStorage.removeItem("ordenActiva");
          }
        }
      } else {
        console.log("No se encontraron órdenes.");
        setOrdenes([]);
      }
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
      setOrdenes([]);
    }
  };

  // Función para cargar los repuestos de la camioneta
  const cargarRepuestosCamioneta = async () => {
    const empleadoId = localStorage.getItem("empleadoId");
    if (!empleadoId) {
      console.error("No se encontró el ID del empleado en el localStorage");
      return;
    }
    try {
      const repuestos = await fetchRepuestosCamioneta(empleadoId);
      setRepuestosCamioneta(repuestos);
    } catch (error) {
      console.error("Error al cargar los repuestos de camioneta:", error);
    }
  };

  // Función para cargar los repuestos del taller
  const cargarRepuestosTaller = async () => {
    const empleadoId = localStorage.getItem("empleadoId");
    if (!empleadoId) {
      console.error("No se encontró el ID del empleado en el localStorage");
      return;
    }
    try {
      const repuestos = await fetchStockPrincipal(empleadoId);
      setRepuestosTaller(repuestos);
    } catch (error) {
      console.error("Error al cargar los repuestos de taller:", error);
    }
  };

  // Nueva función para cargar los tipos de funciones
  const cargarTiposFunciones = async () => {
    try {
      const funciones = await fetchTiposFunciones();
      setTiposDeFunciones(funciones);
    } catch (error) {
      console.error("Error al cargar los tipos de funciones:", error);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarOrdenes();
    cargarRepuestosCamioneta();
    cargarRepuestosTaller();
    cargarTiposFunciones(); // Cargar los tipos de funciones al montar el componente
  }, []);

  // Manejo de orden activa en el localStorage
  useEffect(() => {
    const ordenActivaGuardada = localStorage.getItem("ordenActiva");
    if (ordenActivaGuardada) {
      setOrdenActiva(JSON.parse(ordenActivaGuardada));
    }
  }, []);

  useEffect(() => {
    if (ordenActiva) {
      localStorage.setItem("ordenActiva", JSON.stringify(ordenActiva));
    } else {
      localStorage.removeItem("ordenActiva");
    }
  }, [ordenActiva]);

  const toggleOrdenActiva = (orden: any) => {
    if (ordenActiva === orden) {
      setOrdenActiva(null);
      localStorage.removeItem("ordenActiva");
    } else {
      setOrdenActiva(orden);
      localStorage.setItem("ordenActiva", JSON.stringify(orden));
    }
  };

  return (
    <OrdenContext.Provider
      value={{
        ordenes,
        cargarOrdenes,
        ordenSeleccionada,
        setOrdenSeleccionada,
        selectedRepuestos,
        setSelectedRepuestos,
        selectedRepuestosTaller,
        setSelectedRepuestosTaller,
        ordenActiva,
        setOrdenActiva,
        toggleOrdenActiva,
        cargarRepuestosCamioneta,
        repuestosCamioneta,
        cargarRepuestosTaller,
        repuestosTaller,
        setRepuestosCamioneta,
        tiposDeFunciones, 
        cargarTiposFunciones,
        pagos, // Estado de pagos
        cargarPagos, // Nueva función para cargar pagos
      }}
    >
      {children}
    </OrdenContext.Provider>
  );
};

export const useOrden = () => {
  const context = useContext(OrdenContext);
  if (context === undefined) {
    throw new Error("useOrden must be used within an OrdenProvider");
  }
  return context;
};
