import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Plus, Clock } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input, Select, Textarea } from '@/components/ui';
import { useLegalCases, useCreateLegalCase } from '@/hooks';
import { formatDate } from '@/lib/utils';

const LegalPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLegalCases({ page, limit: 10 });
  const createCase = useCreateLegalCase();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'title_search', property: '', description: '' });

  const cases = data?.data?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createCase.mutate(form, { onSuccess: () => { setShowCreate(false); setForm({ title: '', type: 'title_search', property: '', description: '' }); } });
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Legal Services</h1>
            <p className="text-gray-500 mt-1">Manage legal cases and documentation</p>
          </div>
          <Button onClick={() => setShowCreate(true)}><Plus size={18} className="mr-2" />New Case</Button>
        </div>
      </motion.div>

      {cases.length === 0 ? (
        <EmptyState icon={<Gavel size={48} />} title="No legal cases" description="Your legal cases and service requests will appear here" />
      ) : (
        <div className="space-y-4">
          {cases.map((c: any) => (
            <Card key={c._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{c.title}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary">{c.type?.replace('_', ' ')}</Badge>
                    <span className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDate(c.createdAt)}</span>
                  </div>
                  {c.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{c.description}</p>}
                  {c.advisor && <p className="text-xs text-gray-400 mt-2">Advisor: {c.advisor.firstName} {c.advisor.lastName}</p>}
                </div>
                <Badge variant={c.status === 'resolved' ? 'success' : c.status === 'in_progress' ? 'warning' : 'secondary'}>{c.status?.replace('_', ' ')}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Legal Case">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Title search for Plot #123" />
          <Select label="Case Type" required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[{value:'title_search',label:'Title Search'},{value:'registration',label:'Registration'},{value:'dispute',label:'Dispute'},{value:'documentation',label:'Documentation'},{value:'compliance',label:'Compliance'},{value:'mutation',label:'Mutation'},{value:'inheritance',label:'Inheritance'}]} placeholder="Select case type" />
          <Input label="Property ID (optional)" value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} placeholder="Link to a property" />
          <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your legal requirement..." />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createCase.isPending}>Create Case</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LegalPage;
