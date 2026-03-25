import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    draft: 'bg-gray-100 text-gray-600',
    sold: 'bg-purple-100 text-purple-800',
    rented: 'bg-indigo-100 text-indigo-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    countered: 'bg-orange-100 text-orange-800',
    verified: 'bg-green-100 text-green-800',
    uploaded: 'bg-blue-100 text-blue-800',
    under_review: 'bg-yellow-100 text-yellow-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getRoleName(role: string): string {
  const names: Record<string, string> = {
    admin: 'Admin',
    property_owner: 'Property Owner',
    buyer: 'Buyer',
    tenant: 'Tenant',
    legal_advisor: 'Legal Advisor',
    builder: 'Builder / Developer',
    packers_movers: 'Packers & Movers',
    property_manager: 'Property Manager',
    marketing_partner: 'Marketing Partner',
  };
  return names[role] || role;
}

export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}
