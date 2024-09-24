// FetchsRepuestos.ts



export const getRepuestosOrdenById = async (id: any) => {
    const API_URL = 'https://lv-back.online/orden/repuestos';
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Error al obtener los repuestos de la orden');
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  export const fetchRepuestos = async (currentEstadoOrden: string, idEmpleado: string) => {
    let url = "";
    if (currentEstadoOrden === "visita") {
      url = `https://lv-back.online/stock/camioneta/empleados/${idEmpleado}`;
    } else {
      url = `https://lv-back.online/stock/principal/lista`;
    }
    
    try {
      const response = await fetch(url);
      const repuestosData = await response.json();
      return repuestosData;
    } catch (error) {
      console.error("Error al consultar el stock de repuestos.", error);
      throw error;
    }
  };

  export const fetchRepuestosDomicilio = async ( idEmpleado: string) => {
    let url = "";
 
      url = `https://lv-back.online/stock/camioneta/empleados/${idEmpleado}`;
  
    try {
      const response = await fetch(url);
      const repuestosData = await response.json();
      return repuestosData;
    } catch (error) {
      console.error("Error al consultar el stock de repuestos.", error);
      throw error;
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
  
  export const modificarStockCamioneta = async (id: number, repuesto: { cantidad: number; }) => {
    try {
      const response = await fetch(`https://lv-back.online/stock/camioneta/modificar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repuesto)
      });
      const result = await response.json();
      if (result[0] === 1) {
        console.log("Stock de la camioneta modificado con éxito!!!");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al modificar el stock de la camioneta.", error);
      throw error;
    }
  };
  
 