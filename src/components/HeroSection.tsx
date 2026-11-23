import React from 'react';
import { ArrowDown, ArrowUpRight, BookOpen, CheckCircle2, Layers } from 'lucide-react';
import type { EModuleItem } from '../types/module';

interface HeroSectionProps {
  totalCollectedCount: number;
  latestModule?: EModuleItem;
  onGoToUpload: () => void;
  onExploreCatalog: () => void;
  onOpenModule: (module: EModuleItem) => void;
}

export function HeroSection({
  totalCollectedCount,
  latestModule,
  onGoToUpload,
  onExploreCatalog,
  onOpenModule,
}: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-heading">
      <div className="bg-[#14181F] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:gap-12 sm:px-8 sm:py-14 lg:grid-cols-12 lg:gap-14 lg:px-12 lg:py-20">
          <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-7">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-[#F2A93B] uppercase sm:text-xs sm:tracking-[0.2em]">
              — PORTAL KARYA E-MODUL MAHASISWA
            </span>

            <h1
              id="hero-heading"
              className="font-display text-[44px] leading-[0.98] font-extrabold tracking-tight text-white sm:text-7xl lg:text-[84px]"
            >
              Project{' '}
              <span className="font-serif font-bold italic text-[#F2A93B]">
                E-MODUL
              </span>
            </h1>

            <p className="text-xs font-semibold tracking-[0.14em] text-[#C9CEDD] uppercase sm:text-base sm:tracking-[0.22em]">
              MATA KULIAH BAHAN PEMBELAJARAN · S1 TEKNOLOGI PENDIDIKAN UM
            </p>

            <p className="font-display text-lg font-bold text-white sm:text-2xl">
              Satu Ruang, Banyak Karya, Menginspirasi Belajar.
            </p>

            <p className="max-w-xl text-sm leading-relaxed text-[#C9CEDD] sm:text-lg">
              Unggah e-modulmu, pantau tinjauannya, dan jelajahi portofolio karya
              mahasiswa Teknologi Pendidikan Universitas Negeri Malang pada mata
              kuliah Bahan Pembelajaran dalam satu akses terintegrasi.
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={onGoToUpload}
                className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#F2A93B] px-6 text-sm font-bold tracking-wider text-[#14181F] uppercase transition-transform hover:-translate-y-0.5 hover:bg-[#f5b95b] cursor-pointer sm:min-h-[52px] sm:w-auto sm:px-7"
              >
                Unggah E-Modul
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onExploreCatalog}
                className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl border-2 border-white/80 bg-transparent px-6 text-sm font-bold tracking-wider text-white uppercase transition-colors hover:border-[#F2A93B] hover:text-[#F2A93B] cursor-pointer sm:min-h-[52px] sm:w-auto sm:px-7"
              >
                Jelajahi Katalog
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative mx-auto h-[300px] w-full max-w-[330px] sm:h-[420px] sm:max-w-[440px] lg:col-span-5">
            <div
              onClick={onExploreCatalog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onExploreCatalog();
              }}
              className="absolute top-8 left-2 flex h-[210px] w-[54%] max-w-[240px] -rotate-5 flex-col justify-between rounded-2xl bg-[#2438C9] p-4 text-white shadow-2xl transition-transform duration-300 hover:-rotate-2 cursor-pointer sm:top-10 sm:left-0 sm:h-[300px] sm:w-[240px] sm:-rotate-6 sm:p-5"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-white/80 uppercase sm:text-xs">
                <span>Offering A2A</span>
                <BookOpen className="h-4 w-4 shrink-0" />
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <p className="font-display text-sm leading-snug font-bold sm:text-lg">
                  Desain Pesan Visual Digital
                </p>
                <div className="h-1.5 w-20 rounded bg-white/90 sm:w-24" />
                <div className="h-1.5 w-12 rounded bg-white/50 sm:w-14" />
              </div>
            </div>

            <div
              onClick={onExploreCatalog}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onExploreCatalog();
              }}
              className="absolute top-0 right-2 flex h-[210px] w-[54%] max-w-[240px] rotate-4 flex-col justify-between rounded-2xl bg-[#F2A93B] p-4 text-[#14181F] shadow-2xl transition-transform duration-300 hover:rotate-2 cursor-pointer sm:right-0 sm:h-[300px] sm:w-[240px] sm:rotate-5 sm:p-5"
            >
              <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-[#14181F]/75 uppercase sm:text-xs">
                <span>Flipbook · Canva</span>
                <Layers className="h-4 w-4 shrink-0" />
              </div>
              <div className="space-y-2 sm:space-y-2.5">
                <p className="font-display text-sm leading-snug font-bold sm:text-lg">
                  Bahan Ajar Interaktif TEP
                </p>
                <div className="h-1.5 w-22 rounded bg-[#14181F] sm:w-28" />
                <div className="h-1.5 w-14 rounded bg-[#14181F]/45 sm:w-16" />
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 z-10 w-[88%] max-w-[270px] -translate-x-1/2 rounded-2xl border border-[#E3E6F0] bg-white p-4 text-[#14181F] shadow-2xl sm:left-16 sm:w-[270px] sm:translate-x-0 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-widest text-[#6A7184] uppercase sm:text-[11px]">
                    Status Pengumpulan
                  </span>
                  <h2 className="mt-1 truncate font-display text-sm font-bold text-[#14181F] sm:text-base">
                    {latestModule ? latestModule.title : 'E-Modul Proyek Akhir'}
                  </h2>
                </div>
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0F7B6C]" />
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#E3E6F0] pt-2.5 text-xs">
                <span className="truncate font-medium text-[#4A5160]">
                  {latestModule ? latestModule.offering : 'Bahan Pembelajaran'}
                </span>
                <span className="shrink-0 rounded bg-[#E6F4EC] px-2 py-0.5 font-semibold text-[#14532D]">
                  {latestModule ? latestModule.status : 'Dalam tinjauan'}
                </span>
              </div>

              {latestModule && (
                <button
                  type="button"
                  onClick={() => onOpenModule(latestModule)}
                  className="mt-2.5 text-xs font-bold text-[#2438C9] hover:underline cursor-pointer"
                >
                  Lihat karya terbaru →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-[#E3E6F0] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[#E3E6F0] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-4 py-6 sm:px-8 sm:py-7 lg:px-12">
            <div className="font-display text-3xl font-extrabold text-[#2438C9] tabular-nums sm:text-4xl">
              +{totalCollectedCount}
            </div>
            <p className="mt-1 text-sm font-medium text-[#4A5160]">
              E-Modul Terkumpul lintas offering TEP UM
            </p>
          </div>

          <div className="px-4 py-6 sm:px-8 sm:py-7 lg:px-12">
            <div className="font-display text-3xl font-extrabold text-[#2438C9] sm:text-4xl">
              Bahan Ajar
            </div>
            <p className="mt-1 text-sm font-medium text-[#4A5160]">
              Digital, Kontekstual, dan Interaktif
            </p>
          </div>

          <div className="px-4 py-6 sm:px-8 sm:py-7 lg:px-12">
            <div className="font-display text-3xl font-extrabold text-[#2438C9] sm:text-4xl">
              1 Akses
            </div>
            <p className="mt-1 text-sm font-medium text-[#4A5160]">
              Unggah, Nilai Rubrik, dan Katalog Terintegrasi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
