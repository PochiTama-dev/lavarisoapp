 
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
      console.log("Datos a enviar:", data); // Log de los datos enviados
      const response = await fetch("https://lv-back.online/presupuestos/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
 
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Presupuesto guardado exitosamente.", responseData);
        return { ok: true, data: responseData };
      } else {
        const errorDetails = await response.text();
        console.error("Error al guardar el presupuesto:", response.statusText);
        console.log("Detalles del error:", errorDetails);
        return { ok: false, error: errorDetails };  
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return { ok: false, error  };  
    }
  };
  export const modificarPresupuesto = async (presupuestoId: any, data: {
    id_plazo_reparacion: number;
    observaciones: string;
    repuestos_presupuesto: string;
    firma_cliente: string | undefined;
    firma_empleado: string | undefined;
    total: any;
    id_orden: any;
    producto: string;
  }) => {
    try {
      const response = await fetch(`https://lv-back.online/presupuestos/modificar/${presupuestoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Error al modificar el presupuesto: ${errorDetails}`);
      }
  
      const responseData = await response.json();
      console.log("Presupuesto modificado exitosamente:", responseData);
  
      // Simplificar validación y retornar con éxito si hay respuesta
      if (responseData) {
        return { ok: true, data: responseData };
      } else {
        throw new Error("Respuesta inesperada del servidor: Datos vacíos.");
      }
    } catch (error) {
      console.error("Error modificando el presupuesto:", error);
      return { ok: false, error };
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
  export const updateRepuestoOrden = async (id_orden: any, { cantidad }: { cantidad: any; }) => {
    const API_URL = `https://lv-back.online/orden/repuestos/${id_orden}`; // Usar id_orden para el PUT
  
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cantidad }), // Solo actualizar la cantidad
      });
  
      if (!response.ok) throw new Error('Error al actualizar el repuesto de la orden');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en updateRepuestoOrden:', error);
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
  
  export const guardarRepuestoOrden = async (ordenId: number, repuestos: { id_repuesto: number }[]) => {
    try {
      const payload = repuestos.map((repuesto) => ({
        id_orden: ordenId,
        id_repuesto: repuesto.id_repuesto, // Solo enviar estos dos campos
      }));
  
      const response = await fetch("https://lv-back.online/ordenes/repuestos/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // Envía un array con los objetos simplificados
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log("Repuestos guardados exitosamente:", result);
        return true;
      } else {
        console.error("Error al guardar los repuestos:", result);
        return false;
      }
    } catch (error) {
      console.error("Error al guardar los repuestos:", error);
      return false;
    }
  };
  
  export const modificarStockPrincipal = async (id: number, repuesto: { cantidad: number; }) => {
    try {
      const response = await fetch(`https://lv-back.online/stock/principal/modificar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repuesto)
      });
      const result = await response.json();
      if (result[0] === 1) {
        console.log("Stock principal modificado con éxito!!!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al modificar el stock principal.", error);
      throw error;
    }
  };
  