import { createBrowserRouter } from 'react-router';

let router = createBrowserRouter([
  {
    path: '/',
    lazy: {
      Component: async () => (await import('@/pages/RegisterPatient')).RegisterPatient,
    },
  },
]);

export default router;
