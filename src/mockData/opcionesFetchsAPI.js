const rolesEmpleados = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/roles");
    const roles = await response.json();
    if (roles[0] !== undefined) {
      console.log(`Se encontró un listado con ${roles.length} roles distintos para los empleados!!`);
      console.log(roles);
      return roles;
    } else {
      console.log('Aún no se registra ningún rol...');
      return false;
    }
  } catch (error) {
      console.error("Error, no se encontraron roles para los empleados en la base de datos....", error);
  }
};

const tiposProveedores = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/tipos");
    const tipos = await response.json();
    if (tipos[0] !== undefined) {
      console.log(`Se encontró un listado con ${tipos.length} categorías distintas de proveedores!!`);
      console.log(tipos)
      return tipos;
    } else {
      console.log('Aún no se registra ninguna categoría de proveedor...');
      return false;
    }
  } catch (error) {
      console.error("Error, no se encontraron categorías de proveedores en la base de datos....", error);
  }
};

const tiposNotificaciones = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/notificacion");
    const notificaciones = await response.json();
    if (notificaciones[0] !== undefined) {
      console.log(`Se encontró un listado con ${notificaciones.length} tipos de notificaciones!!`);
      console.log(notificaciones);
      return notificaciones;
    } else {
      console.log('Aún no se registra ningún tipo de notificación...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron tipos de notificaciones en la base de datos....", error);
  }
};
  
const tiposLimpieza = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/limpieza");
    const limpieza = await response.json();
    if (limpieza[0] !== undefined) {
      console.log(`Se encontró un listado con ${limpieza.length} tipos de limpieza!!`);
      console.log(limpieza);
      return limpieza;
    } else {
      console.log('Aún no se registra ningún tipo de limpieza...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron tipos de limpieza en la base de datos....", error);
  }
};

const tiposFunciones = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/funcion");
    const funciones = await response.json();
    if (funciones[0] !== undefined) {
      console.log(`Se encontró un listado con ${funciones.length} tipos de funciones!!`);
      console.log(funciones);
      return funciones;
    } else {
      console.log('Aún no se registra ningún tipo de funcion...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron tipos de funciones en la base de datos....", error);
  }
};

const tiposEstados = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/estado");
    const estados = await response.json();
    if (estados[0] !== undefined) {
      console.log(`Se encontró un listado con ${estados.length} tipos de estados!!`);
      console.log(estados);
      return estados;
    } else {
      console.log('Aún no se registra ningún tipo de estado...');
      return false;
    }
  } catch (error) {
    console.error("Error, no se encontraron tipos de estados en la base de datos....", error);
  }
};

const tiposComprobantes = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/comprobante");
    const comprobantes = await response.json();
    if (comprobantes[0] !== undefined) {
      console.log(`Se encontró un listado con ${comprobantes.length} tipos de comprobantes!!`);
      console.log(comprobantes);
      return comprobantes;
    } else {
      console.log('Aún no se registra ningún tipo de comprobante...');
      return false; 
    }
  } catch (error) {
    console.error("Error, no se encontraron tipos de comprobantes en la base de datos....", error);
  }
};

const tiposCierresExtendidos = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/cierre");
    const cierres = await response.json();
    if (cierres[0] !== undefined) {
      console.log(`Se encontró un listado con ${cierres.length} tipos de cierres extendidos!!`);
      console.log(cierres);
      return cierres;
    } else {
      console.log('Aún no se registra ningún tipo de cierre extendido...');
      return false; 
    }
  } catch (error) {
    console.error("Error, no se encontraron tipos de cierres extendidos en la base de datos....", error);
  }
};

const tiposAlertas = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/alerta");
    const alertas = await response.json();
    if (alertas[0] !== undefined) {
      console.log(`Se encontró un listado con ${alertas.length} tipos de alertas!!`);
      console.log(alertas);
      return alertas;
    } else {
      console.log('Aún no se registra ningún tipo de alerta...');
      return false; 
    }
  } catch (error) {
    console.error("Error, no se encontraron tipos de alertas en la base de datos....", error);
  }
};

const plazosReparacion = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/plazo");
    const plazos = await response.json();
    if (plazos[0] !== undefined) {
      console.log(`Se encontró un listado con ${plazos.length} tipos de plazos de reparación!!`);
      console.log(plazos);
      return plazos;
    } else {
      console.log('Aún no se registra ningún tipo de plazo de reparación...');
      return false; 
    }
  } catch (error) {
    console.error("Error, no se encontraron tipos de plazos de reparación en la base de datos....", error);
  }
};

const mediosDePago = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/pago");
    const mediosDePago = await response.json();
    if (mediosDePago[0] !== undefined) {
      console.log(`Se encontró un listado con ${mediosDePago.length} medios de pago diferentes!!`);
      console.log(mediosDePago);
      return mediosDePago;
    } else {
      console.log('Aún no se registra ningún medio de pago...');
      return false; 
    }
  } catch (error) {
    console.error("Error, no se encontraron medios de pago en la base de datos....", error);
  }
};

const eventosDeAgenda = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/agenda");
    const eventosAgenda = await response.json();
    if (eventosAgenda[0] !== undefined) {
      console.log(`Se encontró un listado con ${eventosAgenda.length} eventos de agenda posibles!!`);
      console.log(eventosAgenda);
      return eventosAgenda;
    } else {
      console.log('Aún no se registra ningún evento de agenda...');
      return false; 
    }
  } catch (error) {
    console.error("Error, no se encontraron eventos de agenda en la base de datos....", error);
  }
};

const estadosPresupuestos = async () => {
  try {
    const response = await fetch("http://localhost:8000/opciones/presupuesto");
    const estadosPresupuestos = await response.json();
    if (estadosPresupuestos[0] !== undefined) {
      console.log(`Se encontró un listado con ${estadosPresupuestos.length} estados posibles de los presupuestos!!`);
      console.log(estadosPresupuestos);
      return estadosPresupuestos;
    } else {
      console.log('Aún no se registra ningún estado de los presupuestos...');
      return false; 
    }
  } catch (error) {
    console.error("Error, no se encontraron estados de los presupuestos en la base de datos....", error);
  }
};