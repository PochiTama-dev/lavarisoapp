export const ordenEntrega = async (idOrden: any) => {
  try {
    const response = await fetch(
      `http://lv-back.online/entregas/orden/${idOrden}`
    );
    const entrega = await response.json();
    if (entrega) {
      console.log(`Se encontró una entrega asociada a la órden id ${idOrden}`);
      console.log(entrega);
      return entrega;
    } else {
      console.log(
        `No se encontró ninguna entrega asociada a la órden id ${idOrden}`
      );
      return false;
    }
  } catch (error) {
    console.error("Error, entrega no encontrada.", error);
  }
};

const obtenerEntrega = async (id: any) => {
  try {
    const response = await fetch(`http://localhost:8000/entregas/orden/${id}`);
    const entrega = await response.json();
    if (entrega) {
      console.log(`Se encontró una entrega asociada al id ${id}`);
      console.log(entrega);
      return entrega;
    } else {
      console.log(`No se encontró ninguna entrega con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, entrega no encontrada.", error);
  }
};

const guardarEntrega = async () => {
  const entrega = {
    id_orden: 3,
    firma_cliente: "firma cliente",
    firma_empleado: "firma empleado",
    recomienda: 0,
  };
  try {
    const response = await fetch("http://localhost:8000/entregas/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entrega),
    });
    const result = await response.json();
    if (result) {
      console.log("Entrega registrada con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la entrega no pudo ser registrada...");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar la entrega.", error);
  }
};

export const modificarEntrega = async (id: any, idOrden: any) => {
  
  const entrega = {
    id_orden: idOrden, // Aquí se pasa el ID correcto de la orden
    firma_cliente: "firma cliente",
    firma_empleado: "firma empleado",
    recomienda: 1,
  };
  try {
    const response = await fetch(
      `https://lv-back.online/entregas/modificar/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrega),
      }
    );
    const result = await response.json();
    console.log(result);
    if (result[0] === 1) {
      console.log("Entrega modificada con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la entrega no pudo ser modificada...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar la entrega.", error);
  }
};

const eliminarEntrega = async (id: any) => {
  try {
    const response = await fetch(
      `http://localhost:8000/entregas/eliminar/${id}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );
    const result = await response.json();
    if (result === 1) {
      console.log("El registro de entrega se eliminó correctamente!!");
      return true;
    } else {
      console.log(
        "Se produjo un error, el registro de entrega no pudo ser eliminada..."
      );
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el registro de entrega.", error);
  }
};
