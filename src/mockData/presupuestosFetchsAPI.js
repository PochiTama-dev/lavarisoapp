const presupuestos = async () => {
  try {
    const response = await fetch("http://localhost:8000/presupuestos");
    const presupuestos = await response.json();
    if (presupuestos[0] !== undefined) {
      console.log(`Se encontró un listado completo con ${presupuestos.length} presupuestos!!`);
      console.log(presupuestos)
      return presupuestos;
    } else {
      console.log('Aún no se registra ningún presupuesto...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron presupuestos en la base de datos....", error);
  }
  };
  
const listadoPresupuestos = async () => {
  try {
    const response = await fetch("http://localhost:8000/presupuestos/listado");
    const presupuestos = await response.json();
    if (presupuestos[0] !== undefined) {
      console.log(`Se encontró un listado con ${presupuestos.length} presupuestos!!`);
      return presupuestos;
    } else {
      console.log('Aún no se registra ningún presupuesto...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron presupuestos en la base de datos....", error);
  }
};
  
export const obtenerPresupuesto = async (id) => {
  try {
    const response = await fetch(`https://lv-back.online/presupuestos/${id}`);
    const presupuesto = await response.json();
    if (presupuesto) {
      console.log(`Se encontró un presupuesto asociado al id ${id}`);
      return presupuesto;
    } else {
      console.log(`No se encontró ningún presupuesto con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, presupuesto no encontrado.", error);
  }
};
  
const guardarPresupuesto = async (presupuesto) => {
  try {
    const response = await fetch("http://localhost:8000/presupuestos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(presupuesto)
    });
    const result = await response.json();
    if (result) {
      console.log("Presupuesto guardado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la presupuesto no pudo ser guardado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el presupuesto...", error);
  }
};
  
const modificarPresupuesto = async (id, presupuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/presupuestos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(presupuesto)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos del presupuesto modificados con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el presupuesto no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el presupuesto...", error);
  }
};
  
const eliminarPresupuesto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/presupuestos/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El presupuesto se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el presupuesto no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el presupuesto.", error);
  }
};