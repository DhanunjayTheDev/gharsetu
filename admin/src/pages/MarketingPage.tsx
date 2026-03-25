import React from 'react';
import { motion } from 'framer-motion';
import { Megaphone, Eye, MousePointer, Users } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, StatCard } from '@/components/ui';
import { useCampaigns } from '@/hooks';
import { formatPrice } from '@/lib/utils';

const MarketingPage: React.FC = () => {
  const { data, isLoading } = useCampaigns({ limit: 20 });
  const campaigns = data?.data?.data || [];

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Marketing Campaigns</h1>
        <p className="text-gray-500 mt-1">Manage property marketing and lead generation</p>
      </motion.div>

      {campaigns.length === 0 ? (
        <EmptyState icon={<Megaphone size={48} />} title="No campaigns" description="Your marketing campaigns will appear here" />
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard title="Total Campaigns" value={campaigns.length} icon={<Megaphone size={24} />} />
            <StatCard title="Total Leads" value={campaigns.reduce((sum: number, c: any) => sum + (c.leads?.length || 0), 0)} icon={<Users size={24} />} />
            <StatCard title="Total Views" value={campaigns.reduce((sum: number, c: any) => sum + (c.analytics?.views || 0), 0)} icon={<Eye size={24} />} />
          </div>
          <div className="space-y-4">
            {campaigns.map((c: any) => (
              <Card key={c._id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{c.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{c.description?.substring(0, 100)}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {c.budget && <span>{formatPrice(c.budget)} budget</span>}
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {c.analytics?.views || 0} views</span>
                      <span className="flex items-center gap-1"><MousePointer className="w-3.5 h-3.5" /> {c.analytics?.clicks || 0} clicks</span>
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.leads?.length || 0} leads</span>
                    </div>
                  </div>
                  <Badge variant={c.status === 'active' ? 'success' : c.status === 'completed' ? 'secondary' : 'warning'}>{c.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketingPage;
