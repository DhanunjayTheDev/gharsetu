import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Plus } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input, Textarea, Select } from '@/components/ui';
import { useCreateFeedback } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';

const FeedbackPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['my-feedback'],
    queryFn: async () => (await api.get('/feedback/my')).data,
  });
  const createFeedback = useCreateFeedback();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ entityType: 'property', entityId: '', rating: '5', comment: '' });

  const feedbacks = data?.data?.data || data?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createFeedback.mutate(
      { entityType: form.entityType, entityId: form.entityId, rating: Number(form.rating), comment: form.comment },
      { onSuccess: () => { setShowCreate(false); setForm({ entityType: 'property', entityId: '', rating: '5', comment: '' }); } }
    );
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
            <p className="text-gray-500 mt-1">Your reviews and ratings</p>
          </div>
          <Button onClick={() => setShowCreate(true)}><Plus size={18} className="mr-2" />Leave Feedback</Button>
        </div>
      </motion.div>

      {(!Array.isArray(feedbacks) || feedbacks.length === 0) ? (
        <EmptyState icon={<MessageSquare size={48} />} title="No feedback" description="Your submitted feedback will appear here" />
      ) : (
        <div className="space-y-4">
          {feedbacks.map((f: any) => (
            <Card key={f._id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= f.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <Badge variant="secondary">{f.entityType}</Badge>
                  </div>
                  <p className="text-gray-600 mt-2">{f.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(f.createdAt)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Leave Feedback">
        <form onSubmit={handleCreate} className="space-y-4">
          <Select label="Entity Type" value={form.entityType} onChange={(e) => setForm({ ...form, entityType: e.target.value })}
            options={[{value:'property',label:'Property'},{value:'agent',label:'Agent'},{value:'service',label:'Service'}]} placeholder="Select entity type" />
          <Input label="Entity ID" required value={form.entityId} onChange={(e) => setForm({ ...form, entityId: e.target.value })} placeholder="ID of the entity" />
          <Select label="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}
            options={[{value:'5',label:'5 Stars'},{value:'4',label:'4 Stars'},{value:'3',label:'3 Stars'},{value:'2',label:'2 Stars'},{value:'1',label:'1 Star'}]} placeholder="Select rating" />
          <Textarea label="Comment" rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Share your experience..." />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createFeedback.isPending}>Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FeedbackPage;
