import React from 'react';
import { BrandLogos } from './BrandLogos';

interface FooterProps {
  onScrollTop: () => void;
}

export function Footer({ onScrollTop }: FooterProps) {
  return (
    <footer className="bg-[#14181F] text-[#C9CEDD]">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 px-4 py-7 sm:flex-row sm:items-center sm:gap-6 sm:px-8 sm:py-8 lg:px-12">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <BrandLogos size="sm" tone="dark" />
          <div className="min-w-0 text-xs leading-snug sm:text-sm">
            <p className="font-semibold text-white">
              © 2026 Project E-Modul · Mata Kuliah Bahan Pembelajaran
            </p>
            <p className="mt-0.5 text-[11px] text-[#A9B2C8] sm:text-xs">
              Program Studi S1 Teknologi Pendidikan · Universitas Negeri Malang
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onScrollTop}
          className="text-sm font-semibold text-[#F2A93B] transition-colors hover:text-white cursor-pointer"
        >
          Kembali ke atas ↑
        </button>
      </div>
    </footer>
  );
}
