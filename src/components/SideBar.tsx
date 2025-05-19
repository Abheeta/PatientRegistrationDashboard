import { Link } from 'react-router';
import { Home, UserPlus, Database } from 'lucide-react';

interface SideBarProps {
  onItemClick?: () => void;
}

export function SideBar({ onItemClick }: SideBarProps) {
  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: 'Dashboard', path: '/' },
    { icon: <UserPlus className="h-5 w-5" />, label: 'Register Patient', path: '/register' },
    { icon: <Database className="h-5 w-5" />, label: 'Query Patients', path: '/query' },
  ];

  return (
    <div className="h-full py-6">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold">Patient Management</h2>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md mx-2"
            onClick={onItemClick}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
