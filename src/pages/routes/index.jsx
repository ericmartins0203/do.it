import { Route, Switch } from "react-router";
import Home from "../Home";
import Signup from "../Signup";
import Login from "../Login";
import Dashboard from "../Dashboard";
import { useState, useEffect } from "react";

function Routes() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('@Doit:token'));

    if(token){
      return setAuthenticated(true)
    }
  }, [authenticated]);

  return (
    <Switch>
      <Route exact path="/">
        <Home 
        authenticated= {authenticated}
          />
      </Route>
      <Route path="/signup">
        <Signup authenticated= {authenticated} />
      </Route>
      <Route path="/login">
        <Login authenticated= {authenticated} setAuthenticated={setAuthenticated} />
      </Route>
      <Route path="/dashboard">
        <Dashboard authenticated= {authenticated} />
      </Route>
    </Switch>
  );
}

export default Routes;
