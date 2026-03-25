import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Plus, MapPin, Eye, Trash2, Edit } from 'lucide-react';
import { Button, Badge, Card, Spinner, EmptyState, Pagination } from '@/components/ui';
import { useProperties, useDeleteProperty } from '@/hooks';
import { formatPrice, formatDate } from '@/lib/utils';

const PropertiesPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProperties({ page, limit: 10 });
  const deleteProperty = useDeleteProperty();

  const properties = data?.data?.data || [];
  const pagination = data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-500 mt-1">Manage your property listings</p>
          </div>
          <Link to="/properties/create">
            <Button><Plus size={18} className="mr-2" />Add Property</Button>
          </Link>
        </div>
      </motion.div>

      {properties.length === 0 ? (
        <EmptyState
          icon={<Building2 size={48} />}
          title="No properties yet"
          description="Start by adding your first property listing"
          action={<Link to="/properties/create"><Button>Add Property</Button></Link>}
        />
      ) : (
        <>
          <div className="space-y-4">
            {properties.map((property: any) => (
              <Card key={property._id} className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    {property.images?.[0] ? (
                      <img src={property.images[0]} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Building2 className="w-6 h-6 text-gray-300" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{property.title}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {property.address?.city}, {property.address?.state}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={property.purpose === 'sale' ? 'primary' : 'success'}>{property.purpose}</Badge>
                      <Badge variant={property.status === 'active' ? 'success' : 'secondary'}>{property.status}</Badge>
                      <span className="text-sm font-semibold text-primary-600">{formatPrice(property.price)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteProperty.mutate(property._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {pagination && pagination.meta?.totalPages > 1 && (
            <Pagination page={page} totalPages={pagination.meta.totalPages} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
};

export default PropertiesPage;
