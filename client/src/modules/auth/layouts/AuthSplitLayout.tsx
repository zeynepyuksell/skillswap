import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

interface AuthSplitLayoutProps {
  children: React.ReactNode;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({ children }) => {
  const swapCards = [
    { from: 'Python', to: 'Akustik gitar' },
    { from: 'UI/UX', to: 'İspanyolca' },
    { from: 'CV koçluğu', to: 'Photoshop' },
  ];

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#F5EFE4]">
      {/* Sol Bölüm (Form Alanı) */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-16 min-h-screen max-w-[560px] w-full mx-auto lg:max-w-none">
        {/* Üst Logo */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-[#2E4A3B] text-[#F5EFE4] flex items-center justify-center transition-transform group-hover:scale-105">
              <ArrowLeftRight className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2E4A3B]">
              SkillSwap
            </span>
          </Link>
        </div>

        {/* Ortadaki Form */}
        <div className="my-auto py-8 w-full max-w-[380px] mx-auto">
          {children}
        </div>

        {/* Alt Slogan */}
        <div className="pt-4 text-xs font-normal text-[#5E564D]">
          Bildiğini paylaş, merak ettiğini öğren.
        </div>
      </div>

      {/* Sağ Bölüm (Koyu Yeşil Arka Plan ve Kemer / Arch Görseli) */}
      {/* 860px altında gizlenir */}
      <div className="hidden lg:flex relative overflow-hidden bg-[#243F31] text-[#F5EFE4] items-center justify-center p-8 xl:p-12">
        {/* Sağ alttaki kiremit renkli daire */}
        <div className="absolute -bottom-12 -right-12 w-[260px] h-[260px] rounded-full bg-[#A34A26] pointer-events-none" />

        {/* Kemer (Arch) Çerçeve */}
        <div className="relative z-10 w-full max-w-[400px] min-h-[620px] rounded-t-[200px] border-[1.5px] border-[#F5EFE4]/40 flex flex-col items-center justify-start text-center pt-20 px-7 pb-10">
          {/* Başlık */}
          <h2 className="font-serif text-[34px] sm:text-[36px] font-semibold leading-[1.2] text-[#F5EFE4] tracking-tight">
            Bir saatini ver,
            <br />
            <em className="italic font-normal text-[#E8B796]">bir saatini al.</em>
          </h2>

          {/* 3 Adet Takas Kartı */}
          <div className="w-full space-y-3.5 mt-10">
            {swapCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#FBF7F0] text-[#2B2622] rounded-xl px-5 py-4 w-full flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#E2D6C1]/60"
              >
                <span className="font-medium text-sm text-[#2B2622]">{card.from}</span>
                <ArrowLeftRight className="w-4 h-4 text-[#A34A26] stroke-[2.2]" />
                <span className="font-medium text-sm text-[#2B2622]">{card.to}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
