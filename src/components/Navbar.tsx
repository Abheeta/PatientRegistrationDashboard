import { Link } from 'react-router';
import { useLocation } from 'react-router';

export function Navbar() {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard';
      case '/register':
        return 'Register Patient';
      case '/query':
        return 'Query Patients';
      default:
        return 'Patient Management';
    }
  };

  return (
    <nav className="w-full py-4 px-6">
      <Link to="/" className="text-xl font-semibold">
        {getPageTitle()}
      </Link>
    </nav>
  );
}
