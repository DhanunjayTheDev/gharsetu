import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';

// --- Inquiries ---
export function useInquiries(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['inquiries', params],
    queryFn: async () => (await api.get(`/inquiries?${search}`)).data,
  });
}

export function useCreateInquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/inquiries', data)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['inquiries'] }); toast.success('Inquiry sent!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// --- Buy/Sell Offers ---
export function useOffers(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['offers', params],
    queryFn: async () => (await api.get(`/offers?${search}`)).data,
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/offers', data)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['offers'] }); toast.success('Offer submitted!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// --- Rentals ---
export function useRentals(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['rentals', params],
    queryFn: async () => (await api.get(`/rentals?${search}`)).data,
  });
}

export function useCreateRental() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/rentals', data)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['rentals'] }); toast.success('Rental agreement created!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// --- Legal ---
export function useLegalCases(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['legal', params],
    queryFn: async () => (await api.get(`/legal?${search}`)).data,
  });
}

export function useCreateLegalCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/legal', data)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['legal'] }); toast.success('Legal case created!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// --- Joint Ventures ---
export function useJointVentures(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['jv', params],
    queryFn: async () => (await api.get(`/joint-ventures?${search}`)).data,
  });
}

// --- Packers & Movers ---
export function usePackersBookings(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['packers', params],
    queryFn: async () => (await api.get(`/packers?${search}`)).data,
  });
}

export function useCreatePackersBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/packers', data)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['packers'] }); toast.success('Booking created!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// --- Marketing ---
export function useCampaigns(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: async () => (await api.get(`/marketing?${search}`)).data,
  });
}

// --- Scheduling ---
export function useSchedules(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['schedules', params],
    queryFn: async () => (await api.get(`/schedules?${search}`)).data,
  });
}

export function useCreateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/schedules', data)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['schedules'] }); toast.success('Scheduled!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// --- Notifications ---
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications')).data,
    refetchInterval: 30000,
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => (await api.patch(`/notifications/${id}/read`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

// --- Payments ---
export function usePayments(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['payments', params],
    queryFn: async () => (await api.get(`/payments/my?${search}`)).data,
  });
}

// --- Feedback ---
export function useFeedback(entityType: string, entityId: string) {
  return useQuery({
    queryKey: ['feedback', entityType, entityId],
    queryFn: async () => (await api.get(`/feedback/entity/${entityType}/${entityId}`)).data,
    enabled: !!entityType && !!entityId,
  });
}

export function useCreateFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => (await api.post('/feedback', data)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['feedback'] }); toast.success('Feedback submitted!'); },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed'),
  });
}

// --- Admin Dashboard ---
export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard')).data,
  });
}

// --- Property Management ---
export function usePropertyManagement(params: Record<string, any> = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) search.append(k, String(v)); });

  return useQuery({
    queryKey: ['prop-management', params],
    queryFn: async () => (await api.get(`/property-management?${search}`)).data,
  });
}
