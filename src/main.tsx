import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { PGliteProvider } from '@electric-sql/pglite-react';
import { db } from './dbinit';

import router from './router';

const rootEl = document.getElementById('root')!;

createRoot(rootEl).render(
  <StrictMode>
    <PGliteProvider db={db}>
      <RouterProvider router={router} />
    </PGliteProvider>
  </StrictMode>,
);
