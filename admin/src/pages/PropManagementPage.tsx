import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, IndianRupee, Wrench, Clock } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState } from '@/components/ui';
import { usePropertyManagement } from '@/hooks';
import { formatPrice, formatDate } from '@/lib/utils';

const PropManagementPage: React.FC = () => {
  const { data, isLoading } = usePropertyManagement({ limit: 20 });
  const items = data?.data?.data || [];

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
        <p className="text-gray-500 mt-1">Remote property management, rent tracking, and maintenance</p>
      </motion.div>

      {items.length === 0 ? (
        <EmptyState icon={<ClipboardList size={48} />} title="No managed properties" description="Your managed properties will appear here" />
      ) : (
        <div className="space-y-4">
          {items.map((pm: any) => (
            <Card key={pm._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{pm.property?.title || 'Property'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    {pm.monthlyRent && <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {formatPrice(pm.monthlyRent)}/mo</span>}
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Since {formatDate(pm.startDate)}</span>
                  </div>
                  {pm.maintenanceRequests?.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                      <Wrench className="w-3.5 h-3.5" />
                      {pm.maintenanceRequests.filter((m: any) => m.status === 'pending').length} pending maintenance requests
                    </div>
                  )}
                </div>
                <Badge variant={pm.status === 'active' ? 'success' : 'secondary'}>{pm.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropManagementPage;
