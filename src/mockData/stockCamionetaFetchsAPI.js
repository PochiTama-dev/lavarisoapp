const listaStockCamioneta = async () => {
  try {
    const response = await fetch("http://localhost:8000/stock/camioneta/lista");
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista con ${repuestos.length} ingresos de repuestos`);
      return repuestos;
    } else {
      console.log("No se encontró ningún repuesto en el stock de camioneta");
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de repuestos.", error);
  }
};

const empleadoStockCamioneta = async (idEmpleado) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/camioneta/empleados/${idEmpleado}`);
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista de repuestos asociada al empleado id ${idEmpleado}`);
      return repuestos;
    } else {
      console.log(`No se encontró ningún repuesto asociado al empleado id ${idEmpleado}`);
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de repuestos.", error);
  }
};

const obtenerRepuestosCamioneta = async (idRepuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/camioneta/repuestos/${idRepuesto}`);
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista de repuestos con el id ${idRepuesto}`);
      return repuestos;
    } else {
      console.log(`No se encontró ningún repuesto asociado al id ${idRepuesto}`);
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de repuestos.", error);
  }
};

const guardarStockCamioneta = async (repuesto) => {
  try {
    const response = await fetch("http://localhost:8000/stock/camioneta/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    if (result) {
      console.log("Repuesto agregado al stock la camioneta con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser agregado al stock de la camioneta...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de agregar el repuesto al stock de la camioneta.", error);
  }
};

const modificarStockCamioneta = async (id, repuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/camioneta/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Stock de la camioneta modificado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el stock de la camioneta no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el el stock de la camioneta.", error);
  }
};

const eliminarStockCamioneta = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/camioneta/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El repuesto se eliminó correctamente del stock de la camioneta!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser eliminado del stock...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el repuesto del stock.", error);
  }
};