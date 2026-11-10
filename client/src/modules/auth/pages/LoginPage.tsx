import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { AuthSplitLayout } from '../layouts/AuthSplitLayout';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Lütfen geçerli bir e-posta adresi giriniz'),
  password: z.string().min(1, 'Şifre alanı zorunludur'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleQuickFill = (email: string) => {
    setValue('email', email, { shouldValidate: true, shouldDirty: true });
    setValue('password', 'password123', { shouldValidate: true, shouldDirty: true });
    loginMutation.mutate({ email, password: 'password123' });
  };

  return (
    <AuthSplitLayout>
      {/* Başlık Alanı */}
      <div className="mb-7">
        <h1 className="font-serif text-[44px] sm:text-[50px] font-semibold text-[#2B2622] leading-[1.08] tracking-tight">
          Tekrar <br />
          <em className="italic font-medium text-[#A34A26]">hoş geldin</em>
        </h1>
        <p className="text-sm font-normal text-[#5E564D] mt-3">
          Takaslarına ve mentorlarına kaldığın yerden devam et.
        </p>
      </div>

      {/* Giriş Formu */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            placeholder="Şifren"
            className={`w-full h-[54px] rounded-lg bg-[#FBF7F0] border ${
              errors.password ? 'border-rose-400' : 'border-[#D4C8B2]'
            } px-4 text-sm text-[#2B2622] placeholder:text-[#5E564D]/50 focus:outline-none focus:ring-1 focus:ring-[#A34A26] focus:border-[#A34A26] transition-colors`}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs font-medium text-rose-600 mt-1.5">{errors.password.message}</p>
          )}
        </div>

        {/* Giriş Yap Butonu */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full h-[56px] rounded-lg bg-[#2E4A3B] hover:bg-[#1F3A2D] text-[#F5EFE4] font-medium text-base flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loginMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Giriş yap</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      {/* Kayıt Ol Linki */}
      <div className="border-t border-[#E2D6C1] mt-7 pt-6 text-sm text-[#2B2622]">
        Henüz hesabın yok mu?{' '}
        <Link
          to="/register"
          className="text-[#A34A26] underline font-semibold hover:text-[#8E3F20] transition-colors"
        >
          Kayıt ol
        </Link>
      </div>

      {/* Test Kullanıcıları Hızlı Seçim */}
      <div className="mt-6 pt-4 border-t border-[#E2D6C1]/60">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5E564D] mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#A34A26]" />
          <span>Hızlı Test Hesabı (Şifre: password123):</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('zeynep@example.com')}
            className="flex-1 text-left px-3 py-2 rounded-lg bg-[#FBF7F0] border border-[#D4C8B2] text-xs hover:border-[#A34A26] transition-colors cursor-pointer"
          >
            <div className="font-semibold text-[#2B2622]">Zeynep Yüksel</div>
            <div className="text-[10px] text-[#5E564D]">TypeScript & React</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('caner@example.com')}
            className="flex-1 text-left px-3 py-2 rounded-lg bg-[#FBF7F0] border border-[#D4C8B2] text-xs hover:border-[#A34A26] transition-colors cursor-pointer"
          >
            <div className="font-semibold text-[#2B2622]">Caner Kaya</div>
            <div className="text-[10px] text-[#5E564D]">UI/UX & Gitar</div>
          </button>
        </div>
      </div>
    </AuthSplitLayout>
  );
};
