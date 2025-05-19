import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';

let router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        lazy: {
          Component: async () => (await import('@/pages/Dashboard')).Dashboard,
        },
      },
      {
        path: 'register',
        lazy: {
          Component: async () => (await import('@/pages/RegisterPatient')).RegisterPatient,
        },
      },
      {
        path: 'query',
        lazy: {
          Component: async () => (await import('@/pages/QueryPatient')).QueryPatient,
        },
      },
    ],
  },
]);

export default router;
