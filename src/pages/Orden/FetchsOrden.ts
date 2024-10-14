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


  export const modificarStockPrincipal = async (id: any, repuesto: any) => {
    try {
      const response = await fetch(`https://lv-back.online/stock/principal/modificar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repuesto)
      });
      const result = await response.json();
      console.log(result)
      if (result[0] === 1) {
        console.log("Stock principal modificado con éxito!!!");
        return true;
      } else {
        console.log("Se produjo un error, el stock principal no pudo ser modificado...");
        return false;
      }
    } catch (error) {
      console.error("Error al modificar el el stock principal.", error);
    }
  };


  export const obtenerRepuestosStock = async (idRepuesto: any) => {
    try {
      const response = await fetch(`https://lv-back.online/stock/principal/repuestos/${idRepuesto}`);
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        console.log(`Se encontró una lista de repuestos con el id ${idRepuesto}`);
        return repuestos;
      } else {
        console.log(`No se encontró ningún repuesto con el id ${idRepuesto}`);
        return false;
      }
    } catch (error) {
      console.error("Error, al consultar el stock de repuestos.", error);
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
  
 