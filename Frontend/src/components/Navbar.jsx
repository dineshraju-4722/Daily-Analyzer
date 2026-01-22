import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  const navLinks = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/topics', label: 'Topics', icon: '📖' },
    { path: '/add-question', label: 'Add Question', icon: '✍️' },
    { path: '/reminders', label: 'Reminders', icon: '⏰' },
    { path: '/daily-progress', label: 'Daily Progress', icon: '📊' }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white z-30 flex items-center justify-between px-4">
        <span className="text-xl font-bold">🎯 DSA Tracker</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-indigo-600 to-indigo-700 text-white z-40 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between gap-3 border-b-2 border-white/20 md:justify-start">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🎯</div>
            <span className="text-2xl font-bold hidden md:inline">DSA Tracker</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-6 space-y-3 overflow-y-auto">
          {navLinks.map(({ path, label, icon }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(path)
                  ? 'bg-white/25 shadow-lg border-l-4 border-white'
                  : 'hover:bg-white/15'
              }`}
            >
              <span className="text-2xl">{icon}</span>
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30 mt-16"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
