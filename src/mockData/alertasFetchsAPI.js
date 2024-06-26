const alertas = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/alertas/${idOrden}`);
    const alertas = await response.json();
    if (alertas[0] !== undefined) {
      console.log(`Se encontró un listado con ${alertas.length} alertas sin revisar!!`);
      console.log(alertas);
      return alertas;
    } else {
      console.log('Aún no se registran alertas...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron alertas en la base de datos....", error);
  }
};

const listadoAlertas = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/alertas/listado/${idOrden}`);
    const alertas = await response.json();
    if (alertas[0] !== undefined) {
      console.log(`Se encontró un listado con ${alertas.length} alertas!!`);
      return alertas;
    } else {
      console.log('Aún no se registran alertas...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron alertas en la base de datos....", error);
  }
};
  
const obtenerAlerta = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/alertas/alerta/${id}`);
    const alerta = await response.json();
    if (alerta) {
      console.log(`Se encontró una alerta asociada al id ${id}`);
      return alerta;
    } else {
      console.log(`No se encontraron alertas con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, alerta no encontrada.", error);
  }
};
  
const guardarAlerta = async (alerta) => {
  try {
    const response = await fetch("http://localhost:8000/alertas/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(alerta)
    });
    const result = await response.json();
    if (result) {
      console.log("Alerta generada con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la alerta no fue generada...");
      return false;
    }
  } catch (error) {
    console.error("Error al generar la alerta.", error);
  }
};
  
const modificarAlerta = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/alertas/modificar/${idOrden}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    console.log(result)
    if (result[0] > 0) {
      console.log("Alertas revisadas!!!");
      return true;
    } else {
      console.log("Se produjo un error, la alerta no fue revisada...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la alerta.", error);
  }
};
  
const eliminarAlerta = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/alertas/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("Alerta eliminada correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, la alerta no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la alerta.", error);
  }
};