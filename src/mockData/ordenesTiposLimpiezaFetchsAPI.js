const obtenerTiposLimpieza = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/ordenes/limpieza/${idOrden}`);
    const limpieza = await response.json();
    if (limpieza[0] !== undefined) {
      console.log(`Se encontró un listado de tipos de limpieza asociado a la orden id ${idOrden}`);
      console.log(limpieza);
      return limpieza;
    } else {
      console.log(`No se encontró ningún tipo de limpieza asociada a la orden con el id ${idOrden}`);
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron registros.", error);
  }
};

const guardarTiposLimpieza = async () => {
  const limpieza = { id_orden: 2, id_tipo_limpieza: 8 };
  try {
    const response = await fetch("http://localhost:8000/ordenes/limpieza/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(limpieza)
    });
    const result = await response.json();
    if (result) {
      console.log("Tipo de limpieza agregado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el tipo de limpieza no pudo ser agregado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el tipo de limpieza.", error);
  }
};

const modificarTiposLimpieza = async (id) => {
  const limpieza = { id_orden: 3, id_tipo_limpieza: 7 };
  try {
    const response = await fetch(`http://localhost:8000/ordenes/limpieza/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(limpieza)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Tipo de limpieza cambiado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el tipo de limpieza no pudo ser cambiado...");
      return false;
    }
  } catch (error) {
    console.error("Error al cambiar el tipo de limpieza.", error);
  }
};

const eliminarTiposLimpieza = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/ordenes/limpieza/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El tipo de limpieza se eliminó de la orden correctamente!!");
      return true;
    } else {
      console.log("Se produjo un error, el tipo de limpieza no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el tipo de limpieza de la orden.", error);
  }
};