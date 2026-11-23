import React from 'react';
import { Award, CheckSquare, LayoutGrid, Sparkles } from 'lucide-react';

const RUBRIC_CRITERIA = [
  {
    code: '01',
    weight: '30%',
    title: 'Desain Instruksional',
    detail: 'Kejelasan capaian pembelajaran, alur penyajian materi, dan latihan mandiri.',
    icon: LayoutGrid,
  },
  {
    code: '02',
    weight: '25%',
    title: 'Visual & Tipografi',
    detail: 'Keterbacaan teks, keseimbangan ruang putih, dan konsistensi elemen grafis.',
    icon: Sparkles,
  },
  {
    code: '03',
    weight: '25%',
    title: 'Interaktivitas Media',
    detail: 'Navigasi flipbook, tautan aktif, evaluasi formatif, atau integrasi multimedia.',
    icon: CheckSquare,
  },
  {
    code: '04',
    weight: '20%',
    title: 'Orisinalitas & Referensi',
    detail: 'Keaslian penyusunan naskah serta atribusi sumber belajar terbuka yang sah.',
    icon: Award,
  },
];

export function AboutProgramSection() {
  return (
    <section id="tentang" className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-22">
      <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="flex flex-col gap-3.5 lg:col-span-5">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#2438C9] uppercase">
            — TENTANG PROGRAM
          </span>
          <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-[#14181F] sm:text-4xl">
            Project e-modul tumbuh dari draf menjadi karya.
          </h2>
        </div>

        <div className="flex flex-col gap-5 text-base leading-relaxed text-[#4A5160] sm:text-[17px] lg:col-span-7">
          <p>
            Project E-Modul adalah luaran utama mata kuliah{' '}
            <strong className="font-semibold text-[#14181F]">
              Bahan Pembelajaran
            </strong>{' '}
            di Program Studi S1 Teknologi Pendidikan Universitas Negeri Malang
            yang membantu mahasiswa merancang, mengumpulkan, dan memamerkan
            karya bahan ajar digital secara rapi dan terpantau.
          </p>
          <p>
            Mahasiswa mengunggah berkas atau tautan e-modul, menerima umpan balik
            dosen berdasarkan rubrik terbuka sejak awal perkuliahan, lalu
            merevisi karya sampai layak tampil di katalog portofolio bersama.
          </p>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RUBRIC_CRITERIA.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.code}
              className="flex flex-col justify-between rounded-2xl border border-[#E3E6F0] bg-white p-6 transition-colors hover:border-[#2438C9]/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-[#6A7184]">
                    {item.code} · BOBOT {item.weight}
                  </span>
                  <Icon className="h-4 w-4 text-[#2438C9]" />
                </div>
                <h3 className="mt-3 font-display text-lg font-bold text-[#14181F]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4A5160]">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
