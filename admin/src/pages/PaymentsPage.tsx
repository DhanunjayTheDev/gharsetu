import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, IndianRupee, Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, StatCard } from '@/components/ui';
import { usePayments } from '@/hooks';
import { formatPrice, formatDate } from '@/lib/utils';

const PaymentsPage: React.FC = () => {
  const { data, isLoading } = usePayments({ limit: 50 });
  const payments = data?.data?.data || [];

  const totalPaid = payments.filter((p: any) => p.status === 'completed').reduce((sum: number, p: any) => sum + p.amount, 0);
  const totalPending = payments.filter((p: any) => p.status === 'pending').reduce((sum: number, p: any) => sum + p.amount, 0);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 mt-1">Track your transactions and payment history</p>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard title="Total Paid" value={formatPrice(totalPaid)} icon={<CreditCard size={24} />} />
        <StatCard title="Pending" value={formatPrice(totalPending)} icon={<Clock size={24} />} />
        <StatCard title="Transactions" value={payments.length} icon={<IndianRupee size={24} />} />
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={<CreditCard size={48} />} title="No payments" description="Your payment history will appear here" />
      ) : (
        <Card>
          <div className="divide-y divide-gray-100">
            {payments.map((p: any) => (
              <div key={p._id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${p.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {p.type === 'credit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.description || p.purpose || 'Payment'}</p>
                    <p className="text-xs text-gray-500">{formatDate(p.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${p.type === 'credit' ? 'text-green-600' : 'text-gray-900'}`}>
                    {p.type === 'credit' ? '+' : '-'}{formatPrice(p.amount)}
                  </p>
                  <Badge variant={p.status === 'completed' ? 'success' : p.status === 'failed' ? 'danger' : 'warning'} className="text-xs">{p.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default PaymentsPage;
