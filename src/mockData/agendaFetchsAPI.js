const listaEventos = async () => {
  try {
    const response = await fetch("http://localhost:8000/agenda/lista");
    const eventos = await response.json();
    if (eventos[0] !== undefined) {
      console.log(`Se encontró un listado con ${eventos.length} eventos!!`);
      console.log(eventos);
      return eventos;
    } else {
      console.log('Aún no se registra ningún evento...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron eventos en la base de datos....", error);
  }
};

const obtenerEvento = async (idCliente) => {
  try {
    const response = await fetch(`http://localhost:8000/agenda/${idCliente}`);
    const evento = await response.json();
    if (evento) {
      console.log(`Se encontró un evento asociado al cliente id ${idCliente}`);
      console.log(evento);
      return evento;
    } else {
      console.log(`No se encontró ningún evento con el cliente id ${idCliente}`);
      return false;
    }
  } catch (error) {
      console.error("Error, evento no encontrado.", error);
  }
};

const guardarEvento = async (evento) => {
  try {
    const response = await fetch("http://localhost:8000/agenda/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento)
    });
    const result = await response.json();
    if (result) {
      console.log("Evento agendado con exito!!!");
      console.log(result);
      return true;
    } else {
      console.log("Se produjo un error, el evento no pudo ser agendado...");
      return false;
    }
  } catch (error) {
    console.error("Error al agendar el evento.", error);
  }
};

const modificarEvento = async (idCliente, evento) => {
  try {
    const response = await fetch(`http://localhost:8000/agenda/modificar/${idCliente}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Evento modificado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el evento no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el evento.", error);
  }
};

const eliminarEvento = async (idCliente) => {
  try {
    const response = await fetch(`http://localhost:8000/agenda/eliminar/${idCliente}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El evento se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el evento no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el evento.", error);
  }
};