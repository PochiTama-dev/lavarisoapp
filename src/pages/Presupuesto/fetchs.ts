 
export interface Repuesto {
  id: number;
  codigo_repuesto: string;
  descripcion: string;
 }
 export  interface MedioDePago {
  id: number;
  medio_de_pago: string;
 }
 
 export interface FormaPago {
  id: number;
  medio_de_pago: string;
 }
 
export const fetchPlazosReparacion = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/plazo");
      const plazosData = await response.json();
      if (plazosData.length > 0) {
        return plazosData.map((plazo: { id: any; plazo_reparacion: any; }) => ({
          id: plazo.id,
          texto: plazo.plazo_reparacion,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching repair periods from the database.", error);
      return [];
    }
  };
  
  export const estadosPresupuestos = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/presupuesto");
      const data = await response.json();
      if (data.length > 0) {
        return data.map((item: { id: any; estado_presupuesto: any; }) => ({
          id: item.id,
          texto: item.estado_presupuesto,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error, no se encontraron estados de los presupuestos en la base de datos....", error);
      return [];
    }
  };
  
  export const listaRepuestos = async () => {
    try {
      const response = await fetch("https://lv-back.online/stock/principal/lista");
      const repuestosData = await response.json();
      return repuestosData.length > 0 ? repuestosData : [];
    } catch (error) {
      console.error("Error, no se encontraron repuestos en la base de datos....", error);
      return [];
    }
  };
  
  export const mediosDePago = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/pago");
      const mediosDePago = await response.json();
      return mediosDePago[0] !== undefined ? mediosDePago : [];
    } catch (error) {
      console.error("Error, no se encontraron medios de pago en la base de datos....", error);
      return [];
    }
  };
  
  export const verificarPresupuesto = async (ordenId: any) => {
    try {
      const response = await fetch(`https://lv-back.online/presupuestos/${ordenId}`);
      return await response.json();
    } catch (error) {
      console.error("Error verificando el presupuesto:", error);
      return false;
    }
  };
  interface PresupuestoData {
    id_plazo_reparacion: number;
    observaciones: string;
    repuestos_presupuesto: string;
    firma_cliente: string | undefined;
    firma_empleado: string | undefined;
    total: number; 
    id_orden: string | number;  
  
  }
  export const guardarPresupuesto = async (data: PresupuestoData) => {
    try {
      const response = await fetch("https://lv-back.online/presupuestos/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        console.log("Presupuesto guardado exitosamente.");
      } else {
        console.error("Error al guardar el presupuesto:", response.statusText);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  
  
  export const modificarPresupuesto = async (ordenId: any, data: { id_plazo_reparacion: number; observaciones: string; repuestos_presupuesto: string; firma_cliente: string | undefined; firma_empleado: string | undefined; total: any; id_orden: any; producto: string; }) => {
    try {
      const response = await fetch(`https://lv-back.online/presupuestos/modificar/${ordenId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error("Error modificando el presupuesto:", error);
      throw error;
    }
  };
  
  export const createRepuestoOrden = async (repuestoOrdenData: any) => {
    const API_URL = 'https://lv-back.online/orden/repuestos';  
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(repuestoOrdenData),
      });
      if (!response.ok) throw new Error('Error al agregar repuestos a la orden');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  
  export const getRepuestosOrdenById = async (id: any) => {
    const API_URL = 'https://lv-back.online/orden/repuestos';
  
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener los repuestos de la orden');
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error(error);
      throw error;
    }
  };


 
  export const cancelarOrden = async (ordenId: any) => {
    const response = await fetch(`https://lv-back.online/ordenes/modificar/${ordenId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_tipo_estado: 2, 
      }),
    });
    return response;
  };
  