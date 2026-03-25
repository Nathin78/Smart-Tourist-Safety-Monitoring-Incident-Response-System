import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import ThemeToggleButton from './ThemeToggleButton';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const homePath = isAdmin ? '/admin' : '/dashboard';
  const navItems = isAdmin
    ? [{ label: 'Admin', path: '/admin' }]
    : [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Map', path: '/map' },
        { label: 'Report', path: '/report-incident' },
      ];

  const sharedItems = [
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="border-b border-slate-200 bg-white text-slate-700 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <div className="flex items-center">
            {toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="mr-4 rounded-md p-2 transition-colors hover:bg-slate-100 md:hidden"
              >
                <FiMenu size={24} />
              </button>
            )}
            <Link to={homePath} className="text-2xl font-bold tracking-wide text-slate-900">
              TouristSafe
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-2">
              {[...navItems, ...sharedItems].map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-sm text-slate-600">
              {user?.name || 'User'}
            </span>
            <ThemeToggleButton />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              <FiLogOut size={20} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
