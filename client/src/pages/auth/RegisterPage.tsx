import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Home, Eye, EyeOff } from 'lucide-react';
import { Input, Button, Select } from '@/components/ui';
import { useRegister } from '@/hooks';

const roles = [
  { value: 'buyer', label: 'Buyer / Searcher' },
  { value: 'seller', label: 'Property Seller' },
  { value: 'owner', label: 'Property Owner' },
  { value: 'tenant', label: 'Tenant' },
  { value: 'agent', label: 'Real Estate Agent' },
  { value: 'builder', label: 'Builder / Developer' },
  { value: 'legal_advisor', label: 'Legal Advisor' },
  { value: 'service_provider', label: 'Service Provider' },
];

const RegisterPage: React.FC = () => {
  const register = useRegister();
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const { confirmPassword, ...data } = form;
    register.mutate(data);
  };

  const update = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg"
    >
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Ghar <span className="text-primary-600">Setu</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-500 mt-1">Join the Ghar Setu ecosystem</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              icon={<User size={18} />}
              required
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              error={errors.firstName}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              icon={<User size={18} />}
              required
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              error={errors.lastName}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="+91 98765 43210"
            icon={<Phone size={18} />}
            required
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            error={errors.phone}
          />

          <Select
            label="I am a"
            required
            value={form.role}
            onChange={(e) => update('role', e.target.value)}
            options={[
              { value: 'property_owner', label: 'Property Owner' },
              { value: 'buyer', label: 'Buyer' },
              { value: 'tenant', label: 'Tenant' },
              { value: 'legal_advisor', label: 'Legal Advisor' },
              { value: 'builder', label: 'Builder' },
              { value: 'packers_movers', label: 'Packers & Movers' },
              { value: 'property_manager', label: 'Property Manager' },
              { value: 'marketing_partner', label: 'Marketing Partner' },
            ]}
            placeholder="Choose your role"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPwd ? 'text' : 'password'}
              placeholder="Min 8 characters"
              icon={<Lock size={18} />}
              required
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            icon={<Lock size={18} />}
            required
            value={form.confirmPassword}
            onChange={(e) => update('confirmPassword', e.target.value)}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            className="w-full"
            loading={register.isPending}
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterPage;
