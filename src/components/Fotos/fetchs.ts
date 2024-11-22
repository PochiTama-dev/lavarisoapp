export const getFotos = async () => {
    try {
      const response = await fetch('https://lv-back.online/fotos/lista');
      const data = await response.json();
      return data; // Esto es un array de fotos
    } catch (error) {
      console.error('Error al obtener las fotos:', error);
      return [];
    }
  };
  
  export const uploadFoto = async (numero_orden: any, ruta_imagen: any, id_empleado: any, isEntrega: any, isFactura : any) => {
    try {
      const response = await fetch('https://lv-back.online/fotos/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          numero_orden,
          ruta_imagen,
          id_empleado,
          isEntrega,
          isFactura,
        }),
      });
      const data = await response.json();
      return data; // Devuelve la foto guardada o un mensaje de éxito
    } catch (error) {
      console.error('Error al guardar la foto:', error);
      return null;
    }
  };

  export const deleteFoto = async (id: any) => {
    try {
      const response = await fetch(`https://lv-back.online/fotos/eliminar/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data; // Devuelve el resultado de la operación de eliminación
    } catch (error) {
      console.error('Error al eliminar la foto:', error);
      return null;
    }
  };
  
  export const getFotosNumeroOrden = async (numero_orden: any) => {
    try {
        const response = await fetch(`https://lv-back.online/fotos/orden/${numero_orden}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener las fotos');
        }

        const data = await response.json();
        return data; // Esto es un array de fotos filtradas por numero_orden
    } catch (error) {
        console.error('Error al obtener las fotos:', error);
        return [];
    }
};