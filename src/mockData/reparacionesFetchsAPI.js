export const listaReparaciones = async () => {
    try {
      const response = await fetch("https://lv-back.online/reparaciones/lista");
      const reparaciones = await response.json();
      if (reparaciones.length > 0) {
        console.log(`Se encontró un listado con ${reparaciones.length} reparaciones!!`);
        return reparaciones;
      } else {
        console.log('Aún no se registra ninguna reparación...');
        return false;
      }
    } catch (error) {
        console.error("Error, no se encontraron reparaciones en la base de datos....", error);
    }
  };
  