const listadoGastos = async () => {
  try {
    const response = await fetch("http://localhost:8000/gastos/listado");
    const gastos = await response.json();
    if (gastos[0] !== undefined) {
      console.log(`Se encontró un listado con ${gastos.length} gastos declarados!!`);
      console.log(gastos);
      return gastos;
    } else {
      console.log('Aún no se declaró ningún gasto...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron gastos declarados en la base de datos....", error);
  }
};

const proveedorGastos = async (idProveedor) => {
  try {
    const response = await fetch(`http://localhost:8000/gastos/proveedor/${idProveedor}`);
    const gastos = await response.json();
    if (gastos) {
      console.log(`Se encontraron ${gastos.length} gastos asociados al proveedor con id ${idProveedor}`);
      console.log(gastos);
      return gastos;
    } else {
      console.log(`No se encontró ningún gasto con el proveedor id ${idProveedor}`);
      return false;
    }
  } catch (error) {
      console.error("Error, gastos no encontrados.", error);
  }
};

const obtenerGasto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/gastos/${id}`);
    const gasto = await response.json();
    if (gasto) {
      console.log(`Se encontró un gasto declarado asociado al id ${id}`);
      console.log(gasto);
      return gasto;
    } else {
      console.log(`No se encontró ningún gasto declarado con el id ${id}`);
      return false;
    }
  } catch (error) {
      console.error("Error, gasto no declarado.", error);
  }
};

const guardarGasto = async (gasto) => {
  try {
    const response = await fetch("http://localhost:8000/gastos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gasto)
    });
    const result = await response.json();
    if (result) {
      console.log("Gasto declarado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el gasto no pudo ser registrado...");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar el gasto.", error);
  }
};

const modificarGasto = async (id, gasto) => {
  try {
    const response = await fetch(`http://localhost:8000/gastos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gasto)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Gasto modificado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el gasto no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el evento.", error);
  }
};

const eliminarGasto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/gastos/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El gasto se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el gasto no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el gasto.", error);
  }
};