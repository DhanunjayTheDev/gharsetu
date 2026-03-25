import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Plus, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input, Select, Textarea } from '@/components/ui';
import { usePackersBookings, useCreatePackersBooking } from '@/hooks';
import { formatDate, formatPrice } from '@/lib/utils';

const PackersPage: React.FC = () => {
  const { data, isLoading } = usePackersBookings({ limit: 20 });
  const createBooking = useCreatePackersBooking();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ fromAddress: '', toAddress: '', moveDate: '', propertyType: 'apartment', itemCount: '', notes: '' });

  const bookings = data?.data?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking.mutate(
      { ...form, itemCount: Number(form.itemCount) || undefined },
      { onSuccess: () => { setShowCreate(false); setForm({ fromAddress: '', toAddress: '', moveDate: '', propertyType: 'apartment', itemCount: '', notes: '' }); } }
    );
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Packers & Movers</h1>
            <p className="text-gray-500 mt-1">Book and track relocation services</p>
          </div>
          <Button onClick={() => setShowCreate(true)}><Plus size={18} className="mr-2" />New Booking</Button>
        </div>
      </motion.div>

      {bookings.length === 0 ? (
        <EmptyState icon={<Truck size={48} />} title="No bookings" description="Book packers and movers for your relocation needs" />
      ) : (
        <div className="space-y-4">
          {bookings.map((b: any) => (
            <Card key={b._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{b.fromAddress}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-600">{b.toAddress}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(b.moveDate)}</span>
                    {b.estimatedCost && <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {formatPrice(b.estimatedCost)}</span>}
                  </div>
                </div>
                <Badge variant={b.status === 'completed' ? 'success' : b.status === 'in_transit' ? 'warning' : 'secondary'}>{b.status?.replace('_', ' ')}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Book Packers & Movers">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="From Address" required value={form.fromAddress} onChange={(e) => setForm({ ...form, fromAddress: e.target.value })} placeholder="Current address" />
          <Input label="To Address" required value={form.toAddress} onChange={(e) => setForm({ ...form, toAddress: e.target.value })} placeholder="Destination address" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Move Date" type="date" required value={form.moveDate} onChange={(e) => setForm({ ...form, moveDate: e.target.value })} />
            <Select label="Property Type" value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
              options={[{value:'apartment',label:'Apartment'},{value:'house',label:'House'},{value:'office',label:'Office'},{value:'commercial',label:'Commercial'}]} placeholder="Select type" />
          </div>
          <Input label="Approx. Item Count" type="number" value={form.itemCount} onChange={(e) => setForm({ ...form, itemCount: e.target.value })} />
          <Textarea label="Notes" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special requirements..." />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createBooking.isPending}>Book Now</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PackersPage;
