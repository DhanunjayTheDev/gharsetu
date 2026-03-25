import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, SlidersHorizontal, Grid3X3, List, Heart,
  BedDouble, Bath, Maximize, ChevronDown, X,
} from 'lucide-react';
import { Button, Badge, Card, Spinner, EmptyState, Pagination, Select, Input } from '@/components/ui';
import { useProperties } from '@/hooks';
import { formatPrice } from '@/lib/utils';

const propertyTypes = ['apartment', 'house', 'villa', 'plot', 'commercial', 'farmhouse', 'penthouse'];
const purposes = ['sale', 'rent', 'lease'];

const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filters = {
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
    search: searchParams.get('search') || '',
    purpose: searchParams.get('purpose') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    sort: searchParams.get('sort') || '-createdAt',
  };

  const { data, isLoading } = useProperties(filters);
  const properties = data?.data?.data || [];
  const pagination = data?.data;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="flex items-center gap-2 flex-1 max-w-xl w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, title..."
                  className="input-field pl-10"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
              </Button>
            </div>

            {/* View & Sort */}
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 ${view === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 ${view === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <select
                className="input-field py-2 text-sm"
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-area">Area: Largest First</option>
              </select>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 mt-4 pt-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <select
                  className="input-field text-sm"
                  value={filters.purpose}
                  onChange={(e) => updateFilter('purpose', e.target.value)}
                >
                  <option value="">All Purposes</option>
                  {purposes.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>

                <select
                  className="input-field text-sm"
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  {propertyTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>

                <input
                  type="text"
                  placeholder="City"
                  className="input-field text-sm"
                  value={filters.city}
                  onChange={(e) => updateFilter('city', e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Min Price"
                  className="input-field text-sm"
                  value={filters.minPrice || ''}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Max Price"
                  className="input-field text-sm"
                  value={filters.maxPrice || ''}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                />

                <select
                  className="input-field text-sm"
                  value={filters.bedrooms || ''}
                  onChange={(e) => updateFilter('bedrooms', e.target.value)}
                >
                  <option value="">Bedrooms</option>
                  {[1, 2, 3, 4, 5].map(b => <option key={b} value={b}>{b}+ BHK</option>)}
                </select>
              </div>
              <button onClick={clearFilters} className="text-sm text-primary-600 mt-3 hover:underline">
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : properties.length === 0 ? (
          <EmptyState
            title="No properties found"
            description="Try adjusting your filters or search criteria"
            action={<Button onClick={clearFilters}>Clear Filters</Button>}
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {pagination?.meta?.total || 0} properties found
            </p>

            <div className={view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {properties.map((property: any, i: number) => (
                <motion.div
                  key={property._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <PropertyCard property={property} view={view} />
                </motion.div>
              ))}
            </div>

            {pagination && pagination.meta?.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  page={pagination.meta?.page || 1}
                  totalPages={pagination.meta?.totalPages || 1}
                  onPageChange={(page) => updateFilter('page', String(page))}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const PropertyCard: React.FC<{ property: any; view: 'grid' | 'list' }> = ({ property, view }) => {
  const image = property.images?.[0] || '/placeholder-property.jpg';

  if (view === 'list') {
    return (
      <Link to={`/properties/${property._id}`} className="card flex overflow-hidden hover:shadow-md transition-shadow">
        <div className="w-48 h-36 flex-shrink-0 bg-gray-200">
          <img src={image} alt={property.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" /> {property.address?.city}, {property.address?.state}
              </p>
            </div>
            <Badge variant={property.purpose === 'sale' ? 'primary' : 'success'}>
              For {property.purpose}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            {property.bedrooms && (
              <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> {property.bedrooms} bed</span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} bath</span>
            )}
            {property.area && (
              <span className="flex items-center gap-1"><Maximize className="w-4 h-4" /> {property.area} sqft</span>
            )}
          </div>
          <p className="text-xl font-bold text-primary-600 mt-2">{formatPrice(property.price)}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/properties/${property._id}`} className="card overflow-hidden hover:shadow-md transition-shadow group block">
      <div className="relative h-48 bg-gray-200">
        <img src={image} alt={property.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3">
          <Badge variant={property.purpose === 'sale' ? 'primary' : 'success'}>
            For {property.purpose}
          </Badge>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
        >
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xl font-bold text-primary-600">{formatPrice(property.price)}</p>
        <h3 className="font-semibold text-gray-900 mt-1 truncate group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5" /> {property.address?.city}, {property.address?.state}
        </p>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
          {property.bedrooms && (
            <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5" /> {property.bedrooms}</span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> {property.bathrooms}</span>
          )}
          {property.area && (
            <span className="flex items-center gap-1"><Maximize className="w-3.5 h-3.5" /> {property.area} sqft</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertiesPage;
