import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Clock } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState } from '@/components/ui';
import { useNotifications, useMarkRead } from '@/hooks';
import { formatDateTime } from '@/lib/utils';

const NotificationsPage: React.FC = () => {
  const { data, isLoading } = useNotifications();
  const markRead = useMarkRead();

  const notifications = data?.data?.data || data?.data || [];

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 mt-1">Stay updated on your activity</p>
      </motion.div>

      {(!Array.isArray(notifications) || notifications.length === 0) ? (
        <EmptyState icon={<Bell size={48} />} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => (
            <Card key={n._id} className={`p-4 transition-colors ${!n.isRead ? 'bg-primary-50/50 border-primary-100' : ''}`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.isRead ? 'bg-primary-600' : 'bg-gray-200'}`} />
                <div className="flex-1">
                  <p className={`text-sm ${!n.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>{n.title}</p>
                  {n.message && <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>}
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDateTime(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <button onClick={() => markRead.mutate(n._id)} className="text-primary-600 hover:text-primary-700 p-1" title="Mark as read">
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
