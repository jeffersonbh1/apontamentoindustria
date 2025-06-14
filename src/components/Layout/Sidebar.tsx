import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Building2,
  Users,
  Settings,
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Factory
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Building2, label: 'Companies', path: '/companies' },
    { icon: Users, label: 'Employees', path: '/employees' },
    { icon: Factory, label: 'Equipment', path: '/equipment' },
    { icon: Activity, label: 'Activities', path: '/activities' },
    { icon: BarChart3, label: 'Reports', path: '/reports' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Factory className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-800 dark:text-white">
                Production Tracker
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors group ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed && user && (
          <div className="mb-3">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors group ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
          {isCollapsed && (
            <div className="absolute left-16 bg-gray-800 text-white px-2 py-1 rounded-md text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;