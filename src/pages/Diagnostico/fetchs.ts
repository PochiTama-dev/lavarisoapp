 
export interface Orden {
    cliente: any;
    id: number;
    equipo: string;
    marca: string;
    modelo: string;
    id_cliente: number;
    diagnostico?: string;
    motivo?: string;
  }
  
  export interface Cliente {
    numero_cliente: string;
  }
  
  export const modificarOrden = async (id: number, orden: Partial<Orden>) => {
    try {
      const response = await fetch(`https://lv-back.online/ordenes/modificar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orden),
      });
      const result = await response.json();
      return result[0] === 1;
    } catch (error) {
      console.error("Error al modificar la orden.", error);
      return false;
    }
  };
  
  export const fetchTiposFunciones = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/funcion");
      const funciones = await response.json();
      return funciones.map((funcion: { tipo_funcion: string }) => funcion.tipo_funcion) || [];
    } catch (error) {
      console.error("Error al obtener tipos de funciones:", error);
      return [];
    }
  };
  
  export const fetchOrden = async (id: number) => {
    try {
      const ordenResponse = await fetch(`https://lv-back.online/ordenes/${id}`);
      if (!ordenResponse.ok) throw new Error("Error al obtener datos de la API");
  
      const orden = await ordenResponse.json();
      if (orden) {
        const clienteResponse = await fetch(`https://lv-back.online/clientes/${orden.id_cliente}`);
        const cliente = await clienteResponse.json();
        return { ...orden, cliente } as Orden & { cliente: Cliente };
      }
      return null;
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return null;
    }
  };
  

  export const listaReparaciones = async () => {
    try {
      const response = await fetch("https://lv-back.online/reparaciones/lista");
      const reparaciones = await response.json();
      if (reparaciones.length > 0) {
        console.log(`Se encontró un listado con ${reparaciones.length} reparaciones!!`);
        return reparaciones;
      } else {
        console.log('Aún no se registra ninguna reparación...');
        return false;
      }
    } catch (error) {
        console.error("Error, no se encontraron reparaciones en la base de datos....", error);
    }
  };
  
  export const getFotosNumeroOrden = async (numero_orden: any) => {
    try {
        const response = await fetch(`https://lv-back.online/fotos/orden/${numero_orden}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener las fotos');
        }

        const data = await response.json();
        return data; // Esto es un array de fotos filtradas por numero_orden
    } catch (error) {
        console.error('Error al obtener las fotos:', error);
        return [];
    }
};