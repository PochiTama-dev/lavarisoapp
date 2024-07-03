const libroIva = async () => {
  try {
    const response = await fetch("http://localhost:8000/libro");
    const movimientos = await response.json();
    if (movimientos[0] !== undefined) {
      console.log(`Se encontró un listado completo con ${movimientos.length} movimientos!!`);
      console.log(movimientos)
      return movimientos;
    } else {
      console.log('Aún no se registran movimientos en el libro IVA...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron movimientos en la base de datos....", error);
  }
  };
  
const listadoMovimientos = async (idCaja) => {
  try {
    const response = await fetch(`http://localhost:8000/libro/cajas/${idCaja}`);
    const movimientos = await response.json();
    if (movimientos[0] !== undefined) {
      console.log(`Se encontró un listado con ${movimientos.length} movimientos!!`);
      console.log(movimientos)
      return movimientos;
    } else {
      console.log('Aún no se registra ninguna movimiento...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron movimientos en la base de datos....", error);
  }
};
  
const obtenerMovimiento = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/libro/${id}`);
    const movimiento = await response.json();
    if (movimiento) {
      console.log(`Se encontró un movimiento registrado asociado al id ${id}`);
      console.log(movimiento)
      return movimiento;
    } else {
      console.log(`No se encontró ningún movimiento registrado con el id ${id}`);
      return false;
    }
  } catch (error) {
    console.error("Error, movimiento no encontrado.", error);
  }
};
  
const guardarMovimiento = async () => {
  const movimiento = {
    fecha: '13/05/2024', 
    id_caja: null, 
    comprobante: 'Un comprobante', 
    cuenta: null, 
    cuit: null, 
    monotributo: null, 
    gravado: 2760, 
    iva: 2920, 
    exento: 560, 
    no_gravado: 1030,
    retenciones: 741,
    total: 20000
  }
  try {
    const response = await fetch("http://localhost:8000/libro/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movimiento)
    });
    const result = await response.json();
    if (result) {
      console.log("Movimiento registrado con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el movimiento no pudo ser registrado...");
      return false;
    }
  } catch (error) {
    console.error("Error al guardar el movimiento.", error);
  }
};
  
const modificarMovimiento = async (id) => {
  const movimiento = {
    fecha: '08/05/2024', 
    id_caja: null, 
    comprobante: 'Un comprobante', 
    cuenta: null, 
    cuit: null, 
    monotributo: null, 
    gravado: 2760, 
    iva: 2920, 
    exento: 560, 
    no_gravado: 1030,
    retenciones: 741,
    total: 4310
  }
  try {
    const response = await fetch(`http://localhost:8000/libro/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movimiento)
    });
    const result = await response.json();
    if (result[0] === 1) {
      console.log("Datos del movimiento modificados con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el movimiento no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el movimiento.", error);
  }
};
  
const eliminarMovimiento = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/libro/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("El movimiento se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, el movimiento no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar el movimiento.", error);
  }
};