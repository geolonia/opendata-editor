import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { OpenDataEditor } from '../lib/OpenDataEditor';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <OpenDataEditor />,
);
