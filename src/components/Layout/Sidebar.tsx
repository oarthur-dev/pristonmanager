import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Trophy, 
  Sword, 
  MessageSquare, 
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Profile', path: '/profile' },
    { icon: Trophy, label: 'Rankings', path: '/rankings' },
    { icon: Sword, label: 'Clans', path: '/clans' },
    { icon: MessageSquare, label: 'Support', path: '/support' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4 fixed left-0 top-0">
      <div className="flex items-center justify-center mb-8 pt-4">
        <h1 className="text-xl font-bold">Priston Tale Panel</h1>
      </div>
      
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        <button
          className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800 w-full mt-auto"
          onClick={() => {/* Add logout handler */}}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;