const notificaciones = async (idEmpleado) => {
  try {
    const response = await fetch(`http://localhost:8000/notificaciones/${idEmpleado}`);
    const notificaciones = await response.json();
    if (notificaciones[0] !== undefined) {
      console.log(`Se encontró un listado con ${notificaciones.length} notificaciones sin revisar!!`);
      console.log(notificaciones)
      return notificaciones;
    } else {
      console.log('Aún no se registran notificaciones...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron notificaciones en la base de datos....", error);
  }
};
  
  const listadoNotificaciones = async (idEmpleado) => {
  try {
    const response = await fetch(`http://localhost:8000/notificaciones/listado/${idEmpleado}`);
    const notificaciones = await response.json();
    if (notificaciones[0] !== undefined) {
      console.log(`Se encontró un listado con ${notificaciones.length} notificaciones!!`);
      console.log(notificaciones)
      return notificaciones;
    } else {
      console.log('Aún no se registran notificaciones...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron notificaciones en la base de datos....", error);
  }
};
    
const obtenerNotificacion = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/notificaciones/notificacion/${id}`);
    const notificacion = await response.json();
    if (notificacion) {
      console.log(`Se encontró una notificacion asociada al id ${id}`);
      console.log(notificacion)
      return notificacion;
    } else {
      console.log(`No se encontraron notificaciones con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, notificacion no encontrada.", error);
  }
};
    
const guardarNotificacion = async () => {
  const notificacion = { id_tipo_notificacion: 3, id_empleado: 1 }
  try {
    const response = await fetch("http://localhost:8000/notificaciones/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notificacion)
    });
    const result = await response.json();
    if (result) {
      console.log("Notificacion generada con exito!!!");
      console.log(result)
      return true;
    } else {
      console.log("Se produjo un error, la notificacion no fue generada...");
      return false;
    }
  } catch (error) {
    console.error("Error al generar la notificacion.", error);
  }
};
    
const modificarNotificaciones = async (idEmpleado) => {
  try {
    const response = await fetch(`http://localhost:8000/notificaciones/modificar/${idEmpleado}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result[0] > 0) {
      console.log("Notificaciones revisadas!!!");
      return true;
    } else {
      console.log("Se produjo un error, la notificacion no fue revisada...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la notificacion.", error);
  }
};
    
const eliminarNotificacion = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/notificaciones/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("Notificacion eliminada correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, la notificacion no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la notificacion.", error);
  }
};