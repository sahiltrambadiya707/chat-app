import "./App.css";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home.page";
import Chat from "./pages/Chat.page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/chats" component={Chat} />
      </Switch>
    </div>
  );
}

export default App;
