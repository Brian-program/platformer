import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// create root element with id and render component tree inside
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
