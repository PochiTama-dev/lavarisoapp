const listaRepuestos = async () => {
  try {
    const response = await fetch("http://localhost:8000/repuestos/lista");
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró un listado con ${repuestos.length} repuestos!!`);
      return repuestos;
    } else {
      console.log('Aún no se registra ningún repuesto...');
      return false;
    }
  } catch (error) {
      console.error("Error, no se encontraron repuestos en la base de datos....", error);
  }
};
  
const obtenerRepuesto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/repuestos/${id}`);
    const repuesto = await response.json();
    if (repuesto) {
      console.log(`Se encontró un registro asociado al id ${id}`);
      return repuesto;
    } else {
      console.log(`No se encontró ningún repuesto con el id ${id}`);
      return false;
    }
  } catch (error) {
      console.error("Error, repuesto no encontrado.", error);
  }
};
  
const guardarRepuesto = async () => {
  try {
    const response = await fetch("http://localhost:8000/repuestos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    if (result) {
      console.log("Repuesto guardado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser guardado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el repuesto.", error);
  }
};
  
const modificarRepuesto = async (id, repuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/repuestos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos del repuesto modificados con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el repuesto.", error);
  }
};

const eliminarRepuesto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/repuestos/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El repuesto se liminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el repuesto.", error);
  }
};