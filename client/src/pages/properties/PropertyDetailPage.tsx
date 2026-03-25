import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, BedDouble, Bath, Maximize, Calendar, User, Phone,
  Mail, ChevronLeft, ChevronRight, Heart, Share2, MessageSquare,
  Building2, Clock, Shield, Star,
} from 'lucide-react';
import { Button, Badge, Spinner, Card, Modal, Input, Textarea } from '@/components/ui';
import { useProperty, useCreateInquiry } from '@/hooks';
import { useAuthStore } from '@/stores/authStore';
import { formatPrice, formatDate } from '@/lib/utils';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading } = useProperty(id!);
  const createInquiry = useCreateInquiry();

  const [currentImage, setCurrentImage] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryMsg, setInquiryMsg] = useState('');

  const property = data?.data;

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Property Not Found</h2>
        <p className="text-gray-500 mt-2">The property you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/properties')} className="mt-4">Browse Properties</Button>
      </div>
    );
  }

  const images = property.images?.length ? property.images : ['/placeholder-property.jpg'];

  const handleInquiry = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    createInquiry.mutate(
      { property: property._id, message: inquiryMsg },
      { onSuccess: () => { setShowInquiry(false); setInquiryMsg(''); } }
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Image gallery */}
      <div className="bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[400px] lg:h-[500px]">
            <img
              src={images[currentImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentImage(i => (i + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        i === currentImage ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={property.purpose === 'sale' ? 'primary' : 'success'}>
                      For {property.purpose}
                    </Badge>
                    <Badge variant="secondary">{property.type}</Badge>
                    {property.verification?.isVerified && (
                      <Badge variant="success"><Shield className="w-3 h-3 mr-1" /> Verified</Badge>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
                  <p className="text-gray-500 flex items-center gap-1 mt-2">
                    <MapPin className="w-4 h-4" />
                    {property.location?.address}, {property.location?.city}, {property.location?.state} {property.location?.pincode}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Heart className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Share2 className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="text-4xl font-bold text-primary-600 mt-4">
                {formatPrice(property.price)}
                {property.purpose === 'rent' && <span className="text-lg text-gray-400 font-normal">/month</span>}
              </div>
            </motion.div>

            {/* Quick Info */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {property.bedrooms != null && (
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <BedDouble className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                    <p className="font-semibold">{property.bedrooms}</p>
                    <p className="text-xs text-gray-500">Bedrooms</p>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Bath className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                    <p className="font-semibold">{property.bathrooms}</p>
                    <p className="text-xs text-gray-500">Bathrooms</p>
                  </div>
                )}
                {property.area && (
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Maximize className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                    <p className="font-semibold">{property.area.value}</p>
                    <p className="text-xs text-gray-500">{property.area.unit}</p>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                    <p className="font-semibold">{property.yearBuilt}</p>
                    <p className="text-xs text-gray-500">Year Built</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Description */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </Card>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a: string) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                      {a}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact card */}
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Owner</h3>
              {property.owner && typeof property.owner !== 'string' && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
                    {property.owner.firstName?.[0]}{property.owner.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium">{property.owner.firstName} {property.owner.lastName}</p>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button className="w-full" onClick={() => setShowInquiry(true)}>
                  <MessageSquare className="w-4 h-4 mr-2" /> Send Inquiry
                </Button>
                <Button variant="secondary" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" /> Schedule Visit
                </Button>
                <Button variant="secondary" className="w-full">
                  <Phone className="w-4 h-4 mr-2" /> Call Owner
                </Button>
              </div>

              <p className="text-xs text-gray-400 text-center mt-4">
                Listed on {formatDate(property.createdAt)}
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <Modal isOpen={showInquiry} onClose={() => setShowInquiry(false)} title="Send Inquiry">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Send a message to the property owner about <strong>{property.title}</strong>.
          </p>
          <Textarea
            label="Your Message"
            rows={4}
            placeholder="I'm interested in this property..."
            required
            value={inquiryMsg}
            onChange={(e) => setInquiryMsg(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowInquiry(false)}>Cancel</Button>
            <Button onClick={handleInquiry} loading={createInquiry.isPending} disabled={!inquiryMsg.trim()}>
              Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PropertyDetailPage;
