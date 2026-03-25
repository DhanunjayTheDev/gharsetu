import React from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, TrendingUp } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState } from '@/components/ui';
import { useJointVentures } from '@/hooks';
import { formatDate } from '@/lib/utils';

const JointVenturesPage: React.FC = () => {
  const { data, isLoading } = useJointVentures({ limit: 20 });
  const ventures = data?.data?.data || [];

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Joint Ventures</h1>
        <p className="text-gray-500 mt-1">Track joint development projects and partnerships</p>
      </motion.div>

      {ventures.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="No joint ventures" description="Your joint venture projects will appear here" />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {ventures.map((jv: any) => (
            <Card key={jv._id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{jv.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{jv.description?.substring(0, 100)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <Badge variant="secondary">{jv.stage?.replace('_', ' ')}</Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(jv.createdAt)}</span>
                  </div>
                  {jv.milestones?.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {jv.milestones.filter((m: any) => m.completed).length}/{jv.milestones.length} milestones completed
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${(jv.milestones.filter((m: any) => m.completed).length / jv.milestones.length) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JointVenturesPage;
