 

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
      const response = await fetch("https://lv-back.online/repuestos/lista");
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
  
  export const guardarPresupuesto = async (data: { id_plazo_reparacion: number; observaciones: string; repuestos_presupuesto: string; firma_cliente: string | undefined; firma_empleado: string | undefined; total: any; id_orden: any; producto: string; }) => {
    try {
      const response = await fetch("https://lv-back.online/presupuestos/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error("Error guardando el presupuesto:", error);
      throw error;
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
  
 