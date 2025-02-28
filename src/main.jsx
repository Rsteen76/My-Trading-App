import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";  // Change to HashRouter
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>  {/* Remove basename, HashRouter doesn't need it */}
      <App />
    </HashRouter>
  </React.StrictMode>
);
