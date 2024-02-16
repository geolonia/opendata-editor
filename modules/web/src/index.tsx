import { createRoot } from 'react-dom/client';

import './index.css';
import { OpenDataEditor } from '@geolonia/opendata-editor';
import '@geolonia/opendata-editor/style.css';

export const initOpenDataEditor = (element: string | HTMLElement | null): void => {
  let el;

  if (typeof element === 'string') {
    el = document.querySelector(element);

    if (!el) {
      throw new Error(`Element ${element} not found`);
    }
  } else if (element instanceof HTMLElement) {
    el = element;
  } else if (element === null) {
    throw new Error('Element not found (null is given as an argument)');
  } else {
    throw new Error(`type "${typeof element}" is given as an argument. Element must be a string or an HTMLElement`);
  }

  const root = createRoot(el);
  root.render(
    <OpenDataEditor />,
  );
};
