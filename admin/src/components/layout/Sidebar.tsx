import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, FileText, Gavel, Users, Truck,
  Megaphone, Calendar, MessageSquare, CreditCard, Settings,
  ChevronLeft, Shield, Handshake, ClipboardList, Home, Bell,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[]; // which roles can see this item
}

// Role-based navigation configuration
// admin sees EVERYTHING
const ALL_ROLES = Object.values(UserRole);

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
    roles: ALL_ROLES,
  },
  {
    label: 'Properties',
    path: '/properties',
    icon: Building2,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUILDER, UserRole.PROPERTY_MANAGER],
  },
  {
    label: 'Inquiries',
    path: '/inquiries',
    icon: MessageSquare,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.TENANT, UserRole.BUILDER],
  },
  {
    label: 'Buy / Sell',
    path: '/buy-sell',
    icon: Handshake,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.BUILDER],
  },
  {
    label: 'Rentals',
    path: '/rentals',
    icon: Home,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.TENANT, UserRole.PROPERTY_MANAGER],
  },
  {
    label: 'Legal Services',
    path: '/legal',
    icon: Gavel,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.TENANT, UserRole.LEGAL_ADVISOR, UserRole.BUILDER],
  },
  {
    label: 'Joint Ventures',
    path: '/joint-ventures',
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUILDER],
  },
  {
    label: 'Packers & Movers',
    path: '/packers',
    icon: Truck,
    roles: [UserRole.ADMIN, UserRole.BUYER, UserRole.TENANT, UserRole.PACKERS_MOVERS],
  },
  {
    label: 'Prop. Management',
    path: '/prop-management',
    icon: ClipboardList,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.PROPERTY_MANAGER],
  },
  {
    label: 'Marketing',
    path: '/marketing',
    icon: Megaphone,
    roles: [UserRole.ADMIN, UserRole.BUILDER, UserRole.MARKETING_PARTNER],
  },
  {
    label: 'Scheduling',
    path: '/scheduling',
    icon: Calendar,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.TENANT, UserRole.LEGAL_ADVISOR, UserRole.BUILDER],
  },
  {
    label: 'Payments',
    path: '/payments',
    icon: CreditCard,
    roles: ALL_ROLES,
  },
  {
    label: 'Documents',
    path: '/documents',
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.PROPERTY_OWNER, UserRole.BUYER, UserRole.LEGAL_ADVISOR, UserRole.BUILDER, UserRole.PROPERTY_MANAGER],
  },
  {
    label: 'Feedback',
    path: '/feedback',
    icon: MessageSquare,
    roles: ALL_ROLES,
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: Bell,
    roles: ALL_ROLES,
  },
  {
    label: 'Admin Panel',
    path: '/admin',
    icon: Shield,
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
    roles: ALL_ROLES,
  },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
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
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));

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
