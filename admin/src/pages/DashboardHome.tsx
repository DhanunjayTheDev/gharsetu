import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, MessageSquare, Calendar, CreditCard,
  Plus, FileText,
} from 'lucide-react';
import { StatCard, Card, Spinner, Button } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useProperties, useInquiries } from '@/hooks';

const DashboardHome: React.FC = () => {
  const { user } = useAuthStore();
  const { data: propData, isLoading: loadingProps } = useProperties({ limit: 5 });
  const { data: inqData } = useInquiries({ limit: 5 });

  const properties = propData?.data?.data || [];
  const inquiries = inqData?.data?.data || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-500 mt-1">Here's an overview of your activity</p>
          </div>
          <Link to="/properties/create">
            <Button>
              <Plus size={18} className="mr-2" />
              List Property
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard title="My Properties" value={propData?.meta?.total || 0} icon={<Building2 size={24} />} trend={{ value: 12, isPositive: true }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard title="Inquiries" value={inqData?.meta?.total || 0} icon={<MessageSquare size={24} />} trend={{ value: 8, isPositive: true }} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard title="Scheduled Visits" value={0} icon={<Calendar size={24} />} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard title="Transactions" value={0} icon={<CreditCard size={24} />} />
        </motion.div>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'List Property', icon: Plus, link: '/properties/create', color: 'bg-blue-50 text-blue-600' },
            { label: 'View Inquiries', icon: MessageSquare, link: '/inquiries', color: 'bg-green-50 text-green-600' },
            { label: 'Legal Help', icon: FileText, link: '/legal', color: 'bg-purple-50 text-purple-600' },
            { label: 'Schedule Visit', icon: Calendar, link: '/scheduling', color: 'bg-amber-50 text-amber-600' },
          ].map(action => (
            <Link
              key={action.label}
              to={action.link}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Properties</h2>
            <Link to="/properties" className="text-sm text-primary-600 hover:underline">View All</Link>
          </div>
          {loadingProps ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : properties.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No properties listed yet</p>
          ) : (
            <div className="space-y-3">
              {properties.slice(0, 5).map((p: any) => (
                <div key={p._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {p.images?.[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.address?.city}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary-600 whitespace-nowrap">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
            <Link to="/inquiries" className="text-sm text-primary-600 hover:underline">View All</Link>
          </div>
          {inquiries.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No inquiries yet</p>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 5).map((inq: any) => (
                <div key={inq._id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {inq.user?.firstName?.[0] || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{inq.user?.firstName} {inq.user?.lastName}</p>
                    <p className="text-xs text-gray-500 truncate">{inq.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
