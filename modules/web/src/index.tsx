import { createRoot } from 'react-dom/client';

import './index.css';
import { OpenDataEditor } from '@geolonia/opendata-editor';
import '@geolonia/opendata-editor/style.css';

const root = createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <OpenDataEditor />,
);
