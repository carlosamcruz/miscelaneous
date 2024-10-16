import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { Counter } from './contracts/counter';

import artifact02 from './contracts/artifacts/counter.json';

Counter.loadArtifact(artifact02)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
