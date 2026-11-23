import React, { useState } from 'react';
import { ArrowLeft, Menu, Upload, X } from 'lucide-react';
import { BrandLogos } from './BrandLogos';

interface BrandHeaderProps {
  activeView: 'home' | 'upload' | 'module';
  onNavigate: (view: 'home' | 'upload', sectionId?: string) => void;
}

export function BrandHeader({ activeView, onNavigate }: BrandHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (sectionId?: string) => {
    setMobileOpen(false);
    onNavigate('home', sectionId);
  };

  if (activeView === 'upload' || activeView === 'module') {
    return (
      <header className="sticky top-0 z-40 border-b border-[#E3E6F0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-6 sm:px-8 sm:py-3.5 lg:px-12">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left transition-opacity hover:opacity-90 cursor-pointer sm:gap-3.5"
          >
            <BrandLogos size="md" tone="light" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-display text-sm font-bold tracking-tight text-[#2438C9] sm:text-xl">
                Project E-Modul TEP
              </span>
              <span className="truncate text-[11px] font-medium text-[#4A5160] sm:text-xs">
                Teknologi Pendidikan · UM
              </span>
            </div>
          </button>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {activeView === 'module' && (
              <button
                type="button"
                onClick={() => onNavigate('upload')}
                className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#F2A93B] px-4 py-2 text-sm font-bold text-[#14181F] transition-colors hover:bg-[#f5b95b] cursor-pointer whitespace-nowrap"
              >
                <Upload className="h-4 w-4" />
                Unggah E-Modul
              </button>
            )}
            <button
              type="button"
              onClick={() =>
                onNavigate('home', activeView === 'module' ? 'katalog' : undefined)
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4D8E6] bg-white px-3 py-2 text-xs font-semibold text-[#14181F] transition-colors hover:border-[#2438C9] hover:text-[#2438C9] cursor-pointer whitespace-nowrap sm:gap-2 sm:px-4 sm:text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">
                {activeView === 'module' ? 'Kembali ke Katalog' : 'Kembali ke Portofolio'}
              </span>
              <span className="sm:hidden">Kembali</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#14181F]/95 text-white backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-8 sm:px-8 sm:py-3.5 lg:px-12">
        <button
          type="button"
          onClick={() => handleLinkClick()}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left transition-opacity hover:opacity-90 cursor-pointer sm:flex-initial sm:gap-3.5"
        >
          <BrandLogos size="md" tone="dark" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-display text-sm font-bold tracking-tight text-white sm:text-lg">
              Project E-Modul TEP 2026
            </span>
            <span className="truncate text-[11px] font-medium text-[#A9B2C8] sm:text-xs">
              Teknologi Pendidikan · Universitas Negeri Malang
            </span>
          </div>
        </button>

        <nav
          aria-label="Navigasi utama"
          className="hidden items-center gap-7 lg:flex"
        >
          <button
            type="button"
            onClick={() => handleLinkClick('tentang')}
            className="text-sm font-medium text-[#D6DCEB] transition-colors hover:text-[#F2A93B] cursor-pointer whitespace-nowrap"
          >
            Tentang
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('katalog')}
            className="text-sm font-medium text-[#D6DCEB] transition-colors hover:text-[#F2A93B] cursor-pointer whitespace-nowrap"
          >
            Katalog E-Modul
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('tim')}
            className="text-sm font-medium text-[#D6DCEB] transition-colors hover:text-[#F2A93B] cursor-pointer whitespace-nowrap"
          >
            Tim Pengampu
          </button>
          <button
            type="button"
            onClick={() => handleLinkClick('unggah')}
            className="text-sm font-medium text-[#F2A93B] transition-colors hover:text-white cursor-pointer whitespace-nowrap"
          >
            Ketentuan Unggah
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('upload')}
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#F2A93B] px-4 py-2.5 text-sm font-bold text-[#14181F] transition-colors hover:bg-[#f5b95b] cursor-pointer whitespace-nowrap"
          >
            <Upload className="h-4 w-4" />
            Unggah E-Modul
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#14181F] px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleLinkClick('tentang')}
              className="py-2 text-left text-sm font-medium text-[#D6DCEB] hover:text-[#F2A93B] cursor-pointer"
            >
              Tentang Program
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('katalog')}
              className="py-2 text-left text-sm font-medium text-[#D6DCEB] hover:text-[#F2A93B] cursor-pointer"
            >
              Katalog E-Modul
            </button>
            <button
              type="button"
              onClick={() => handleLinkClick('tim')}
              className="py-2 text-left text-sm font-medium text-[#D6DCEB] hover:text-[#F2A93B] cursor-pointer"
            >
              Tim Pengampu
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onNavigate('upload');
              }}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#F2A93B] px-4 py-3 text-sm font-bold text-[#14181F] cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              Unggah E-Modul
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
