const listaCobros = async () => {
  try {
    const response = await fetch("http://localhost:8000/cobros/lista");
    const cobros = await response.json();
    if (cobros[0] !== undefined) {
      console.log(`Se encontró una lista con ${cobros.length} cobros!!`);
      console.log(cobros);
      return cobros;
    } else {
      console.log('Aún no se registra ningún cobro...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron cobros en la base de datos....", error);
  }
};

const clienteCobros = async (idCliente) => {
  try {
    const response = await fetch(`http://localhost:8000/cobros/cliente/${idCliente}`);
    const cobros = await response.json();
    if (cobros) {
      console.log(`Se encontraron ${cobros.length} cobros asociados al cliente con id ${idCliente}`);
      console.log(cobros);
      return cobros;
    } else {
      console.log(`No se encontró ningún cobro con el cliente id ${idCliente}`);
      return false;
    }
  } catch (error) {
      console.error("Error, cobros no encontrados.", error);
  }
};

const obtenerCobro = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/cobros/${id}`);
    const cobro = await response.json();
    if (cobro) {
      console.log(`Se encontró un cobro asociado al id ${id}`);
      console.log(cobro);
      return cobro;
    } else {
      console.log(`No se encontró ningún cobro con el id ${id}`);
      return false;
    }
  } catch (error) {
      console.error("Error, cobro no encontrado.", error);
  }
};

const guardarCobro = async (cobro) => {
  try {
    const response = await fetch("http://localhost:8000/cobros/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cobro)
    });
    const result = await response.json();
    if (result) { 
      console.log("Cobro registrado con exito!!!");
      console.log(result);
      return true;
    } else {
      console.log("Se produjo un error, el cobro no pudo ser registrado...");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar el cobro.", error);
  }
};

const modificarCobro = async (id, cobro) => {
  try {
    const response = await fetch(`http://localhost:8000/cobros/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cobro)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Cobro modificado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el cobro no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el evento.", error);
  }
};

const eliminarCobro = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/cobros/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El cobro se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el cobro no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el cobro.", error);
  }
};