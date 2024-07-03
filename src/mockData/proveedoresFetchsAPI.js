const proveedores = async () => {
  try {
    const response = await fetch("http://localhost:8000/proveedores");
    const proveedores = await response.json();
    if (proveedores[0] !== undefined) {
      console.log(`Se encontró un listado completo con ${proveedores.length} proveedores!!`);
      return proveedores;
    } else {
      console.log('Aún no se registra ningún proveedor...');
      return false;
    }
  } catch (error) {
      console.error("Error, no se encontraron proveedores en la base de datos....", error);
  }
};

const listaProveedores = async () => {
  try {
    const response = await fetch("http://localhost:8000/proveedores/lista");
    const proveedores = await response.json();
    if (proveedores[0] !== undefined) {
      console.log(`Se encontró un listado con ${proveedores.length} proveedores!!`);
      return proveedores;
    } else {
      console.log('Aún no se registra ningún proveedor...');
      return false;
    }
  } catch (error) {
      console.error("Error, no se encontraron proveedores en la base de datos....", error);
  }
};

const obtenerProveedor = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/proveedores/${id}`);
    const proveedor = await response.json();
    if (proveedor) {
      console.log(`Se encontró un registro asociado al id ${id}`);
      return proveedor;
    } else {
      console.log(`No se encontró ningún proveedor con el id ${id}`);
      return false;
    }
  } catch (error) {
      console.error("Error, proveedor no encontrado.", error);
  }
};

const guardarProveedor = async (proveedor) => {
  try {
    const response = await fetch("http://localhost:8000/proveedores/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor)
    });
    const result = await response.json();
    if (result) {
      console.log("Proveedor guardado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el proveedor no pudo ser guardado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el proveedor.", error);
  }
};

const modificarProveedor = async (id, proveedor) => {
  try {
    const response = await fetch(`http://localhost:8000/proveedores/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos del proveedor modificados con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el proveedor no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el proveedor.", error);
  }
};

const eliminarProveedor = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/proveedores/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El proveedor se liminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el proveedor no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el proveedor.", error);
  }
};