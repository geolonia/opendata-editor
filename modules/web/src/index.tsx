import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { OpenDataEditor } from '@geolonia/opendata-editor';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <OpenDataEditor />,
);
