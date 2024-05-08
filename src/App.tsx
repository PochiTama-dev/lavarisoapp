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

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <HeaderGeneral />
      <IonReactRouter>
        <Route path="/diagnostico" exact={true}>
          <Diagnostico />
        </Route>
        <Route path="/entrega" exact={true}>
          <Entrega />
        </Route>
        <Route path="/presupuesto" exact={true}>
          <Entrega />
        </Route>
        <Route path="/chat" exact={true}>
          <Chat />
        </Route>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
