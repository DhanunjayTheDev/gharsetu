import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Lock } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { getRoleName } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, setAuth, accessToken, refreshToken } = useAuthStore();

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', profileForm);
      if (accessToken && refreshToken) setAuth(res.data.data, accessToken, refreshToken);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePwd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setChangingPwd(true);
    try {
      await api.post('/auth/change-password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password changed!');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPwd(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings</p>
      </motion.div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-primary-600 mt-0.5">{getRoleName(user?.role || '')}</p>
          </div>
        </div>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><User className="w-4 h-4" /> Profile Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={profileForm.firstName} onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} required />
            <Input label="Last Name" value={profileForm.lastName} onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} required />
          </div>
          <Input label="Phone" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} icon={<Phone size={18} />} />
          <div className="flex justify-end">
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleChangePwd} className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Lock className="w-4 h-4" /> Change Password</h3>
          <Input label="Current Password" type="password" required value={pwdForm.currentPassword} onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="New Password" type="password" required value={pwdForm.newPassword} onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
            <Input label="Confirm Password" type="password" required value={pwdForm.confirmPassword} onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })} />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={changingPwd}>Change Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;
