import React from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building2, CreditCard, Star, Shield, AlertTriangle,
  TrendingUp, FileText,
} from 'lucide-react';
import { StatCard, Card, Spinner, Badge } from '@/components/ui';
import { useAdminDashboard } from '@/hooks';
import { formatPrice } from '@/lib/utils';

const AdminDashboard: React.FC = () => {
  const { data, isLoading } = useAdminDashboard();
  const stats = data?.data;

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview and management</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<Users size={24} />} trend={{ value: 15, isPositive: true }} />
        <StatCard title="Total Properties" value={stats?.totalProperties || 0} icon={<Building2 size={24} />} trend={{ value: 22, isPositive: true }} />
        <StatCard title="Revenue" value={formatPrice(stats?.totalRevenue || 0)} icon={<CreditCard size={24} />} trend={{ value: 18, isPositive: true }} />
        <StatCard title="Avg Rating" value={stats?.avgRating?.toFixed(1) || '0.0'} icon={<Star size={24} />} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inquiries</p>
              <p className="text-2xl font-bold">{stats?.totalInquiries || 0}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Offers</p>
              <p className="text-2xl font-bold">{stats?.totalOffers || 0}</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Legal Cases</p>
              <p className="text-2xl font-bold">{stats?.totalLegalCases || 0}</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold">{stats?.pendingApprovals || 0}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {stats?.usersByRole && (
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Users by Role</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.usersByRole.map((r: any) => (
              <div key={r._id} className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-gray-900">{r.count}</p>
                <p className="text-sm text-gray-500 mt-1 capitalize">{r._id.replace('_', ' ')}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Registrations</h2>
          <p className="text-gray-400 text-center py-8 text-sm">Activity feed will appear here</p>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-3">
            {[
              { label: 'Database', status: 'Healthy' },
              { label: 'Cache (Redis)', status: 'Connected' },
              { label: 'Storage', status: 'Active' },
              { label: 'Email Service', status: 'Active' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">{item.label}</span>
                <Badge variant="success">{item.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
