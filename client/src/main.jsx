import React from 'react';
import ReactDOM from 'react-dom'; 
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from "react-router-dom";

/**
 * Rende l'applicazione React nell'elemento root del documento HTML utilizzando React DOM.
 * Utilizza React Router per gestire il routing dell'applicazione.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
