import React from 'react';
import { ArrowUpRight, GraduationCap } from 'lucide-react';

interface TeamSectionProps {
  onGoToUpload: () => void;
}

export function TeamSection({ onGoToUpload }: TeamSectionProps) {
  return (
    <>
      <section
        id="tim"
        className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-22"
      >
        <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-3 sm:gap-4 lg:col-span-5">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#2438C9] uppercase">
              — TIM PENGAMPU
            </span>
            <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-[#14181F] sm:text-4xl">
              Orang di balik ruang ini.
            </h2>
            <p className="text-base leading-relaxed text-[#4A5160]">
              Mata Kuliah Bahan Pembelajaran — Program Studi S1 Teknologi
              Pendidikan, Fakultas Ilmu Pendidikan, Universitas Negeri Malang.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-7">
            <div className="rounded-2xl bg-[#14181F] p-5 text-white sm:p-7">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold tracking-[0.18em] text-[#F2A93B] uppercase">
                  DOSEN PENGAMPU
                </span>
                <GraduationCap className="h-5 w-5 text-[#F2A93B]" />
              </div>
              <ul className="mt-3 flex flex-col gap-2 font-display text-lg font-bold sm:text-2xl">
                <li>Dr. Deka Dyah Utami, S.Pd., M.Pd.</li>
                <li>Dany Wijaya Kesuma, S.Pd., M.Pd.</li>
              </ul>
            </div>

            <div className="flex flex-col gap-1 rounded-2xl border border-[#E3E6F0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-[#14181F]">
                  Tim Asisten Laboratorium Teknologi Pendidikan
                </h3>
                <p className="text-sm text-[#4A5160]">
                  Pendampingan teknis penataan multimedia, flipbook, dan aksesibilitas e-modul
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#2438C9] uppercase">
                FIP UM
              </span>
            </div>

            <div className="flex flex-col gap-1 rounded-2xl border border-[#E3E6F0] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-display text-base font-bold text-[#14181F]">
                  Koordinator Offering A2A – A2E Angkatan 2024
                </h3>
                <p className="text-sm text-[#4A5160]">
                  Kurasi publikasi karya dan verifikasi tautan katalog Bahan Pembelajaran
                </p>
              </div>
              <span className="font-mono text-xs font-semibold text-[#0F7B6C] uppercase">
                TEP 2026
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="unggah" className="mx-auto max-w-7xl px-4 pb-12 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#2438C9] p-6 text-white sm:gap-8 sm:rounded-3xl sm:p-12 lg:flex-row lg:items-center">
          <div className="flex max-w-2xl flex-col gap-2.5 sm:gap-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-[#F2D9A6] uppercase">
              — BERSAMA UNTUK BELAJAR
            </span>
            <h2 className="font-display text-2xl leading-tight font-bold sm:text-4xl">
              Mari Berkarya dan Membagikan Bahan Ajar yang Menginspirasi!
            </h2>
          </div>

          <button
            type="button"
            onClick={onGoToUpload}
            className="inline-flex min-h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F2A93B] px-6 text-sm font-bold tracking-wider text-[#14181F] uppercase transition-transform hover:-translate-y-0.5 hover:bg-[#f5b95b] cursor-pointer sm:min-h-[54px] sm:w-auto sm:px-7"
          >
            UNGGAH E-MODUL SEKARANG
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  );
}
