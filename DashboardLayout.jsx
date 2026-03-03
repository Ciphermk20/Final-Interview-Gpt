import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Video, FileText, Settings, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      navigate('/login'); // Kick them out if not logged in
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Practice', path: '/interview', icon: <Video size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  if (!user) return null; // Prevent flicker while checking auth

  return (
    <div className="flex h-screen bg-apple-gray dark:bg-apple-dark overflow-hidden">
      {/* Sidebar Navigation */}
      <nav className="w-64 glass-panel m-4 flex flex-col justify-between hidden md:flex border-r border-white/20">
        <div>
          <div className="p-6 text-xl font-bold tracking-tight text-apple-blue border-b border-white/10">
            InterviewGPT
          </div>
          <ul className="p-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-apple-blue text-white shadow-md' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-black/20'
                    }`}
                  >
                    {link.icon} <span className="font-medium">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* User Profile & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/40 dark:bg-black/20">
            <div className="bg-apple-blue/20 p-2 rounded-full text-apple-blue">
              <User size={20} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </nav>

      [Image of iOS-inspired SaaS dashboard with glassmorphism sidebar]

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* The Outlet acts as a placeholder where your specific pages (like Dashboard.jsx) will load */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashboardLayout;