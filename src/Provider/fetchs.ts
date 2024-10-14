
export const fetchOrdenes = async () => {
    try {
     const response = await fetch("https://lv-back.online/ordenes");
     const ordenes = await response.json();
     if (ordenes[0] !== undefined) {
      return ordenes;
     } else {
      console.log("Aún no se registra ninguna orden...");
      return [];
     }
    } catch (error) {
     console.error("Error, no se encontraron ordenes en la base de datos....", error);
     return [];
    }
   };


   export const fetchStockPrincipal = async (idEmpleado: string) => {
    let url = "";
   
 
 
      url = `https://lv-back.online/stock/principal/lista`;
   
    try {
      const response = await fetch(url);
      const repuestosData = await response.json();
      return repuestosData;
    } catch (error) {
      console.error("Error al consultar el stock de repuestos.", error);
      throw error;
    }
  };

  export const fetchRepuestosCamioneta = async ( idEmpleado: string) => {
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