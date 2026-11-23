import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Heart, Search, SlidersHorizontal } from 'lucide-react';
import { MEDIA_FORMATS, OFFERINGS } from '../data/seedModules';
import type { EModuleItem } from '../types/module';

interface CatalogSectionProps {
  modules: EModuleItem[];
  onSelectModule: (module: EModuleItem) => void;
  onEndorseModule: (id: string) => void;
}

const COVER_BG_MAP: Record<string, string> = {
  '#2438C9': 'bg-[#2438C9]',
  '#E08A00': 'bg-[#E08A00]',
  '#0F7B6C': 'bg-[#0F7B6C]',
  '#7A3FC9': 'bg-[#7A3FC9]',
  '#C93B5A': 'bg-[#C93B5A]',
};

export function CatalogSection({
  modules,
  onSelectModule,
  onEndorseModule,
}: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffering, setSelectedOffering] = useState<string>('Semua');
  const [selectedFormat, setSelectedFormat] = useState<string>('Semua Format');

  const filteredModules = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return modules.filter((item) => {
      const matchesOffering =
        selectedOffering === 'Semua' || item.offering === selectedOffering;
      const matchesFormat =
        selectedFormat === 'Semua Format' || item.format === selectedFormat;
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q) ||
        item.topic.toLowerCase().includes(q) ||
        item.nim.includes(q);
      return matchesOffering && matchesFormat && matchesQuery;
    });
  }, [modules, searchQuery, selectedOffering, selectedFormat]);

  const totalCountLabel = String(modules.length).padStart(2, '0');

  return (
    <section
      id="katalog"
      className="border-y border-[#E3E6F0] bg-white py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:gap-7 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#2438C9] uppercase">
            — KATALOG
          </span>
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#14181F] sm:text-4xl">
            Katalog E-Modul
          </h2>
          <p className="max-w-2xl text-base text-[#4A5160]">
            Cari berdasarkan judul, nama mahasiswa, atau pilih offering. Klik{' '}
            <strong className="font-semibold text-[#14181F]">BUKA E-MODUL ↗</strong>{' '}
            untuk langsung pindah ke halaman tautan e-modul atau membuka halaman
            detail karya.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-md">
              <label htmlFor="cari-emodul" className="sr-only">
                Cari e-modul
              </label>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#6A7184]" />
              <input
                id="cari-emodul"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul e-modul, topik, atau nama mahasiswa…"
                className="min-h-[48px] w-full rounded-xl border border-[#B8BED0] bg-white pr-4 pl-11 text-[15px] text-[#14181F] placeholder:text-[#6A7184] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
              />
            </div>

            <div className="relative sm:w-56">
              <label htmlFor="filter-format" className="sr-only">
                Filter format media
              </label>
              <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6A7184]" />
              <select
                id="filter-format"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="min-h-[48px] w-full appearance-none rounded-xl border border-[#B8BED0] bg-white pr-8 pl-10 text-sm font-medium text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none cursor-pointer"
              >
                <option value="Semua Format">Semua Format</option>
                {MEDIA_FORMATS.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Filter Offering Mahasiswa"
            className="flex flex-wrap items-center gap-2 sm:gap-2.5"
          >
            {['Semua', ...OFFERINGS].map((offering) => {
              const isActive = selectedOffering === offering;
              return (
                <button
                  key={offering}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedOffering(offering)}
                  className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition-colors cursor-pointer sm:min-h-[42px] sm:px-4 sm:text-sm ${
                    isActive
                      ? 'bg-[#14181F] text-white'
                      : 'border border-[#D4D8E6] bg-white text-[#14181F] hover:border-[#14181F]'
                  }`}
                >
                  {offering}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-[#E3E6F0] pb-3 text-sm text-[#6A7184]">
          <span>
            Menampilkan <strong className="text-[#14181F]">{filteredModules.length}</strong>{' '}
            dari {modules.length} materi tersedia
          </span>
          {(searchQuery || selectedOffering !== 'Semua' || selectedFormat !== 'Semua Format') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedOffering('Semua');
                setSelectedFormat('Semua Format');
              }}
              className="font-semibold text-[#2438C9] hover:underline cursor-pointer"
            >
              Atur ulang filter
            </button>
          )}
        </div>

        {filteredModules.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#B8BED0] bg-[#F7F8FC] px-6 py-14 text-center">
            <p className="font-display text-lg font-bold text-[#14181F]">
              Belum ada e-modul yang cocok dengan pencarianmu.
            </p>
            <p className="mt-1 text-sm text-[#4A5160]">
              Coba ubah kata kunci pencarian atau pilih offering lain.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((item, idx) => {
              const coverClass = COVER_BG_MAP[item.coverColor] ?? 'bg-[#2438C9]';
              const itemIndexLabel = String(idx + 1).padStart(2, '0');

              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E3E6F0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-[#B8BED0] hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => onSelectModule(item)}
                    className={`${coverClass} flex h-34 w-full flex-col justify-between p-4 text-left transition-opacity group-hover:opacity-95 cursor-pointer sm:h-36`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="max-w-[55%] truncate rounded-md bg-white px-2.5 py-1 text-xs font-bold text-[#14181F]">
                        {item.topic}
                      </span>
                      <span className="truncate text-[11px] font-semibold tracking-wider text-white/90 uppercase">
                        {item.format}
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div className="flex shrink-0 gap-1.5">
                        <span className="h-2 w-10 rounded bg-white/85 sm:w-11" />
                        <span className="h-2 w-5 rounded bg-white/55 sm:w-6" />
                      </div>
                      <span className="truncate font-mono text-[11px] font-semibold text-white/85">
                        {item.targetAudience}
                      </span>
                    </div>
                  </button>

                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center justify-between gap-2 font-mono text-xs font-semibold text-[#6A7184]">
                        <span>
                          {itemIndexLabel} / {totalCountLabel} · {item.offering}
                        </span>
                        <span
                          className={
                            item.status === 'Layak Publikasi'
                              ? 'text-[#0F7B6C]'
                              : 'text-[#B45309]'
                          }
                        >
                          {item.status}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onSelectModule(item)}
                        className="mt-2.5 text-left cursor-pointer"
                      >
                        <h3 className="font-display text-lg leading-snug font-bold text-[#14181F] transition-colors group-hover:text-[#2438C9]">
                          {item.title}
                        </h3>
                      </button>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#4A5160]">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 border-t border-[#E3E6F0] pt-4">
                      <div className="text-xs text-[#4A5160]">
                        <span className="font-semibold text-[#14181F]">
                          {item.authorName}
                        </span>{' '}
                        · NIM {item.nim}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {item.externalUrl || item.fileUrl ? (
                            <a
                              href={item.externalUrl ?? item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm font-bold text-[#2438C9] hover:underline"
                            >
                              BUKA E-MODUL
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onSelectModule(item)}
                              className="inline-flex items-center gap-1 text-sm font-bold text-[#2438C9] hover:underline cursor-pointer"
                            >
                              BUKA E-MODUL
                              <ArrowUpRight className="h-4 w-4" />
                            </button>
                          )}

                          {(item.externalUrl || item.fileUrl) && (
                            <button
                              type="button"
                              onClick={() => onSelectModule(item)}
                              className="text-xs font-semibold text-[#6A7184] hover:text-[#14181F] hover:underline cursor-pointer"
                            >
                              Detail
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onEndorseModule(item.id)}
                          aria-label={`Beri apresiasi untuk ${item.title}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-[#E3E6F0] px-2.5 py-1 text-xs font-semibold text-[#4A5160] transition-colors hover:border-[#C93B5A] hover:text-[#C93B5A] cursor-pointer"
                        >
                          <Heart className="h-3.5 w-3.5" />
                          <span>{item.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
