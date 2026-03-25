import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, Gavel, Truck, Megaphone, Search, Shield, Users,
  ArrowRight, Star, MapPin, ChevronRight, ClipboardList, Home, Handshake,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const services = [
  { icon: Building2, title: 'Buy & Sell', desc: 'Find your dream property or list yours for sale with verified buyers.', link: '/properties?purpose=sale', color: 'bg-blue-50 text-blue-600' },
  { icon: Home, title: 'Rent', desc: 'Browse rental listings or find reliable tenants for your property.', link: '/properties?purpose=rent', color: 'bg-green-50 text-green-600' },
  { icon: Gavel, title: 'Legal Services', desc: 'Property documentation, title verification, and legal advisory.', link: '/services/legal', color: 'bg-purple-50 text-purple-600' },
  { icon: Handshake, title: 'Joint Ventures', desc: 'Partner with builders and investors for property development.', link: '/services/joint-ventures', color: 'bg-amber-50 text-amber-600' },
  { icon: Truck, title: 'Packers & Movers', desc: 'Seamless relocation with verified service providers.', link: '/services/packers', color: 'bg-red-50 text-red-600' },
  { icon: ClipboardList, title: 'Property Management', desc: 'Remote property management, rent collection, and maintenance.', link: '/services/management', color: 'bg-teal-50 text-teal-600' },
  { icon: Megaphone, title: 'Marketing', desc: 'Promote your real estate projects to targeted audiences.', link: '/services/marketing', color: 'bg-pink-50 text-pink-600' },
  { icon: Shield, title: 'Verification', desc: 'Property and document verification by certified professionals.', link: '/services/verification', color: 'bg-indigo-50 text-indigo-600' },
];

const stats = [
  { value: '10,000+', label: 'Properties Listed' },
  { value: '5,000+', label: 'Happy Customers' },
  { value: '500+', label: 'Verified Agents' },
  { value: '50+', label: 'Cities Covered' },
];

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <motion.div {...fadeUp} className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Your Complete{' '}
              <span className="text-accent-300">Real Estate</span>{' '}
              Ecosystem
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 mt-6 leading-relaxed max-w-2xl">
              Buy, sell, rent, get legal help, manage properties, and access 50+ real estate services — all in one platform.
            </p>

            {/* Search bar */}
            <div className="mt-10 bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-2xl max-w-2xl">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties by location, type..."
                  className="w-full py-3 text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 px-4 border-t sm:border-t-0 sm:border-l border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="City"
                  className="w-full sm:w-32 py-3 text-gray-800 placeholder-gray-400 focus:outline-none"
                />
              </div>
              <Link to="/properties" className="btn-primary py-3 px-8 rounded-xl text-center whitespace-nowrap">
                Search
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600">{s.value}</div>
                <div className="text-gray-500 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Everything You Need, <span className="text-primary-600">One Platform</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
              From property search to legal documentation, we've got every aspect of real estate covered.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, i) => (
              <motion.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={svc.link}
                  className="card p-6 hover:shadow-lg transition-shadow group block h-full"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${svc.color} mb-4`}>
                    <svc.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{svc.title}</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">{svc.desc}</p>
                  <span className="flex items-center gap-1 text-primary-600 text-sm font-medium mt-4 group-hover:gap-2 transition-all">
                    Explore <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Start Your Real Estate Journey?
            </h2>
            <p className="text-primary-100 mt-4 text-lg max-w-xl mx-auto">
              Join thousands of property owners, buyers, and investors on India's most comprehensive real estate platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link to="/register" className="bg-white text-primary-600 font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/properties" className="border-2 border-white text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-center">
                Browse Properties
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Ghar Setu</span>
              </div>
              <p className="text-sm leading-relaxed">
                India's complete real estate ecosystem connecting buyers, sellers, renters, and service providers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/properties" className="hover:text-white transition-colors">Buy/Sell Properties</Link></li>
                <li><Link to="/properties?purpose=rent" className="hover:text-white transition-colors">Rent Properties</Link></li>
                <li><Link to="/services/legal" className="hover:text-white transition-colors">Legal Services</Link></li>
                <li><Link to="/services/packers" className="hover:text-white transition-colors">Packers & Movers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} Ghar Setu. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
