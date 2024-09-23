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
import { useOrden } from './ordenContext';
import { fetchEstadosPresupuestos, fetchTiposFunciones, tiposLimpieza, tiposCierresExtendidos,   modificarOrden, 
  modificarPresupuesto, createRepuestoOrden, modificarStockPrincipal, getRepuestosOrdenById } from './FetchsOrden';  
import { useHistory } from 'react-router-dom';  

interface Repuesto {
  id: any;
  descripcion: string;
  nombre: string;
  cantidad: number;
}

const TallerVerOrden: React.FC = () => {
  interface LocationState {
    selectedRepuestos: Repuesto[];
  }
  const history = useHistory(); 

  const [motivo, setMotivo] = useState('');
  const [textosCheckbox, setTextosCheckbox] = useState<string[]>([]);
  const [limpiezaSalida, setLimpiezaSalida] = useState<string[]>([]);
  const [estadosPresupuestos, setEstadosPresupuestos] = useState<{ id: any; texto: any }[]>([]);
  const [checkboxValuesFunciones, setCheckboxValuesFunciones] = useState<boolean[]>([]);
  const [checkboxValuesLimpieza, setCheckboxValuesLimpieza] = useState<boolean[]>([]);
  const [cierresExtendidos, setCierresExtendidos] = useState<{ id: number, tipo_cierre_extendido: string }[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [idCierreExtendidoSeleccionado, setIdCierreExtendidoSeleccionado] = useState<number | null>(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<any>(null);
  const [repuestosOrden, setRepuestosOrden] = useState<Repuesto[]>([]); // Estado para repuestos de la orden

  const { ordenSeleccionada, setOrdenSeleccionada, selectedRepuestosTaller } = useOrden();
 
  useEffect(() => {
    if (ordenSeleccionada) {
      const loadRepuestos = async () => {
        const repuestos = await getRepuestosOrdenById(ordenSeleccionada.id);
        setRepuestosOrden(repuestos);
        console.log("REPUESTO ORDEN", repuestosOrden)
      };
      loadRepuestos();
    }
  }, [ordenSeleccionada]);
 
  useEffect(() => {
    if (ordenSeleccionada) {
      setEstadoSeleccionado(ordenSeleccionada.id_tipo_estado);
      setMotivo(ordenSeleccionada.motivo);
      const loadEstados = async () => {
        const estados = await fetchEstadosPresupuestos();
        setEstadosPresupuestos(estados);
        setEstadoSeleccionado(ordenSeleccionada?.Presupuesto?.id_estado_presupuesto);
      };
      loadEstados();
    }
  }, [ordenSeleccionada]);

  useEffect(() => {
    const loadFunciones = async () => {
      const funciones = await fetchTiposFunciones();
      if (funciones.length > 0) {
        setTextosCheckbox(funciones);
        setCheckboxValuesFunciones(new Array(funciones.length).fill(false));
      }
    };

    const loadLimpieza = async () => {
      const limpieza = await tiposLimpieza();
      if (limpieza.length > 0) {
        setLimpiezaSalida(limpieza);
        setCheckboxValuesLimpieza(new Array(limpieza.length).fill(false));
      }
    };

    const loadCierres = async () => {
      const cierres = await tiposCierresExtendidos();
      if (cierres.length > 0) {
        setCierresExtendidos(cierres);
      }
    };

    loadFunciones();
    loadLimpieza();
    loadCierres();
  }, []);

    const handleConfirmarClick = () => {
      setShowAlert(true);
    };
 
    const handleConfirmar = async () => {
      const ordenActualizada = {
        motivo,
        checkboxValuesFunciones,
        checkboxValuesLimpieza,
        id_tipo_cierre_extendido: idCierreExtendidoSeleccionado,
      };
    
      const resultado = await modificarOrden(ordenSeleccionada.id, ordenActualizada);
      if (resultado) {
        setOrdenSeleccionada({ ...ordenSeleccionada, ...ordenActualizada });
      }
    
      const presupuestoActualizado = {
        id_estado_presupuesto: estadoSeleccionado,
      };
    
      const resultadoPresupuesto = await modificarPresupuesto(ordenSeleccionada.Presupuesto.id, presupuestoActualizado);
      if (resultadoPresupuesto) {
        console.log("Presupuesto actualizado con éxito.");
      }
 console.log("SELECTED REPUESTO",selectedRepuestosTaller)
      // Agregar repuestos a la orden
      if (ordenSeleccionada.id) { // Asegúrate de que id_orden no sea null
        try {
          await Promise.all(selectedRepuestosTaller.map(async (repuesto) => {
        
            const repuestoOrdenData = {
              id_orden: ordenSeleccionada.id,
              id_repuesto_taller: repuesto.id_repuesto,
              id_repuesto_camioneta: null, // Este valor es null
              nombre : repuesto.nombre,
              cantidad:  repuesto.cantidad
            };
            await createRepuestoOrden(repuestoOrdenData);
         
         
          }));
          console.log("Repuestos agregados a la orden con éxito.");
        } catch (error) {
          console.error("Error al agregar repuestos a la orden:", error);
        }
      } else {
        console.error("El id de la orden es null, no se pueden agregar repuestos.");
      }
    
      setShowAlert(false);
      history.push('/taller');
    };
console.log("ORDEN SELECCIONADA", ordenSeleccionada)
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
              <h3><strong>Datos del cliente</strong></h3>
              <div className='orden-datosCliente'>
                <h4><strong>Nombre:</strong> {ordenSeleccionada?.Cliente?.nombre}</h4>
                <h4><strong>Teléfono:</strong> {ordenSeleccionada?.Cliente?.telefono}</h4>
                <h4><strong>N° Cliente:</strong> {ordenSeleccionada?.Cliente?.numero_cliente}</h4>
                <h4><strong>Producto:</strong> {ordenSeleccionada?.equipo}</h4>
                <h4><strong>Marca:</strong> {ordenSeleccionada?.marca}</h4>
                <h4><strong>Modelo:</strong> {ordenSeleccionada?.modelo}</h4>
              </div>
            </div>

            <div className='section'>
            <h2>Repuestos Seleccionados</h2>
            {selectedRepuestosTaller.length > 0 || repuestosOrden.length > 0 ? (
              <ul>
                {selectedRepuestosTaller.map((repuesto) => (
                  <li key={repuesto.id}>
                    {repuesto.nombre} - Cantidad: {repuesto.cantidad}
                  </li>
                ))}
                {repuestosOrden.map((repuesto) => (
                  <li key={repuesto.id}>
                    {repuesto.nombre} - Cantidad: {repuesto.cantidad}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay repuestos seleccionados.</p>
            )}
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

            <div className='section'>
              <h2>Cierre extendido</h2>
              <IonSelect
                value={idCierreExtendidoSeleccionado}
                onIonChange={(e) => setIdCierreExtendidoSeleccionado(e.detail.value)}
              >
                <IonSelectOption value={null}>Seleccione un cierre extendido</IonSelectOption>
                {cierresExtendidos.map(cierre => (
                  <IonSelectOption key={cierre.id} value={cierre.id}>
                    {cierre.tipo_cierre_extendido}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </div>
        <div>
        <h2>Estado</h2>

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
                  handler: () => setShowAlert(false)
                },
                {
                  text: 'Aceptar',
                  handler: handleConfirmar
                }
              ]}
            />
          </div>
        </IonContent>
      </IonPage>
    );
  };

  export default TallerVerOrden;
