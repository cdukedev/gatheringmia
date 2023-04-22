import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage/MapPage";
import Home from "./pages/Home/Home";
import { MapPageProvider } from "./context/MapPageContext";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/map"
          element={
            <MapPageProvider>
              <MapPage />
            </MapPageProvider>
          }
        ></Route>
        <Route path="/" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
