const listadoFeedbacks = async () => {
  try {
    const response = await fetch("http://localhost:8000/feedbacks/listado");
    const feedbacks = await response.json();
    if (feedbacks[0] !== undefined) {
      console.log(`Se encontró un listado con ${feedbacks.length} feedbacks!!`);
      console.log(feedbacks);
      return feedbacks;
    } else {
      console.log('Aún no se registra ningún feedback...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron feedbacks en la base de datos....", error);
  }
};

const obtenerFeedback = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/feedbacks/${idOrden}`);
    const feedback = await response.json();
    if (feedback) {
      console.log(`Se encontró un feedback asociado a la orden id ${idOrden}`);
      console.log(feedback);
      return feedback;
    } else {
      console.log(`No se encontró ningún feedback con la orden id ${idOrden}`);
      return false;
    }
  } catch (error) {
      console.error("Error feedback no encontrado.", error);
  }
};

const guardarFeedback = async (feedback) => {
  try {
    const response = await fetch("http://localhost:8000/feedbacks/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback)
    });
    const result = await response.json();
    if (result) {
      console.log("Feedback guardado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el feedback no pudo ser agendado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el feedback.", error);
  }
};

const modificarFeedback = async (idOrden, feedback) => {
  try {
    const response = await fetch(`http://localhost:8000/feedbacks/modificar/${idOrden}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Feedback modificado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el feedback no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el feedback.", error);
  }
};

const eliminarFeedback = async (idFeedback) => {
  try {
    const response = await fetch(`http://localhost:8000/feedbacks/eliminar/${idFeedback}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El feedback se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el feedback no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el feedback.", error);
  }
};