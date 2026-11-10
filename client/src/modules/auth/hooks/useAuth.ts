import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import { useAuthStore } from '../services/authStore';
import type { LoginCredentials, RegisterCredentials } from '../types';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Önceki kullanıcının bellekteki tüm sorgularını temizle
      queryClient.clear();
      setAuth(data.user, data.token);
      toast.success(`Giriş başarılı! Hoş geldin, ${data.user.fullName}`);
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.';
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: (data) => {
      queryClient.clear();
      setAuth(data.user, data.token);
      toast.success('Hesabınız başarıyla oluşturuldu!');
      navigate('/dashboard');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Kayıt işlemi başarısız oldu.';
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    // Çıkış yapıldığında oturum verilerini ve cache'i sıfırla
    queryClient.clear();
    logout();
    toast.info('Oturum kapatıldı');
    navigate('/login');
  };
};
