import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Home, Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { useLogin } from '@/hooks';

const LoginPage: React.FC = () => {
  const login = useLogin();
  const [showPwd, setShowPwd] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-gray-900">
            Ghar <span className="text-primary-600">Setu</span>
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
        <p className="text-gray-500 mt-1">Sign in to manage your dashboard</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail size={18} />}
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              icon={<Lock size={18} />}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={login.isPending}
          >
            Sign In
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default LoginPage;
