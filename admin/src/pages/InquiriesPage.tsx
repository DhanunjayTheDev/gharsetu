import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Reply, Clock } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState, Pagination, Modal, Textarea, Button } from '@/components/ui';
import { useInquiries } from '@/hooks';
import { formatDateTime } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const InquiriesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useInquiries({ page, limit: 10 });
  const queryClient = useQueryClient();

  const [replyModal, setReplyModal] = useState<any>(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [replying, setReplying] = useState(false);

  const inquiries = data?.data?.data || [];
  const pagination = data?.data;

  const handleReply = async () => {
    if (!replyModal || !replyMsg.trim()) return;
    setReplying(true);
    try {
      await api.patch(`/inquiries/${replyModal._id}/respond`, { response: replyMsg });
      toast.success('Reply sent!');
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      setReplyModal(null);
      setReplyMsg('');
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-gray-500 mt-1">Manage property inquiries from potential buyers and renters</p>
      </motion.div>

      {inquiries.length === 0 ? (
        <EmptyState icon={<MessageSquare size={48} />} title="No inquiries yet" description="When someone inquires about your properties, it'll appear here" />
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq: any) => (
            <Card key={inq._id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                    {inq.user?.firstName?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{inq.user?.firstName} {inq.user?.lastName}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5" /> {formatDateTime(inq.createdAt)}
                    </p>
                    <p className="text-gray-600 mt-2">{inq.message}</p>
                    {inq.property && (
                      <p className="text-xs text-gray-400 mt-2">Property: <span className="text-primary-600">{inq.property.title}</span></p>
                    )}
                    {inq.response && (
                      <div className="bg-green-50 border border-green-100 rounded-lg p-3 mt-3">
                        <p className="text-xs text-green-600 font-medium mb-1">Your Reply:</p>
                        <p className="text-sm text-green-800">{inq.response}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={inq.status === 'responded' ? 'success' : inq.status === 'closed' ? 'secondary' : 'warning'}>{inq.status}</Badge>
                  {!inq.response && (
                    <Button size="sm" variant="secondary" onClick={() => setReplyModal(inq)}>
                      <Reply size={16} className="mr-1" /> Reply
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {pagination && pagination.totalPages > 1 && (
            <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
          )}
        </div>
      )}

      <Modal isOpen={!!replyModal} onClose={() => setReplyModal(null)} title="Reply to Inquiry">
        <div className="space-y-4">
          {replyModal && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500 mb-1">Original message:</p>
              <p className="text-sm text-gray-700">{replyModal.message}</p>
            </div>
          )}
          <Textarea label="Your Reply" rows={4} placeholder="Type your response..." value={replyMsg} onChange={(e) => setReplyMsg(e.target.value)} required />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setReplyModal(null)}>Cancel</Button>
            <Button onClick={handleReply} loading={replying} disabled={!replyMsg.trim()}>Send Reply</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InquiriesPage;
