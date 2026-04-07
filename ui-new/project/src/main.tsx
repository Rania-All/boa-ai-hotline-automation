import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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
    {isSimulationRoute ? <SimulationApp /> : <App />}
  </StrictMode>
);
