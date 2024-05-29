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

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Route exact path="/">
          <Redirect to="/login" />
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
        <Route path="/taller" exact={true}>
          <TecnicoTaller />
        </Route>
        <Route path="/alertas" exact={true}>
          <Alertas />
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
        <Route path="/repuestos" exact={true}>
          <Repuesto />
        </Route>
        <Route path="/chat" exact={true}>
          <Chat />
        </Route>
        <Route path="/verorden">
          <ConfirmacionOrden />
        </Route>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
