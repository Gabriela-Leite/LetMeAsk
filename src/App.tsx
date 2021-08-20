import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

import { AuthContextProvider } from "./contexts/AuthContext";
import { Room } from "./pages/Room";
import { Errors } from "./pages/Errors";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
          <Route path="/error" component={Errors} />
          <Route path="*" component={Errors} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
