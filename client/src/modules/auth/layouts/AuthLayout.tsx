import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const skillPairs = [
    { from: 'Python', to: 'Gitar' },
    { from: 'UI Tasarım', to: 'İngilizce' },
    { from: 'Fotoğrafçılık', to: 'Excel' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc]">
      {/* Sol Bölme: Renkli Görsel, Slogan ve Yetenek Kartları */}
      <div className="relative w-full lg:w-[48%] bg-gradient-to-br from-[#483fe6] via-[#5247ed] to-[#6055f7] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden text-white min-h-[460px] lg:min-h-screen">
        {/* Dekoratif Organik Duolingo Stili Arka Plan Daireleri */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-80px] w-[450px] h-[450px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Üst: Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-white text-[#5247ed] flex items-center justify-center shadow-lg shadow-indigo-950/20 group-hover:scale-105 transition-transform">
              <ArrowLeftRight className="w-6 h-6 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white drop-shadow-sm">
              SkillSwap
            </span>
          </Link>
        </div>

        {/* Orta: Ana Slogan ve Yetenek Takas Rozetleri */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.18] tracking-tight text-white mb-4">
            Bildiğini öğret, <br />
            öğrenmek istediğini öğren.
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base font-normal max-w-md leading-relaxed mb-8 opacity-90">
            Yeteneklerini takas et, mentorlarla tanış, birlikte büyü.
          </p>

          {/* Görseldeki Takas Rozetleri */}
          <div className="space-y-3 max-w-sm">
            {skillPairs.map((pair, index) => (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-sm text-slate-800 rounded-2xl px-5 py-3.5 flex items-center justify-between shadow-lg shadow-indigo-950/15 border border-white/60 hover:translate-x-1 transition-all duration-200"
              >
                <span className="font-bold text-sm text-slate-800 tracking-tight">{pair.from}</span>
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-[#5247ed] flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span className="font-bold text-sm text-slate-800 tracking-tight">{pair.to}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alt Telif */}
        <div className="relative z-10 pt-4 text-xs font-medium text-indigo-200/80">
          © SkillSwap
        </div>
      </div>

      {/* Sağ Bölme: Form Alanı */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-[440px]">
          {/* Giriş yap / Kayıt ol Segmented Control */}
          <div className="bg-slate-100/90 p-1.5 rounded-2xl flex items-center mb-8 border border-slate-200/60 shadow-inner">
            <Link
              to="/login"
              className={`flex-1 text-center py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                isLogin
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Giriş yap
            </Link>
            <Link
              to="/register"
              className={`flex-1 text-center py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                !isLogin
                  ? 'bg-white text-slate-900 shadow-sm shadow-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kayıt ol
            </Link>
          </div>

          {/* Form Kartı */}
          <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.07)] border border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
