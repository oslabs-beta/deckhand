import React from "react";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { store } from "./store";
import App from "./App";
import "./style.css";

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);