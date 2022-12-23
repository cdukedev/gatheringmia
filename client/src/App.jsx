import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import MapPage from './pages/MapPage/MapPage';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/map">
          <MapPage />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
