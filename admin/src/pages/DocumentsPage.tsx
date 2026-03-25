import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, Download } from 'lucide-react';
import { Card, Badge, Spinner, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const DocumentsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => (await api.get('/documents/my')).data,
  });

  const documents = data?.data?.data || data?.data || [];

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-500 mt-1">Manage your uploaded documents and contracts</p>
      </motion.div>

      {(!Array.isArray(documents) || documents.length === 0) ? (
        <EmptyState icon={<FileText size={48} />} title="No documents" description="Your uploaded documents will appear here" />
      ) : (
        <div className="space-y-3">
          {documents.map((doc: any) => (
            <Card key={doc._id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.title || doc.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(doc.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}>{doc.status}</Badge>
                  {doc.url && (
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-100 rounded-lg">
                      <Download className="w-4 h-4 text-gray-500" />
                    </a>
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

export default DocumentsPage;
