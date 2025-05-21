// Importing required modules and components
import React from "react";
import "./App.css";

/**
 * Functional component for the App in Next.js.
 * Instead of using react-router-dom, Next.js handles routing through its /pages directory
 */
function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

// Exporting the App function as default module for use in other files
export default App;
