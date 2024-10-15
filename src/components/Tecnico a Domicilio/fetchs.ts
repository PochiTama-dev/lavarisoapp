export const ordenesFetch= async () => {
    try {
      const empleadoId = localStorage.getItem("empleadoId")
      const ordenesResponse = await fetch("https://lv-back.online/ordenes");
      const clientesResponse = await fetch(
        "https://lv-back.online/clientes/lista"
      );

      if (!ordenesResponse.ok || !clientesResponse.ok) {
        throw new Error("Error al obtener datos de las APIs");
      }

      const ordenes = await ordenesResponse.json();
 
      const clientes = await clientesResponse.json();
      if (ordenes.length > 0 && clientes.length > 0) {
        const clientesMap = new Map(
          clientes.map((cliente: { id: any }) => [cliente.id, cliente])
        );

        const ordenesConClientes = ordenes
          .map((orden: { cliente_id: unknown }) => ({
            ...orden,
            cliente: clientesMap.get(orden.cliente_id),
          }))
          .filter(
            (orden: { Empleado: { id: string | null } }) =>
              orden.Empleado.id == empleadoId
          );
 
        return ordenesConClientes;
      } else {
        console.log(
          "No se encontraron órdenes o clientes en la base de datos."
        );
        return [];
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
      throw error;
    }
  };
