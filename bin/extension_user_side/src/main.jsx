import React from 'react';
import ReactDOM from 'react-dom/client';
import ShortMenu from './content/ShortMenu/ShortMenu';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ShortMenu />
    </React.StrictMode>
  );
}
