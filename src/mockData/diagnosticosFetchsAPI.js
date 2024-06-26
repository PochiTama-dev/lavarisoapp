const presupuestoDiagnosticos = async (idPresupuesto) => {
  try {
    const response = await fetch(`http://localhost:8000/diagnosticos/presupuesto/${idPresupuesto}`);
    const diagnosticos = await response.json();
    if (diagnosticos[0] !== undefined) {
      console.log(`Se encontraron ${diagnosticos.length} diagnóstico(s) asociados al presupuesto con id ${idPresupuesto}`);
      console.log(diagnosticos);
      return diagnosticos;
    } else {
      console.log(`No se encontraron diagnósticos con el presupuesto id ${idPresupuesto}`);
      return false;
    }
  } catch (error) {
      console.error("Error, diagnóstico no encontrado.", error);
  }
};

const obtenerDiagnostico = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/diagnosticos/${id}`);
    const diagnostico = await response.json();
    if (diagnostico) {
      console.log(`Se encontró un diagnóstico asociado al id ${id}`);
      console.log(diagnostico);
      return diagnostico;
    } else {
      console.log(`No se encontró ningún diagnóstico con el id ${id}`);
      return false;
    }
  } catch (error) {
      console.error("Error, diagnóstico no encontrada.", error);
  }
};

const guardarDiagnostico = async (diagnostico) => {
  try {
    const response = await fetch("http://localhost:8000/diagnosticos/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diagnostico)
    });
    const result = await response.json();
    if (result) {
      console.log("Función registrada con exito!!!");
      return true;
    } else {
      console.log("Se produjo un error, la función no pudo ser registrada...");
      return false;
    }
  } catch (error) {
    console.error("Error al registrar la función.", error);
  }
};

const modificarDiagnostico = async (id, diagnostico) => {
  try {
    const response = await fetch(`http://localhost:8000/diagnosticos/modificar/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diagnostico)
    });
    const result = await response.json();
    console.log(result)
    if (result[0] === 1) {
      console.log("Diagnóstico modificado con éxito!!!");
      return true;
    } else {
      console.log("Se produjo un error, el diagnóstico no pudo ser modificado...");
      return false;
    }
  } catch (error) {
    console.error("Error al modificar el diagnóstico.", error);
  }
};

const eliminarDiagnostico = async (id) => {
  try {
    const response = await fetch(`http://localhost:8000/diagnosticos/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if (result === 1) {
      console.log("La función se eliminó del presupuesto correctamente!!");
      return true;
    } else {
      console.log("Se produjo un error, la función no pudo ser eliminada...");
      return false;
    }
  } catch (error) {
    console.error("Error al tratar de eliminar la función.", error);
  }
};