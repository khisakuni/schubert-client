import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Editor from './Editor';
import Signup from './Signup';
import Dash from './Dash';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route component={Dash} exact path="/" />
          <Route component={Signup} path={Signup.path} />
        </Switch>
        {/*<Editor />*/}
      </div>
    );
  }
}

export default App;
