const obtenerPorcentajeRepuesto = async (idRepuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/porcentajes/repuestos/${idRepuesto}`);
    const repuesto = await response.json();
    if (repuesto) {
      console.log(`Se encontró un porcentaje de aumento asociado al repuesto id ${idRepuesto}`);
      console.log(repuesto);
      return repuesto;
    } else {
      console.log(`No se encontró ningún porcentaje de aumento asociado al repuesto id ${idRepuesto}`);
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron registros.", error);
  }
};

const guardarPorcentajeRepuesto = async () => {
  const porcentaje = { id_repuesto: 8, porcentaje: 15 };
  try {
    const response = await fetch("http://localhost:8000/porcentajes/repuestos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(porcentaje)
    });
    const result = await response.json();
    if (result) {
      console.log("Porcentaje agregado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el porcentaje no pudo ser agregado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el porcentaje de aumento.", error);
  }
};

const modificarPorcentajeRepuesto = async (id) => {
  const porcentaje = { id_repuesto: 8, porcentaje: 25 };
  try {
    const response = await fetch(`http://localhost:8000/porcentajes/repuestos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(porcentaje)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Porcentaje modificado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el porcentaje no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el porcentaje.", error);
  }
};

const eliminarPorcentajeRepuesto = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/porcentajes/repuestos/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El porcentaje se eliminó correctamente!!");
      return true;
    } else {
      console.log("Se produjo un error, el porcentaje no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el porcentaje.", error);
  }
};