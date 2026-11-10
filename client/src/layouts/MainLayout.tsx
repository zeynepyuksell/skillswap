import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5EFE4] text-[#2B2622]">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-[#E2D6C1] bg-[#F5EFE4] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-[#5E564D]">
          <p>© 2026 SkillSwap — Bildiğini paylaş, merak ettiğini öğren.</p>
        </div>
      </footer>
    </div>
  );
};
