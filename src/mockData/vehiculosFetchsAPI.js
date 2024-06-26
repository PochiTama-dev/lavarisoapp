const listaVehiculos = async () => {
  try {
    const response = await fetch("http://localhost:8000/vehiculos/lista");
    const vehiculos = await response.json();
    if (vehiculos[0] !== undefined) {
      console.log(`Se encontró un listado con ${vehiculos.length} vehículos!!`);
      return vehiculos;
    } else {
      console.log('Aún no se registra ningún vehículo...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron vehículos en la base de datos....", error);
  }
};

const obtenerVehiculo = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/vehiculos/${id}`);
    const vehiculo = await response.json();
    if (vehiculo) {
      console.log(`Se encontró un vehículo asociado al id ${id}`);
      return vehiculo;
    } else {
      console.log(`No se encontró ningún vehículo con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, vehículo no encontrado.", error);
  }
};

const guardarVehiculo = async (vehiculo) => {
  try {
    const response = await fetch("http://localhost:8000/vehiculos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehiculo)
    });
    const result = await response.json();
    if (result) {
      console.log("Vehículo guardado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el vehículo no pudo ser guardado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el vehículo.", error);
  }
};

const modificarVehiculo = async (id, vehiculo) => {
  try {
    const response = await fetch(`http://localhost:8000/vehiculos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehiculo)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos del vehículo modificados con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el vehículo no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el vehículo.", error);
  }
};

const eliminarVehiculo = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/vehiculos/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El vehículo se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el vehículo no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el vehículo.", error);
  }
};