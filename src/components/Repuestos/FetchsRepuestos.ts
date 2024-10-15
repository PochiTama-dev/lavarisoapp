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
  
  export const listaStockPrincipal = async () => {
    try {
      const response = await fetch("https://lv-back.online/stock/principal/lista");
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        console.log(`Se encontró una lista con ${repuestos.length} ingreso de repuestos!!!`);
        return repuestos;
      } else {
        console.log('No se encontró ningún repuesto...');
        return false;
      }
    } catch (error) {
      console.error("Error, al consultar el stock principal de repuestos.", error);
    }
  };
  
  export const guardarStockReserva = async (repuesto: any) => {
    try {
      const response = await fetch("https://lv-back.online/stock/reserva/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repuesto)
      });
      const result = await response.json();
      if (result) {
        console.log("El repuesto se reservó con exito!!!");
        return true;
      } else {
        console.log("Se produjo un error, el repuesto no pudo ser reservado...");
        return false;
      }
    } catch (error) {
      console.error("Error al tratar de reservar el repuesto.", error);
    }
  };
  




  export const listaStockReserva = async () => {
    try {
      const response = await fetch("https://lv-back.online/stock/reserva/lista");
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        console.log(`Se encontró una lista con ${repuestos.length} ingresos de repuestos al stock de reserva.`);
        return repuestos;
      } else {
        console.log('No se encontró ningún repuesto en el stock de reserva.');
        return false;
      }
    } catch (error) {
      console.error("Error, al consultar el stock de reserva de repuestos.", error);
    }
  };
  
  export  const tecnicoStockReserva = async (idEmpleado: any) => {
    try {
      const response = await fetch(`https://lv-back.online/stock/reserva/tecnicos/${idEmpleado}`);
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        console.log(`Se encontró una lista de repuestos asociada a la orden id ${idEmpleado}`);
        return repuestos;
      } else {
        console.log(`No se encontró ningún repuesto asociado a la orden id ${idEmpleado}`);
        return false;
      }
    } catch (error) {
      console.error("Error, al consultar el stock de reserva de repuestos.", error);
    }
  };
  export const eliminarStockReserva = async (id: any) => {
    try {
      const response = await fetch(`https://lv-back.online/stock/reserva/eliminar/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      const result = await response.json();
      if (result === 1) {
        console.log("El repuesto se eliminó correctamente del stock de reservas!!");
        return true;
      } else {
        console.log("Se produjo un error, el repuesto no pudo ser eliminado del stock de reservas...");
        return false;
      }
    } catch (error) {
      console.error("Error al tratar de eliminar el repuesto del stock.", error);
    }
  };

  export const guardarStockCamioneta = async (repuesto: { nombre: string; cantidad: number }) => {
    try {
      const response = await fetch("https://lv-back.online/stock/camioneta/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(repuesto),
      });
      const result = await response.json();
      if (result) {
        console.log("Repuesto agregado al stock de la camioneta con éxito!!!");
        return true;
      } else {
        console.log("Se produjo un error, el repuesto no pudo ser agregado al stock de la camioneta...");
        return false;
      }
    } catch (error) {
      console.error("Error al tratar de agregar el repuesto al stock de la camioneta.", error);
      return false;
    }
  };