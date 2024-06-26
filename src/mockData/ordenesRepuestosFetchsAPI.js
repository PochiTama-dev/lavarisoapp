const obtenerRepuestos = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/ordenes/repuestos/${idOrden}`);
    const repuesto = await response.json();
    if (repuesto[0] !== undefined) {
      console.log(`Se encontró una lista de repuesto asociada al id ${idOrden}`);
      console.log(repuesto);
      return repuesto;
    } else {
      console.log(`No se encontró ningún repuesto con el id ${idOrden}`);
      return false;
    }
  } catch (error) {
      console.error("Error, repuesto no encontrado.", error);
  }
};

const guardarRepuesto = async () => {
  const repuesto = { id_orden: 3, id_repuesto: 1 };
  try {
    const response = await fetch("http://localhost:8000/ordenes/repuestos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    if (result) {
      console.log("Repuesto agregado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser agregado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el repuesto.", error);
  }
};

const modificarRepuesto = async (id) => {
  const repuesto = { id_orden: 3, id_repuesto: 7 };
  try {
    const response = await fetch(`http://localhost:8000/ordenes/repue stos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Repuesto cambiado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser cambiado...");
      return false;
    }
  } catch (error) {
    console.error("Error al cambiar el repuesto.", error);
  }
};

const eliminarRepuesto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/ordenes/repuestos/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El repuesto se eliminó de la orden correctamente!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el repuesto de la orden.", error);
  }
};