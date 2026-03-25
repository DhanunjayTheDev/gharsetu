import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Gavel, Truck, Megaphone, ClipboardList,
  Home, Handshake, Shield, ChevronRight,
} from 'lucide-react';

const services = [
  {
    icon: Building2,
    title: 'Buy & Sell Properties',
    desc: 'List your property for sale or find properties to buy. Get offers, negotiate deals, and complete transactions seamlessly.',
    link: '/properties?purpose=sale',
    features: ['Property Listings', 'Offer Management', 'Price Negotiation', 'Transaction Tracking'],
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Home,
    title: 'Rental Services',
    desc: 'Find rental properties or list yours. Manage agreements, automate rent collection, and handle maintenance requests.',
    link: '/properties?purpose=rent',
    features: ['Rental Listings', 'Agreement Management', 'Rent Collection', 'Renewals'],
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Gavel,
    title: 'Legal Services',
    desc: 'Get help with title search, property registration, dispute resolution, and compliance from certified legal advisors.',
    link: '/services/legal',
    features: ['Title Search', 'Registration', 'Dispute Resolution', 'Doc Verification'],
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Handshake,
    title: 'Joint Ventures',
    desc: 'Connect with builders, investors, and landowners for joint development projects with milestone-based tracking.',
    link: '/services/joint-ventures',
    features: ['Partner Matching', 'Milestone Tracking', 'Revenue Split', 'Progress Reports'],
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Truck,
    title: 'Packers & Movers',
    desc: 'Book verified packing and moving services. Get cost estimates, track shipments, and rate your experience.',
    link: '/services/packers',
    features: ['Cost Estimation', 'Provider Matching', 'Live Tracking', 'Insurance'],
    color: 'from-red-500 to-red-600',
  },
  {
    icon: ClipboardList,
    title: 'Property Management',
    desc: 'For NRI and remote owners — rent collection, maintenance coordination, tenant management, and reporting.',
    link: '/services/management',
    features: ['Rent Management', 'Maintenance', 'Tenant Screening', 'Reports'],
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: Megaphone,
    title: 'Real Estate Marketing',
    desc: 'Promote projects with targeted digital campaigns. Track leads, analytics, and conversion metrics.',
    link: '/services/marketing',
    features: ['Campaign Creation', 'Lead Capture', 'Analytics', 'Multi-Channel'],
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Shield,
    title: 'Verification Services',
    desc: 'Property verification, document authentication, and background checks by certified professionals.',
    link: '/services/verification',
    features: ['Property Verification', 'Doc Authentication', 'Background Check', 'Certification'],
    color: 'from-indigo-500 to-indigo-600',
  },
];

const ServicesPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900">Our Services</h1>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              A complete ecosystem of real estate services — from finding properties to legal aid, relocations, and marketing.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Services grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={svc.link}
                className="card p-6 hover:shadow-lg transition-shadow group flex flex-col h-full"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.color} flex items-center justify-center flex-shrink-0`}>
                    <svc.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-gray-500 mt-2 leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-5">
                  {svc.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-primary-600 font-medium mt-5 group-hover:gap-2 transition-all text-sm">
                  Get Started <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
