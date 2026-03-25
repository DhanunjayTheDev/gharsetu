import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, FileText, Gavel, Users, Truck,
  Megaphone, Calendar, MessageSquare, CreditCard, Settings,
  ChevronLeft, Shield, Handshake, ClipboardList, Home,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles?: string[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Properties', path: '/dashboard/properties', icon: Building2 },
  { label: 'Inquiries', path: '/dashboard/inquiries', icon: MessageSquare },
  { label: 'Buy / Sell', path: '/dashboard/buy-sell', icon: Handshake },
  { label: 'Rentals', path: '/dashboard/rentals', icon: Home },
  { label: 'Legal Services', path: '/dashboard/legal', icon: Gavel },
  { label: 'Joint Ventures', path: '/dashboard/joint-ventures', icon: Users },
  { label: 'Packers & Movers', path: '/dashboard/packers', icon: Truck },
  { label: 'Prop. Management', path: '/dashboard/prop-management', icon: ClipboardList },
  { label: 'Marketing', path: '/dashboard/marketing', icon: Megaphone },
  { label: 'Scheduling', path: '/dashboard/scheduling', icon: Calendar },
  { label: 'Payments', path: '/dashboard/payments', icon: CreditCard },
  { label: 'Documents', path: '/dashboard/documents', icon: FileText },
  { label: 'Feedback', path: '/dashboard/feedback', icon: MessageSquare },
  { label: 'Admin Panel', path: '/dashboard/admin', icon: Shield, roles: ['admin', 'super_admin'] },
  { label: 'Settings', path: '/dashboard/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  const filteredItems = navItems.filter(
    item => !item.roles || (user && item.roles.includes(user.role))
  );

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-50
          transition-transform duration-300 ease-in-out w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 lg:hidden">
          <span className="font-semibold text-gray-800">Menu</span>
          <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-3.5rem)] lg:h-full">
          {filteredItems.map(item => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
