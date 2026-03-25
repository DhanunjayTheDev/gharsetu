import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Plus, Clock, IndianRupee } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input } from '@/components/ui';
import { useRentals, useCreateRental } from '@/hooks';
import { formatPrice, formatDate } from '@/lib/utils';

const RentalsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRentals({ page, limit: 10 });
  const createRental = useCreateRental();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ property: '', tenant: '', monthlyRent: '', startDate: '', endDate: '' });

  const rentals = data?.data?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createRental.mutate(
      { ...form, monthlyRent: Number(form.monthlyRent) },
      { onSuccess: () => { setShowCreate(false); setForm({ property: '', tenant: '', monthlyRent: '', startDate: '', endDate: '' }); } }
    );
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rental Agreements</h1>
            <p className="text-gray-500 mt-1">Manage rental agreements and tenancies</p>
          </div>
          <Button onClick={() => setShowCreate(true)}><Plus size={18} className="mr-2" />New Agreement</Button>
        </div>
      </motion.div>

      {rentals.length === 0 ? (
        <EmptyState icon={<Home size={48} />} title="No rental agreements" description="Your rental agreements will appear here" />
      ) : (
        <div className="space-y-4">
          {rentals.map((rental: any) => (
            <Card key={rental._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{rental.property?.title || 'Property'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {formatPrice(rental.monthlyRent)}/mo</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatDate(rental.startDate)} - {formatDate(rental.endDate)}</span>
                  </div>
                </div>
                <Badge variant={rental.status === 'active' ? 'success' : rental.status === 'expired' ? 'danger' : 'secondary'}>{rental.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Rental Agreement">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Property ID" required value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} />
          <Input label="Tenant ID" required value={form.tenant} onChange={(e) => setForm({ ...form, tenant: e.target.value })} />
          <Input label="Monthly Rent" type="number" required value={form.monthlyRent} onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <Input label="End Date" type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createRental.isPending}>Create Agreement</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RentalsPage;
