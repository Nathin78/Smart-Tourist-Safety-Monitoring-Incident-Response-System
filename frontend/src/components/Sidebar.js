import React, { useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiHome,
  FiMap,
  FiAlertCircle,
  FiPhoneOff,
  FiSettings,
} from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { isAdmin } = useContext(AuthContext);

  const menuItems = useMemo(() => {
    if (isAdmin) {
      return [{ icon: FiSettings, label: 'Admin Dashboard', path: '/admin' }];
    }

    return [
      { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
      { icon: FiMap, label: 'Live Map', path: '/map' },
      { icon: FiAlertCircle, label: 'Report Incident', path: '/report-incident' },
      { icon: FiPhoneOff, label: 'SOS Button', path: '/sos' },
    ];
  }, [isAdmin]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen w-[22rem] max-w-[100vw] md:w-80 transform transition-transform duration-300 z-50 border-r border-slate-200 bg-white text-slate-700 shadow-[12px_0_30px_rgba(15,23,42,0.08)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="px-7 py-8">
          <h2 className="mb-10 text-4xl font-bold leading-none tracking-wide text-slate-900">
            Menu
          </h2>
          <nav className="space-y-4">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center gap-4 rounded-[1.6rem] border border-slate-200 bg-slate-50 px-5 py-4 transition-colors hover:bg-slate-100"
                onClick={toggleSidebar}
              >
                <item.icon size={22} />
                <span className="text-xl font-semibold leading-none">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
