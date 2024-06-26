const comprobantes = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/comprobantes/${idOrden}`);
    const comprobantes = await response.json();
    if (comprobantes[0] !== undefined) {
      console.log(`Se encontró un listado con ${comprobantes.length} comprobantes sin revisar!!`);
      console.log(comprobantes)
      return comprobantes;
    } else {
      console.log('Aún no se registran comprobantes...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron comprobantes en la base de datos....", error);
  }
};
    
const listadoComprobantes = async (idOrden) => {
  try {
    const response = await fetch(`http://localhost:8000/comprobantes/listado/${idOrden}`);
    const comprobantes = await response.json();
    if (comprobantes[0] !== undefined) {
      console.log(`Se encontró un listado con ${comprobantes.length} comprobantes!!`);
      console.log(comprobantes)
      return comprobantes;
    } else {
      console.log('Aún no se registran comprobantes...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron comprobantes en la base de datos....", error);
  }
};
      
const obtenerComprobante = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/comprobantes/comprobante/${id}`);
    const comprobante = await response.json();
    if (comprobante) {
      console.log(`Se encontró un comprobante asociada al id ${id}`);
      console.log(comprobante)
      return comprobante;
    } else {
      console.log(`No se encontraron comprobantes con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, comprobante no encontrada.", error);
  }
};
      
const guardarComprobante = async (comprobante) => {
  try {
    const response = await fetch("http://localhost:8000/comprobantes/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comprobante)
    });
    const result = await response.json();
    if (result) {
      console.log("Comprobante guardado con exito!!!");
      console.log(result)
      return true;
    } else {
      console.log("Se produjo un error, el comprobante no se guardó correctamente...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el comprobante.", error);
  }
};
      
const modificarComprobante = async (idComprobante) => {
  try {
    const response = await fetch(`http://localhost:8000/comprobantes/modificar/${idComprobante}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comprobante)
    });
    const result = await response.json();
    if (result[0] > 0) {
      console.log("Comprobante modificado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el comprobante no fué modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el comprobante.", error);
  }
};
      
const eliminarComprobante = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/comprobantes/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("Comprobante eliminado correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el comprobante no pudo ser eliminado...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el comprobante.", error);
  }
};