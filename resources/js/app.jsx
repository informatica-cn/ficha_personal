import React from 'react';
import ReactDOM from 'react-dom/client';
import Loyout from './components/Layout';  // Importamos el formulario correctamente
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';                   // Estilos de los componentes de PrimeReact
import 'primeicons/primeicons.css';
const root = ReactDOM.createRoot(document.getElementById('app'));

// Renderiza el formulario en el contenedor con id="app"
root.render(
  <React.StrictMode>
    <Loyout />
  </React.StrictMode>
);
