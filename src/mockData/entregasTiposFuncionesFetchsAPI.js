const entregaRevisionFunciones = async (idEntrega) => {
  try {
    const response = await fetch(`http://localhost:8000/revisiones/funciones/${idEntrega}`);
    const funciones = await response.json();
    if (funciones[0] !== undefined) {
      console.log(`Se encontró una lista de revisión de funciones asociada a la entrega id ${idEntrega}`);
      console.log(funciones);
      return funciones;
    } else {
      console.log(`No se encontró ninguna revisión de función con el id ${idEntrega}`);
      return false;
    }
  } catch (error) {
      console.error("Error, revisión no encontrada.", error);
  }
};

const obtenerRevisionFuncion = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/revisiones/${id}`);
    const funcion = await response.json();
    if (funcion) {
      console.log(`Se encontró una revisión de función asociada al id ${id}`);
      console.log(funcion);
      return funcion;
    } else {
      console.log(`No se encontró ninguna revisión de función con el id ${id}`);
      return false;
    }
  } catch (error) {
      console.error("Error, revisión no encontrada.", error);
  }
};
  
const guardarRevisionFuncion = async (revision) => {
  try {
    const response = await fetch("http://localhost:8000/revisiones/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(revision)
    });
    const result = await response.json();
    if (result) {
      console.log("Revisión de función guardada con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la revisión de función no pudo ser guardada...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar la revisión.", error);
  }
};

const modificarRevisionFuncion = async (id, revision) => {
  try {
    const response = await fetch(`http://localhost:8000/revisiones/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(revision)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Revisión de función modificada con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la revisión no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar revisión de función.", error);
  }
};

const eliminarRevisionFuncion = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/revisiones/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("La revisión de la función se eliminó correctamente!!");
      return true;
    } else {
      console.log("Se produjo un error, la revisión de la función no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la revisión de la función.", error);
  }
};