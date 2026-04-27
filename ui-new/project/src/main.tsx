import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import SimulationApp from './sim/SimulationApp';

const isSimulationRoute =
  window.location.hash.startsWith('#/sim') ||
  window.location.pathname === '/sim' ||
  window.location.pathname === '/sim-bank' ||
  new URL(window.location.href).searchParams.get('mode') === 'sim';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<<<<<<< HEAD
    <BrowserRouter>
      <App />
    </BrowserRouter>
=======
    {isSimulationRoute ? <SimulationApp /> : <App />}
>>>>>>> 6187067aa60f3fc3c6d1786692066b5b6dfca226
  </StrictMode>
);
