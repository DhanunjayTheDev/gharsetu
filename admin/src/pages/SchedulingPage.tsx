import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input, Select, Textarea } from '@/components/ui';
import { useSchedules, useCreateSchedule } from '@/hooks';
import { formatDateTime } from '@/lib/utils';

const SchedulingPage: React.FC = () => {
  const { data, isLoading } = useSchedules({ limit: 20 });
  const createSchedule = useCreateSchedule();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ property: '', type: 'site_visit', date: '', time: '', notes: '' });

  const schedules = data?.data?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${form.date}T${form.time}`);
    createSchedule.mutate(
      { property: form.property, type: form.type, scheduledAt: dateTime.toISOString(), notes: form.notes },
      { onSuccess: () => { setShowCreate(false); setForm({ property: '', type: 'site_visit', date: '', time: '', notes: '' }); } }
    );
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scheduling</h1>
            <p className="text-gray-500 mt-1">Manage property visits and appointments</p>
          </div>
          <Button onClick={() => setShowCreate(true)}><Plus size={18} className="mr-2" />Schedule Visit</Button>
        </div>
      </motion.div>

      {schedules.length === 0 ? (
        <EmptyState icon={<Calendar size={48} />} title="No schedules" description="Your scheduled visits and appointments will appear here" />
      ) : (
        <div className="space-y-4">
          {schedules.map((s: any) => (
            <Card key={s._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{s.property?.title || 'Appointment'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <Badge variant="secondary">{s.type?.replace('_', ' ')}</Badge>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDateTime(s.scheduledAt)}</span>
                  </div>
                  {s.notes && <p className="text-sm text-gray-600 mt-2">{s.notes}</p>}
                </div>
                <Badge variant={s.status === 'confirmed' ? 'success' : s.status === 'completed' ? 'primary' : s.status === 'cancelled' ? 'danger' : 'warning'}>{s.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Schedule a Visit">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Property ID" required value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} placeholder="Property to visit" />
          <Select label="Type" required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[{value:'site_visit',label:'Site Visit'},{value:'inspection',label:'Inspection'},{value:'meeting',label:'Meeting'},{value:'consultation',label:'Consultation'}]} placeholder="Select type" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input label="Time" type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <Textarea label="Notes" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requirements..." />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createSchedule.isPending}>Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchedulingPage;
