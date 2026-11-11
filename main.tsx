import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build prerenders the page into #root (scripts/prerender.mjs),
// so hydrate it; the dev server serves an empty #root, so render from scratch.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
