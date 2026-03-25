import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service Worker Registration for Production
if ((import.meta as any).env?.PROD && 'serviceWorker' in navigator) {

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('FCM Service Worker registered:', registration.scope);
      })
      .catch((err) => {
        console.error('FCM Service Worker registration failed:', err);
      });
  });
}