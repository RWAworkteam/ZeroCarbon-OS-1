// Import React first to ensure it's fully initialized
import React from 'react';

// Wait for React to be fully ready
if (typeof React === 'undefined' || !React.createElement) {
  throw new Error('React is not properly loaded');
}

import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Ensure React is fully initialized before rendering
const root = ReactDOM.createRoot(rootElement);
root.render(
  <App />
);