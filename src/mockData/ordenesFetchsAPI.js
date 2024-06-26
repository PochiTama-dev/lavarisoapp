export const ordenes = async () => {
  try {
    const response = await fetch("https://lv-back.online/ordenes");
    const ordenes = await response.json();
    if (ordenes[0] !== undefined) {
      console.log(`Se encontró un listado completo con ${ordenes.length} ordenes!!`);
      console.log(ordenes)
      return ordenes;
    } else {
      console.log('Aún no se registra ninguna orden...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron ordenes en la base de datos....", error);
  }
  };
  
const listadoOrdenes = async () => {
  try {
    const response = await fetch("https://lv-back.online/ordenes/listado");
    const ordenes = await response.json();
    if (ordenes[0] !== undefined) {
      console.log(`Se encontró un listado con ${ordenes.length} ordenes!!`);
      return ordenes;
    } else {
      console.log('Aún no se registra ninguna ordene...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron ordenes en la base de datos....", error);
  }
};
  
const obtenerOrden = async (id) => {
  try {
    const response = await fetch(`https://lv-back.online/ordenes/${id}`);
    const orden = await response.json();
    if (orden) {
      console.log(`Se encontró una orden asociada al id ${id}`);
      return orden;
    } else {
      console.log(`No se encontró ninguna orden con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, orden no encontrado.", error);
  }
};
  
const guardarOrden = async (orden) => {
  try {
    const response = await fetch("https://lv-back.online/ordenes/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden)
    });
    const result = await response.json();
    if (result) {
      console.log("Orden guardada con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la orden no pudo ser guardada...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar la orden.", error);
  }
};
  
const modificarOrden = async (id, orden) => {
  try {
    const response = await fetch(`https://lv-back.online/ordenes/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos de la orden modificados con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la orden no pudo ser modificada...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la orden.", error);
  }
};
  
const eliminarOrden = async (id) => {
  try {
    const response = await fetch(`https://lv-back.online/ordenes/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("La orden se liminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, la orden no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la orden.", error);
  }
};