const listaStockReserva = async () => {
  try {
    const response = await fetch("http://localhost:8000/stock/reserva/lista");
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista con ${repuestos.length} ingresos de repuestos al stock de reserva.`);
      return repuestos;
    } else {
      console.log('No se encontró ningún repuesto en el stock de reserva.');
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de reserva de repuestos.", error);
  }
};

const ordenStockReserva = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/reserva/ordenes/${idOrden}`);
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista de repuestos asociada a la orden id ${idOrden}`);
      return repuestos;
    } else {
      console.log(`No se encontró ningún repuesto asociado a la orden id ${idOrden}`);
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de reserva de repuestos.", error);
  }
};

const repuestosStockReserva = async (idRepuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/reserva/repuestos/${idRepuesto}`);
    const repuestos = await response.json();
    if (repuestos[0] !== undefined) {
      console.log(`Se encontró una lista de repuestos reservados con el id ${idRepuesto}`);
      return repuestos;
    } else {
      console.log(`No se encontró ningún repuesto con el id ${idRepuesto}`);
      return false;
    }
  } catch (error) {
    console.error("Error, al consultar el stock de repuestos.", error);
  }
};

const guardarStockReserva = async (repuesto) => {
  try {
    const response = await fetch("http://localhost:8000/stock/reserva/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    if (result) {
      console.log("El repuesto se reservó con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser reservado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de reservar el repuesto.", error);
  }
};

const modificarStockReserva = async (id, repuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/reserva/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(repuesto)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Stock de reservas modificado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el stock de reservas no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el el stock de reservas.", error);
  }
};

const eliminarStockReserva = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/stock/reserva/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El repuesto se eliminó correctamente del stock de reservas!!");
      return true;
    } else {
      console.log("Se produjo un error, el repuesto no pudo ser eliminado del stock de reservas...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el repuesto del stock.", error);
  }
};