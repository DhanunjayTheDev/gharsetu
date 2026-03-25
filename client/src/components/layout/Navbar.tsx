import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Menu, X, LogOut, User, ChevronDown,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Avatar } from '@/components/ui';
import { getRoleName } from '@/lib/utils';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Ghar <span className="text-primary-600">Setu</span>
              </span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/properties" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Properties
            </Link>
            <Link to="/services" className="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
              Services
            </Link>
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100"
                  >
                    <Avatar name={`${user!.firstName} ${user!.lastName}`} src={user!.avatar} size="sm" />
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium">{user!.firstName} {user!.lastName}</p>
                        <p className="text-xs text-gray-500">{getRoleName(user!.role)}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden border-t border-gray-100 bg-white"
        >
          <div className="px-4 py-4 space-y-3">
            <Link to="/properties" className="block text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Properties
            </Link>
            <Link to="/services" className="block text-sm font-medium text-gray-600" onClick={() => setMenuOpen(false)}>
              Services
            </Link>
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" className="btn-secondary text-center" onClick={() => setMenuOpen(false)}>Log In</Link>
                <Link to="/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </div>
            ) : (
              <button onClick={handleLogout} className="text-sm font-medium text-red-600">Sign Out</button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};
