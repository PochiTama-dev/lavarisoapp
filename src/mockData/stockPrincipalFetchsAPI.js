const listaStockPrincipal = async () => {
  try {
    const response = await fetch("http://localhost:8000/stock/principal/lista");
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

const proveedorStockPrincipal = async (idProveedor) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/principal/proveedores/${idProveedor}`);
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista de repuestos asociada al proveedor id ${idProveedor}`);
      return repuestos;
    } else {
      console.log(`No se encontró ningún repuesto asociado al proveedor id ${idProveedor}`);
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock principal de repuestos.", error);
  }
};

const obtenerRepuestosStock = async (idRepuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/principal/repuestos/${idRepuesto}`);
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

const guardarStockPrincipal = async (repuesto) => {
  try {
    const response = await fetch("http://localhost:8000/stock/principal/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    if (result) {
      console.log("Repuesto agregado al stock principal con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser agregado al stock principal...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de agregar el repuesto al stock principal.", error);
  }
};

const modificarStockPrincipal = async (id, repuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/principal/modificar/${id}`, {
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

const eliminarStockPrincipal = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/principal/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El repuesto se eliminó correctamente del stock principal!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser eliminado del stock...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el repuesto del stock.", error);
  }
};