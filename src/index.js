import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter as Router, Switch, Route,withRouter} from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import firebase from "./firebase";
import "semantic-ui-css/semantic.min.css";

class Root extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user=>{
      if(user){
        this.props.history.push('/');
      }
    })
  }
  render() {
    return (
        <Switch>
          <Route exact path="/" component={App} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
        </Switch>
    );
  }
}

const RootWithAuth = withRouter(Root);

ReactDOM.render(
  <Router>
   <RootWithAuth/>
  </Router>, 
  document.getElementById("root"));
registerServiceWorker();
