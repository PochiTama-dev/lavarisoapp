const listaFacturas = async () => {
  try {
    const response = await fetch("http://localhost:8000/facturas/lista");
    const facturas = await response.json();
    if (facturas[0] !== undefined) {
      console.log(`Se encontró un listado con ${facturas.length} facturas!!`);
      console.log(facturas);
      return facturas;
    } else {
      console.log('Aún no se registra ninguna factura...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron faacturas en la base de datos....", error);
  }
};
  
const proveedoresFacturas = async (idProveedor) => {
  try {
    const response = await fetch(`http://localhost:8000/facturas/proveedor/${idProveedor}`);
    const facturas = await response.json();
    if (facturas[0] !== undefined) {
      console.log(`Se encontraron ${facturas.length} facturas asociados al proveedor con id ${idProveedor}`);
      console.log(facturas);
      return facturas;
    } else {
      console.log(`No se encontraron facturas con el proveedor id ${idProveedor}`);
      return false;
    }
  } catch (error) {
      console.error("Error, facturas no encontrados.", error);
  }
};

const obtenerFactura = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/facturas/${id}`);
    const factura = await response.json();
    if (factura) {
      console.log(`Se encontró un factura asociado al id ${id}`);
      console.log(factura);
      return factura;
    } else {
      console.log(`No se encontró ningún factura con el id ${id}`);
      return false;
    }
  } catch (error) {
      console.error("Error, factura no encontrado.", error);
  }
};

const guardarFactura = async (factura) => {
  try {
    const response = await fetch("http://localhost:8000/facturas/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(factura)
    });
    const result = await response.json();
    if (result) {
      console.log("Factura cargada con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la factura no se cargo correctamente...");
      return false;
    }
  } catch (error) {
    console.error("Error al cargar la factura.", error);
  }
};

const modificarFactura = async (id, factura) => {
  try {
    const response = await fetch(`http://localhost:8000/facturas/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(factura)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Datos modificados con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, los datos no fueron modificados...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar los datos.", error);
  }
};

const eliminarFactura = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/facturas/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("La factura se eliminó correctamente de la base de datos!!");
      return true;
    } else {
      console.log("Se produjo un error, la factura no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la factura.", error);
  }
};