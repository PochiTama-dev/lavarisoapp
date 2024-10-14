
export const fetchOrdenes = async (empleadoId: string) => {
    try {
      const ordenesResponse = await fetch("https://lv-back.online/ordenes");
      const clientesResponse = await fetch(
        "https://lv-back.online/clientes/lista"
      );
  
      if (!ordenesResponse.ok || !clientesResponse.ok) {
        throw new Error("Error al obtener datos de las APIs");
      }
  
      const ordenesData = await ordenesResponse.json();
      const clientesData = await clientesResponse.json();
  
      if (ordenesData.length > 0 && clientesData.length > 0) {
        const clientesMap = new Map(
          clientesData.map((cliente: { id: any }) => [cliente.id, cliente])
        );
  
        const ordenesConClientes = ordenesData
          .map((orden: { cliente_id: any; Empleado: { id: any } }) => ({
            ...orden,
            cliente: clientesMap.get(orden.cliente_id),
          }))
          .filter((orden: { Empleado: { id: string | null }; id_tipo_estado: number }) =>
            orden.Empleado.id === empleadoId && orden.id_tipo_estado === 1
          );
  
        return ordenesConClientes;
      }
      
      console.log("No se encontraron ordenes o clientes en la base de datos.");
      return [];
    } catch (error) {
      console.error("Error al obtener datos:", error);
      return [];
    }
  };
  
  export const listaStockPrincipal = async () => {
    try {
      const response = await fetch("https://lv-back.online/stock/principal/lista");
      const repuestos = await response.json();
      if (repuestos[0] !== undefined) {
        console.log(`Se encontró una lista con ${repuestos.length} ingreso de repuestos!!!`);
        return repuestos;
      } else {
        console.log('No se encontró ningún repuesto...');
        return false;
      }
    } catch (error) {
      console.error("Error, al consultar el stock principal de repuestos.", error);
    }
  };
  