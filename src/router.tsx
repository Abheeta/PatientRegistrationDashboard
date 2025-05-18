import { createBrowserRouter } from 'react-router';

let router = createBrowserRouter([
  {
    path: '/query',
    lazy: {
      Component: async () => (await import('@/pages/QueryPatient')).QueryPatient,
    },
  },
  {
    path: '/register',
    lazy: {
      Component: async () => (await import('@/pages/RegisterPatient')).RegisterPatient,
    },
  },
]);

export default router;
