const entregaPago = async (idEntrega) => {
  try {
    const response = await fetch(`http://localhost:8000/pagos/entrega/${idEntrega}`);
    const pagos = await response.json();
    if (pagos[0] !== undefined) {
      console.log(`Se encontraron medios de pago asociados a la entrega id ${idEntrega}`);
      console.log(pagos);
      return pagos;
    } else {
      console.log(`No se encontró ningún medio de pago con la entrega id ${idEntrega}`);
      return false;
    }
  } catch (error) {
      console.error("Error, medio de pago no encontrado.", error);
  }
};

const obtenerPago = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/pagos/${id}`);
    const pago = await response.json();
    if (pago) {
      console.log(`Se encontró un medio de pago asociada al id ${id}`);
      console.log(pago);
      return pago;
    } else {
      console.log(`No se encontró ningún medio de pago con el id ${id}`);
      return false;
    }
  } catch (error) {
      console.error("Error, medio de pago no encontrada.", error);
  }
};
  
const guardarPago = async () => {
  const pago = { id_medio_de_pago: 4, id_entrega: 1, importe: 120000, imagen_comprobante: 'Aquí la imagen' }
  try {
    const response = await fetch("http://localhost:8000/pagos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pago)
    });
    const result = await response.json();
    if (result) {
      console.log("Medio de pago registrada con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la entrega no pudo ser registrada...");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar la entrega.", error);
  }
};

const modificarPago = async (id) => {
  const pago = { id_medio_de_pago: 3, id_entrega: 2, importe: 90000, imagen_comprobante: 'Aquí la ruta de la imagen' }
  try {
    const response = await fetch(`http://localhost:8000/pagos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pago)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Medio de pago modificado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el medio de pago no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el medio de pago.", error);
  }
};

const eliminarPago = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/pagos/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El medio de pago se eliminó correctamente!!");
      return true;
    } else {
      console.log("Se produjo un error, el medio de pago no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el medio de pago.", error);
  }
};