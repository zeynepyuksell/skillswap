import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import { AuthSplitLayout } from '../layouts/AuthSplitLayout';
import { ArrowRight, Loader2 } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, 'İsim en az 2 karakter olmalıdır'),
  email: z.string().email('Lütfen geçerli bir e-posta adresi giriniz'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <AuthSplitLayout>
      {/* Başlık Alanı */}
      <div className="mb-7">
        <h1 className="font-serif text-[44px] sm:text-[50px] font-semibold text-[#2B2622] leading-[1.08] tracking-tight">
          Aramıza <br />
          <em className="italic font-medium text-[#A34A26]">katıl</em>
        </h1>
        <p className="text-sm font-normal text-[#5E564D] mt-3">
          Yeteneklerini paylaş, yeni beceriler edin ve birlikte büyü.
        </p>
      </div>

      {/* Kayıt Formu */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Ad Soyad */}
        <div>
          <label className="block text-[12px] uppercase tracking-[0.09em] font-semibold text-[#5E564D] mb-2">
            Ad Soyad
          </label>
          <input
            type="text"
            placeholder="Ahmet Yılmaz"
            className={`w-full h-[54px] rounded-lg bg-[#FBF7F0] border ${
              errors.fullName ? 'border-rose-400' : 'border-[#D4C8B2]'
            } px-4 text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:ring-1 focus:ring-[#A34A26] focus:border-[#A34A26] transition-colors`}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-xs font-medium text-rose-600 mt-1.5">{errors.fullName.message}</p>
          )}
        </div>

        {/* E-Posta */}
        <div>
          <label className="block text-[12px] uppercase tracking-[0.09em] font-semibold text-[#5E564D] mb-2">
            E-posta
          </label>
          <input
            type="email"
            placeholder="ornek@mail.com"
            className={`w-full h-[54px] rounded-lg bg-[#FBF7F0] border ${
              errors.email ? 'border-rose-400' : 'border-[#D4C8B2]'
            } px-4 text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:ring-1 focus:ring-[#A34A26] focus:border-[#A34A26] transition-colors`}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs font-medium text-rose-600 mt-1.5">{errors.email.message}</p>
          )}
        </div>

        {/* Şifre */}
        <div>
          <label className="block text-[12px] uppercase tracking-[0.09em] font-semibold text-[#5E564D] mb-2">
            Şifre
          </label>
          <input
            type="password"
            placeholder="En az 6 karakter"
            className={`w-full h-[54px] rounded-lg bg-[#FBF7F0] border ${
              errors.password ? 'border-rose-400' : 'border-[#D4C8B2]'
            } px-4 text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:ring-1 focus:ring-[#A34A26] focus:border-[#A34A26] transition-colors`}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs font-medium text-rose-600 mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {/* Kayıt Ol Butonu */}
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full h-[56px] rounded-lg bg-[#2E4A3B] hover:bg-[#1F3A2D] text-[#F5EFE4] font-medium text-base flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {registerMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Kayıt ol</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      {/* Giriş Yap Linki */}
      <div className="border-t border-[#E2D6C1] mt-7 pt-6 text-sm text-[#2B2622]">
        Zaten hesabın var mı?{' '}
        <Link
          to="/login"
          className="text-[#A34A26] underline font-semibold hover:text-[#8E3F20] transition-colors"
        >
          Giriş yap
        </Link>
      </div>
    </AuthSplitLayout>
  );
};
