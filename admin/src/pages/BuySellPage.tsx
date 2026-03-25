import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Plus, IndianRupee, Clock } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, Button, Modal, Input, Textarea } from '@/components/ui';
import { useOffers, useCreateOffer } from '@/hooks';
import { formatPrice, formatDate } from '@/lib/utils';

const BuySellPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOffers({ page, limit: 10 });
  const createOffer = useCreateOffer();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ property: '', amount: '', message: '' });

  const offers = data?.data?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createOffer.mutate(
      { property: form.property, amount: Number(form.amount), message: form.message },
      { onSuccess: () => { setShowCreate(false); setForm({ property: '', amount: '', message: '' }); } }
    );
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Buy / Sell Offers</h1>
            <p className="text-gray-500 mt-1">Manage purchase offers and negotiations</p>
          </div>
          <Button onClick={() => setShowCreate(true)}><Plus size={18} className="mr-2" />New Offer</Button>
        </div>
      </motion.div>

      {offers.length === 0 ? (
        <EmptyState icon={<Handshake size={48} />} title="No offers yet" description="Your purchase offers and negotiations will appear here" />
      ) : (
        <div className="space-y-4">
          {offers.map((offer: any) => (
            <Card key={offer._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">{offer.property?.title || 'Property'}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {formatPrice(offer.amount)}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatDate(offer.createdAt)}</span>
                  </div>
                  {offer.message && <p className="text-gray-600 text-sm mt-2">{offer.message}</p>}
                </div>
                <Badge variant={offer.status === 'accepted' ? 'success' : offer.status === 'rejected' ? 'danger' : offer.status === 'negotiating' ? 'warning' : 'secondary'}>{offer.status}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Submit Offer">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Property ID" required value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })} placeholder="Paste the property ID" />
          <Input label="Offer Amount" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g., 5000000" />
          <Textarea label="Message (optional)" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Add a note to the seller..." />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createOffer.isPending}>Submit Offer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BuySellPage;
