import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Page from "./pages/Page";
import Diagnostico from "./pages/Diagnostico/Diagnostico";
import Chat from "./pages/Chat/Chat";
import HeaderGeneral from "./components/Header/HeaderGeneral";
import HeaderHome from "./components/Header/HeaderHome";
import Entrega from "./pages/Entrega/Entrega";
import Presupuesto from "./pages/Presupuesto/Presupuesto";
import Facturacion from "./pages/Facturacion/Facturacion";
import Repuesto from "./pages/Repuesto/Repuesto";
import RepuestosTaller from "./components/Repuestos/RepuestosTaller";
import RepuestosDomicilio from "./components/Repuestos/RepuestosDomicilio";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/Login/Login";
import LoginRol from "./pages/Login/LoginRol";
import Alertas from "./pages/Alertas/Alertas";
import ConfirmacionOrden from "./pages/Orden/ConfirmacionOrden";
import TecnicoDomicilio from "./pages/TecnicoDomicilio/TecnicoDomicilio";
import TecnicoTaller from "./pages/TecnicoTaller/TecnicoTaller";
import TallerVerOrden from "./pages/Orden/TallerVerOrden";
 
import { OrdenProvider } from "./Provider/Provider";
import Feedback from "./pages/Feedback/Feedback";
import RemitoOrden from "./components/Facturacion/Remito";
import VerOrden from "./components/Orden/VerOrden";
import AddRepuestoCamioneta from "./components/Repuestos/AddRepuestoCamioneta";
import Fotos from "./components/Fotos/Fotos";
setupIonicReact();
import { AuthProvider } from "./components/Login/loginContext";
const App: React.FC = () => {
 
  const empleadoEmail = localStorage.getItem("empleadoEmail");
  return (
    <IonApp>
 
        <OrdenProvider>
        <AuthProvider> 
      <IonReactRouter>
      <Route exact path="/">
              {empleadoEmail ? <Redirect to="/rol" /> : <Redirect to="/login" />}
            </Route>
        <Route path="/login" exact={true}>
          <Login />
        </Route>
        <Route path="/rol" exact={true}>
          <LoginRol />
        </Route>
        <Route path="/domicilio" exact={true}>
          <TecnicoDomicilio />
        </Route>
  
        <Route path="/alertas" exact={true}>
          <Alertas />
        </Route>
        
        <Route path="/feedback" exact={true}>
          <Feedback />
        </Route>
        <Route path="/diagnostico" exact={true}>
          <Diagnostico />
        </Route>
        <Route path="/entrega" exact={true}>
          <Entrega />
        </Route>
        <Route path="/presupuesto" exact={true}>
          <Presupuesto />
        </Route>
        <Route path="/facturacion" exact={true}>
          <Facturacion />
        </Route>
      
        <Route path="/chat" exact={true}>
          <Chat />
        </Route>
        <Route path="/verorden">
          <VerOrden />
        </Route>
       
        <Route path="/tallerorden">
          <TallerVerOrden />
        </Route>
        <Route path="/taller" exact={true}>
          <TecnicoTaller />
        </Route>
        <Route path="/repuestos" exact={true}>
          <Repuesto />
        </Route>
        <Route path="/repuestos" exact={true}>
          <Repuesto />
        </Route>
        <Route path="/fotos" exact={true}>
          <Fotos />
        </Route>

        <Route path="/addRepuestoCamioneta" exact={true}>
          <AddRepuestoCamioneta />
        </Route>
        <Route path="/repuestosDomicilio" exact={true}>
          <RepuestosDomicilio />
        </Route>
      <Route path="/remito" exact={true}>
            <RemitoOrden />
          </Route>
      </IonReactRouter>
      </AuthProvider> 
        </OrdenProvider>
 
    </IonApp>
  );
};

export default App;
