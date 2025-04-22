import React from 'react';
import ReactDOM from 'react-dom/client';
import LayoutAmin from './components/LayoutAdmin';  // Importamos el formulario correctamente
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';                   // Estilos de los componentes de PrimeReact
import 'primeicons/primeicons.css';
const root = ReactDOM.createRoot(document.getElementById('admin'));

// Renderiza el formulario en el contenedor con id="app"
root.render(
  <React.StrictMode>
    <LayoutAmin />
  </React.StrictMode>
);
