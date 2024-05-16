import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import SaltProvider from '../context/SaltContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SaltProvider>
      <App />
    </SaltProvider>
  </React.StrictMode>
);
