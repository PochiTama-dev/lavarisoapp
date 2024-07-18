import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonCheckbox,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonHeader,
  IonAlert,
} from '@ionic/react';
import '../Diagnostico/diagnostico.css';
import '../Entrega/entrega.css';
import HeaderGeneral from '../../components/Header/HeaderGeneral';
import './orden.css';
import { useLocation } from "react-router-dom";

interface Repuesto {
  id: any;
  descripcion: string;
  nombre: string;
  cantidad: number;
}

const TallerVerOrden: React.FC = () => {
  interface LocationState {
    ordenSeleccionada: any;
  }

  const [cierresExtendidosMap, setCierresExtendidosMap] = useState<{ [key: string]: number }>({});
  const [producto, setProducto] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cliente, setCliente] = useState('');
  const [motivo, setMotivo] = useState('');
  const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
  const [limpiezaSalida, setLimpiezaSalida] = useState<string[]>([]);
  const [estadosPresupuestos, setEstadosPresupuestos] = useState<{ id: any; texto: any }[]>([]);
  const [checkboxValues, setCheckboxValues] = useState<boolean[]>([]);
  const location = useLocation<LocationState>();
  const ordenSeleccionada = location.state?.ordenSeleccionada;
  const [checkboxValuesFunciones, setCheckboxValuesFunciones] = useState<boolean[]>([]);
  const [checkboxValuesLimpieza, setCheckboxValuesLimpieza] = useState<boolean[]>([]);
  const [checkboxValuesCierresExtendidos, setCheckboxValuesCierresExtendidos] = useState<boolean[]>([]);
  const [cierresExtendidos, setCierresExtendidos] = useState<{ id: number, tipo_cierre_extendido: string }[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idCierreExtendidoSeleccionado, setIdCierreExtendidoSeleccionado] = useState<number | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<any>(null); // Se inicializa con null
  useEffect(() => {
    fetchEstadosPresupuestos();
  }, []);
  interface LocationState {
    selectedRepuestos: Repuesto[];
    ordenActiva: any
  }
  const { selectedRepuestos } = location.state;
  const modificarPresupuesto = async (id: any, presupuesto: any) => {
    try {
      const response = await fetch(`https://lv-back.online/presupuestos/modificar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(presupuesto)
      });
      const result = await response.json();
      if (result[0] === 1) {
        console.log("Datos del presupuesto modificados con éxito!!!");
        return true;
      } else {
        console.log("Se produjo un error, el presupuesto no pudo ser modificado...");
        return false;
      }
    } catch (error) {
      console.error("Error al modificar el presupuesto...", error);
    }
  };
  const modificarOrden = async (ordenActiva: any, orden: any) => {
    try {
      console.log("Datos enviados a la API:", JSON.stringify(orden));
      const response = await fetch(`https://lv-back.online/ordenes/modificar/${ordenActiva}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orden)
      });
      const result = await response.json();
      console.log("Respuesta de la API:", result);
      if (result[0] === 1) {
        console.log("Datos de la orden modificados con éxito!!!");
        return true;
      } else {
        console.log("Se produjo un error, la orden no pudo ser modificada...");
        return false;
      }
    } catch (error) {
      console.error("Error al modificar la orden.", error);
    }
  };

  const fetchEstadosPresupuestos = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/presupuesto");
      const data = await response.json();
      if (data.length > 0) {
        const estados = data.map((item: { id: any; estado_presupuesto: any }) => ({
          id: item.id,
          texto: item.estado_presupuesto,
        }));
        setEstadosPresupuestos(estados);
        // Setear estadoSeleccionado con el estado de la orden seleccionada
        setEstadoSeleccionado(ordenSeleccionada?.Presupuesto?.id_estado_presupuesto);
      } else {
        console.log('Aún no se registra ningún estado de presupuesto...');
      }
    } catch (error) {
      console.error("Error, no se encontraron estados de los presupuestos en la base de datos....", error);
    }
  };


  const fetchTiposFunciones = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/funcion");
      const funciones = await response.json();
      if (funciones && funciones.length > 0) {
        console.log(`Se encontró un listado con ${funciones.length} tipos de funciones!!`);
        setTextosCheckbox(funciones.map((funcion: { tipo_funcion: string }) => funcion.tipo_funcion));
        setCheckboxValues(new Array(funciones.length).fill(false));
      } else {
        console.log('Aún no se registra ningún tipo de funcion...');
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de funciones en la base de datos....", error);
    }
  };

  const tiposLimpieza = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/limpieza");
      const limpieza = await response.json();
      if (limpieza && limpieza.length > 0) {
        console.log(`Se encontró un listado con ${limpieza.length} tipos de limpieza!!`);
        setLimpiezaSalida(limpieza.map((item: { tipo_limpieza: string }) => item.tipo_limpieza));
        setCheckboxValues(prev => [...prev, ...new Array(limpieza.length).fill(false)]);
      } else {
        console.log('Aún no se registra ningún tipo de limpieza...');
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de limpieza en la base de datos....", error);
    }
  };

  const tiposCierresExtendidos = async () => {
    try {
      const response = await fetch("https://lv-back.online/opciones/cierre");
      const cierres = await response.json();
      if (cierres && cierres.length > 0) {
        setCierresExtendidos(cierres);
        const checkboxValues = cierres.map((cierre: { id: number, tipo_cierre_extendido: string }) =>
          cierre.id === ordenSeleccionada.id_tipo_cierre_extendido
        );
        setCheckboxValuesCierresExtendidos(checkboxValues);
      } else {
        console.log('Aún no se registra ningún tipo de cierre extendido...');
      }
    } catch (error) {
      console.error("Error, no se encontraron tipos de cierres extendidos en la base de datos....", error);
    }
  };

  useEffect(() => {
    fetchTiposFunciones();
    tiposLimpieza();
    tiposCierresExtendidos();
    fetchEstadosPresupuestos();
    
  }, []);
  const handleConfirmarClick = async () => {
    setShowAlert(true);
  };
  const handleConfirmar = async () => {
    const ordenActualizada = {
    
      
 
      motivo,
      checkboxValuesFunciones,
      checkboxValuesLimpieza,
      id_tipo_cierre_extendido: idCierreExtendidoSeleccionado
    };

    console.log("Datos de la orden a actualizar:", ordenActualizada);

    const resultado = await modificarOrden(ordenSeleccionada.id, ordenActualizada);
    if (resultado) {
      console.log("Orden actualizada con éxito.");
    } else {
      console.log("Hubo un error al actualizar la orden.");
    }

    const presupuestoActualizado = {
      id_estado_presupuesto: estadoSeleccionado
    };

    const resultadoPresupuesto = await modificarPresupuesto(ordenSeleccionada.Presupuesto.id, presupuestoActualizado);
    if (resultadoPresupuesto) {
      console.log("Presupuesto actualizado con éxito.");
    } else {
      console.log("Hubo un error al actualizar el presupuesto.");
    }
    
    setShowAlert(false);
  };


  useEffect(() => {
    if (textosCheckbox.length > 0) {
      setCheckboxValuesFunciones(
        textosCheckbox.map((texto, index) => ordenSeleccionada.diagnostico.includes(texto))
      );
    }
    if (limpiezaSalida.length > 0) {
      setCheckboxValuesLimpieza(new Array(limpiezaSalida.length).fill(false));
    }
    if (cierresExtendidos.length > 0) {
      const checkboxValues = cierresExtendidos.map((cierre) =>
        cierre.id === ordenSeleccionada.id_tipo_cierre_extendido
      );
      setCheckboxValuesCierresExtendidos(checkboxValues);
      setIdCierreExtendidoSeleccionado(ordenSeleccionada.id_tipo_cierre_extendido);
    }
  }, [ordenSeleccionada, textosCheckbox, limpiezaSalida, cierresExtendidos]);


  useEffect(() => {
    if (ordenSeleccionada) {
      setEstadoSeleccionado(ordenSeleccionada.id_tipo_estado);
      setMotivo(ordenSeleccionada.motivo); // Asegúrate de actualizar el valor de motivo cuando la orden seleccionada cambie
    }
  }, [ordenSeleccionada]);

  const handleEstadoChange = (event: CustomEvent) => {
    setEstadoSeleccionado(event.detail.value);
  };
  const handleCierreExtendidoChange = (id: number) => {
    setIdCierreExtendidoSeleccionado(id);
  };
  console.log(ordenSeleccionada)
  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <HeaderGeneral />
        </IonHeader>
        <div className='diagnostico-ctn'>
          <div className="section">
            <h1 style={{ fontSize: '28px', marginBottom: '-20px' }}><strong>En taller</strong> </h1>
            <h2>Orden: {ordenSeleccionada?.numero_orden}</h2>
            <h3>
              <strong>Datos del cliente</strong>
            </h3>
            <div className='orden-datosCliente'>
              <h4>
                <strong>Nombre:</strong> {ordenSeleccionada?.Cliente?.nombre}
              </h4>
              <h4>
                <strong>Teléfono:</strong> {ordenSeleccionada?.Cliente?.telefono}
              </h4>
              
              <h4>
                <strong>N° Cliente:</strong> {ordenSeleccionada?.Cliente?.numero_cliente}
              </h4>
              <h4>
                <strong>Producto:</strong> {ordenSeleccionada?.equipo}
              </h4>
              <h4>
                <strong>Marca:</strong> {ordenSeleccionada?.marca}
              </h4>
              <h4>
                <strong>Modelo:</strong> {ordenSeleccionada?.modelo}
              </h4>
            </div>
          </div>

          <div className='section'>
            <h2>Chequeo de funcionamiento</h2>
            <div className='checkbox-container'>
              {textosCheckbox.map((texto, index) => (
                <div key={index} className='checkbox-item'>
                  <IonCheckbox
                    checked={checkboxValuesFunciones[index]}
                    onIonChange={(e) => {
                      const newCheckboxValues = [...checkboxValuesFunciones];
                      newCheckboxValues[index] = e.detail.checked;
                      setCheckboxValuesFunciones(newCheckboxValues);
                    }}
                    className='checkbox'
                  />
                  <span>{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='section'>
            <h2>Observaciones</h2>
            <IonInput
              className='obs-input'
              value={motivo}
              onIonChange={(e) => setMotivo(e.detail.value!)}
              placeholder='Ingrese observaciones'
            />
          </div>

          <div className='section'>
            <h2>Chequeo de limpieza y salida</h2>
            <div className='checkbox-container'>
              {limpiezaSalida.map((texto, index) => (
                <div key={index} className='checkbox-item'>
                  <IonCheckbox
                    checked={checkboxValuesLimpieza[index]}
                    onIonChange={(e) => {
                      const newCheckboxValues = [...checkboxValuesLimpieza];
                      newCheckboxValues[index] = e.detail.checked;
                      setCheckboxValuesLimpieza(newCheckboxValues);
                    }}
                    className='checkbox'
                  />
                  <span>{texto}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
          <IonSelect
          value={estadoSeleccionado}
          placeholder="Seleccionar estado"
          onIonChange={(e) => setEstadoSeleccionado(e.detail.value)}
        >
          {estadosPresupuestos.map((estado) => (
            <IonSelectOption key={estado.id} value={estado.id}>
              {estado.texto}
            </IonSelectOption>
          ))}
        </IonSelect>
          </div>

          <div className="section">
          <h2>Cierre extendido</h2>
            <div className='checkbox-container'>
              {cierresExtendidos.map((cierre) => (
                <div key={cierre.id} className='checkbox-item'>
                  <IonCheckbox
                    checked={idCierreExtendidoSeleccionado === cierre.id}
                    onIonChange={() => handleCierreExtendidoChange(cierre.id)}
                    className='checkbox'
                  />
                  <span>{cierre.tipo_cierre_extendido}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='section'>
            <h2>Repuestos del taller</h2>
            <ul>
              {selectedRepuestos.map((repuesto, index) => (
                <li key={index}>
                  {repuesto.descripcion}: {repuesto.cantidad}
                </li>
              ))}
            </ul>
          </div>

          <div className='section'>
            <IonButton className='buttonOrder' style={{ '--border-radius': '20px' }} onClick={handleConfirmarClick}>
              Finalizar operación
            </IonButton>
            <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Confirmar'}
        message={'¿Estás seguro de que deseas actualizar la orden?'}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Acción cancelada.');
              setShowAlert(false);
            }
          },
          {
            text: 'Aceptar',
            handler: handleConfirmar
          }
        ]}
      />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TallerVerOrden;
