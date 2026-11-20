import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import { ResourcePage, resourcePages } from './Resources';
import './index.css';

const root = document.getElementById('root')!;
const path = window.location.pathname.replace(/\/+$/, '');
const resource = resourcePages.find(page => page.path === path);
const app = (
  <StrictMode>
    {resource ? <ResourcePage path={resource.path} /> : <App />}
  </StrictMode>
);

// The production build prerenders the page into #root (scripts/prerender.mjs),
// so hydrate it; the dev server serves an empty #root, so render from scratch.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
