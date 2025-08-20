import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { User } from '../types';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/admin/users');
      return response.data;
    },
  });
};

export const useBanUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await api.put<User>(`/admin/users/${userId}/ban`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUnbanUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: number) => {
      const response = await api.put<User>(`/admin/users/${userId}/unban`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};