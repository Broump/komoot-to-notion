import React from "react"
import ProtectedRoute from "./components/protectedRoute"
import register from "./components/register"
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Route exact path="/register" component={register}></Route>
    </div>
  );
}

export default App;
