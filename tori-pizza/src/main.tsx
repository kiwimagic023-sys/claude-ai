import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import '@fontsource/yellowtail/400.css';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
