import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
// We are intentionally not importing the CSS file to focus on functionality first.
// import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);