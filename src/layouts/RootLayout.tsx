import { Navbar } from '@/components/Navbar';
import { Outlet } from 'react-router';

export const RootLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
