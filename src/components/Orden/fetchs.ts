export interface Orden {
  id: number;
  Cliente: {
    nombre: string;
    telefono: string;
    numero_cliente: string;
    direccion: string;
  };
  id_tipo_estado: number;
  Presupuesto?: {
    id_estado_presupuesto: number;
  };
}
 
export interface LocationState {
  orden: Orden | null;  
}


export const obtenerPresupuesto = async (id_orden: any) => {
    try {
      const response = await fetch(`https://lv-back.online/presupuestos?ordenId=${id_orden}`);
      const presupuestos = await response.json();
      return presupuestos.find((presupuesto: { id_orden: any; }) => presupuesto.id_orden === id_orden) || null;
    } catch (error) {
      console.error("Error, presupuesto no encontrado.", error);
      return null;
    }
  };


  export const entregaPago = async (idEntrega: any) => {
    try {
      const response = await fetch(`https://lv-back.online/pagos/entrega/${idEntrega}`);
      const pagos = await response.json();
      if (pagos[0] !== undefined) {
        console.log(`Se encontraron medios de pago asociados a la entrega id ${idEntrega}`);
        console.log(pagos);
        return pagos;
      } else {
        console.log(`No se encontró ningún medio de pago con la entrega id ${idEntrega}`);
        return false;
      }
    } catch (error) {
        console.error("Error, medio de pago no encontrado.", error);
    }
  };
  