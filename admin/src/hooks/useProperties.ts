import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import type { Property, PaginatedData, ApiResponse } from '@/types';

interface PropertyFilters {
  page?: number;
  limit?: number;
  type?: string;
  purpose?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
  sort?: string;
}

export function useProperties(filters: PropertyFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== '') params.append(key, String(val));
  });

  return useQuery<ApiResponse<PaginatedData<Property>>>({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const res = await api.get(`/properties?${params.toString()}`);
      return res.data;
    },
  });
}

export function useProperty(id: string) {
  return useQuery<ApiResponse<Property>>({
    queryKey: ['property', id],
    queryFn: async () => {
      const res = await api.get(`/properties/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const res = await api.post('/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property listed successfully!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create property');
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      const res = await api.put(`/properties/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      toast.success('Property updated!');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update property');
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to delete property');
    },
  });
}
