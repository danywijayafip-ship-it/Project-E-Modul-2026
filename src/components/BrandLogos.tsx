import React from 'react';

interface BrandLogosProps {
  size?: 'sm' | 'md';
  tone?: 'dark' | 'light';
}

export const UM_LOGO_SRC = '/assets/aistudio/LOGO_LINGKARAN_UM_199a9b5b.png';
export const TEP_LOGO_SRC = '/assets/aistudio/images__5__4b934a2f.jpeg';

export function BrandLogos({ size = 'md', tone = 'dark' }: BrandLogosProps) {
  const umFrameSize = size === 'sm' ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-9 w-9 sm:h-11 sm:w-11';
  const tepFrameSize =
    size === 'sm' ? 'h-8 w-[46px] sm:h-9 sm:w-[52px]' : 'h-9 w-[52px] sm:h-11 sm:w-[64px]';
  const ringClass =
    tone === 'dark'
      ? 'border border-white/15 bg-white shadow-sm'
      : 'border border-[#E3E6F0] bg-white shadow-xs';

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div
        className={`${umFrameSize} rounded-lg p-0.5 flex items-center justify-center overflow-hidden ${ringClass}`}
        title="Universitas Negeri Malang"
      >
        <img
          src={UM_LOGO_SRC}
          alt="Logo Universitas Negeri Malang"
          className="h-full w-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      <div
        className={`${tepFrameSize} rounded-lg flex items-center justify-center overflow-hidden ${ringClass}`}
        title="Program Studi Teknologi Pendidikan"
      >
        <img
          src={TEP_LOGO_SRC}
          alt="Logo Teknologi Pendidikan Universitas Negeri Malang"
          className="h-full w-full object-cover object-center scale-[1.18] mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}
