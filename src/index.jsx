import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/my-trading-app">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
