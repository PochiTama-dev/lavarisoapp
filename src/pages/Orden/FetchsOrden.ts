// FetchsOrden.ts

export const fetchEstadosPresupuestos = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/presupuesto");
      const data = await response.json();
      return data.map((item: { id: any; estado_presupuesto: any }) => ({
        id: item.id,
        texto: item.estado_presupuesto,
      }));
    } catch (error) {
      console.error("Error al cargar estados de presupuestos:", error);
      return [];
    }
  };
  
  export const fetchTiposFunciones = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/funcion");
      const funciones = await response.json();
      return funciones.map((funcion: { tipo_funcion: string }) => funcion.tipo_funcion);
    } catch (error) {
      console.error("Error al cargar tipos de funciones:", error);
      return [];
    }
  };
  
  export const tiposLimpieza = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/limpieza");
      const limpieza = await response.json();
      return limpieza.map((item: { tipo_limpieza: string }) => item.tipo_limpieza);
    } catch (error) {
      console.error("Error al cargar tipos de limpieza:", error);
      return [];
    }
  };
  
  export const tiposCierresExtendidos = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/cierre");
      const cierres = await response.json();
      return cierres;
    } catch (error) {
      console.error("Error al cargar tipos de cierres extendidos:", error);
      return [];
    }
  };
  

  export const modificarOrden = async (ordenId: any, orden: any) => {
    try {
      const response = await fetch(`https://lv-back.online/ordenes/modificar/${ordenId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orden),
      });
      const result = await response.json();
      return result[0] === 1;
    } catch (error) {
      console.error("Error al modificar la orden:", error);
    }
  };
  
  export const modificarPresupuesto = async (presupuestoId: any, presupuesto: any) => {
    try {
      const response = await fetch(`https://lv-back.online/presupuestos/modificar/${presupuestoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presupuesto),
      });
      const result = await response.json();
      return result[0] === 1;
    } catch (error) {
      console.error("Error al modificar el presupuesto:", error);
    }
  };