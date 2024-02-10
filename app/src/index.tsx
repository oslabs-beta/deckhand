import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { store } from './store.js';
import App from './App.jsx';
import './style.css';

// @ts-expect-error TS(2345) FIXME: Argument of type 'HTMLElement | null' is not assig... Remove this comment to see the full error message
const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);