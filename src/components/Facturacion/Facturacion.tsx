import { IonContent, IonHeader, IonSelect, IonSelectOption, IonInput, IonButton, IonLabel, IonIcon } from "@ionic/react";
import { addOutline, cameraOutline } from 'ionicons/icons';
import HeaderGeneral from "../Header/HeaderGeneral";
import "./Facturacion.css";

function FacturacionComponent() {
  return (
    <IonContent className="facturacion-container">
      <IonHeader>
        <HeaderGeneral />
      </IonHeader>
      <div className="facturacion-box">
        <h2 className="text-center">Condiciones de pago</h2>
        <div className="estado-pago">
          <IonSelect className="placeholder-estado-pago" placeholder="Estado">
            <IonSelectOption value="pendiente">Pendiente</IonSelectOption>
            <IonSelectOption value="pagado">Pagado</IonSelectOption>
            <IonSelectOption value="rechazado">Rechazado</IonSelectOption>
          </IonSelect>
        </div>
        <div className="estado-pago-total">
            <span>Total:</span>
            <span className="total-amount">$13.700</span>
        </div>
        <div className="subtitle-forma-pago">
            <span>Formas de pago</span>
        </div>
        <div className="forma-pago">
          <IonSelect placeholder="Mercadopago">
            <IonSelectOption className="select-option" value="mp">MercadoPago</IonSelectOption>
            <IonSelectOption className="select-option" value="efectivo">Efectivo</IonSelectOption>
            <IonSelectOption className="select-option" value="credito">Crédito</IonSelectOption>
            <IonSelectOption className="select-option" value="debito">Débito</IonSelectOption>
          </IonSelect>
          <IonInput placeholder="$10.000" />
        </div>
        <div className="forma-pago">
          <IonSelect placeholder="Efectivo">
            <IonSelectOption value="mp">MercadoPago</IonSelectOption>
            <IonSelectOption value="efectivo">Efectivo</IonSelectOption>
            <IonSelectOption value="credito">Crédito</IonSelectOption>
            <IonSelectOption value="debito">Débito</IonSelectOption>
          </IonSelect>
          <IonInput placeholder="$3.700" />
        </div>
        <div className="add-payment-method">
            <IonIcon icon={addOutline} />
        </div>
        <div className="adjuntar-foto">
          <IonButton>
            <IonIcon icon={cameraOutline} />
          </IonButton>
          <IonLabel>Adjuntar foto de comprobante</IonLabel>
        </div>
        <IonButton expand="block" className="finalizar-button">Finalizar</IonButton>
      </div>
    </IonContent>
  );
}

export default FacturacionComponent;
