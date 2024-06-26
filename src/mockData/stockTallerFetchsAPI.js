const listaStockTaller = async () => {
  try {
    const response = await fetch("http://localhost:8000/stock/taller/lista");
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista con ${repuestos.length} ingresos de repuestos al taller!!!`);
      return repuestos;
    } else {
      console.log(`No se encontró ningún repuesto asociado al empleado id ${idEmpleado}`);
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de repuestos.", error);
  }
};

const empleadoStockTaller = async (idEmpleado) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/taller/empleados/${idEmpleado}`);
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

const obtenerRepuestosTaller = async (idRepuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/taller/repuestos/${idRepuesto}`);
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

const guardarStockTaller = async (repuesto) => {
  try {
    const response = await fetch("http://localhost:8000/stock/taller/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    if (result) {
      console.log("Repuesto agregado al stock del taller con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser agregado al stock del taller...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de agregar el repuesto al stock del taller.", error);
  }
};

const modificarStockTaller = async (id, repuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/taller/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Stock del taller modificado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el stock del taller no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el el stock de la camioneta.", error);
  }
};

const eliminarStockTaller = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/taller/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El repuesto se eliminó correctamente del stock del taller!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser eliminado del stock...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el repuesto del stock.", error);
  }
};