import React, { useContext } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggleButton = ({ className = '', showLabel = true }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to Light' : 'Switch to Dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark
          ? 'border-slate-700 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-slate-100 hover:from-slate-900 hover:to-slate-700 focus:ring-slate-400 focus:ring-offset-slate-950'
          : 'border-amber-200 bg-gradient-to-r from-amber-100 via-yellow-50 to-white text-amber-950 hover:from-amber-50 hover:to-yellow-50 focus:ring-amber-300 focus:ring-offset-white'
      } ${className}`}
      aria-label={label}
      title={label}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-full text-base ${
          isDark ? 'bg-slate-800 text-amber-200' : 'bg-amber-200 text-amber-950'
        }`}
      >
        {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
      </span>
      {showLabel ? <span className="tracking-wide">{label}</span> : null}
    </button>
  );
};

export default ThemeToggleButton;
