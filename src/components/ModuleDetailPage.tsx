import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  Heart,
  Link2,
  User,
} from 'lucide-react';
import type { EModuleItem } from '../types/module';

interface ModuleDetailPageProps {
  module: EModuleItem;
  onBackToCatalog: () => void;
  onEndorse: (id: string) => void;
  onUpdateLink: (id: string, externalUrl: string) => Promise<void>;
}

const HEADER_BG_MAP: Record<string, string> = {
  '#2438C9': 'bg-[#2438C9]',
  '#E08A00': 'bg-[#E08A00]',
  '#0F7B6C': 'bg-[#0F7B6C]',
  '#7A3FC9': 'bg-[#7A3FC9]',
  '#C93B5A': 'bg-[#C93B5A]',
};

export function ModuleDetailPage({
  module,
  onBackToCatalog,
  onEndorse,
  onUpdateLink,
}: ModuleDetailPageProps) {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [editingLink, setEditingLink] = useState(false);
  const [linkDraft, setLinkDraft] = useState(module.externalUrl ?? '');
  const [savingLink, setSavingLink] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSavedNotice, setLinkSavedNotice] = useState(false);

  const headerBg = HEADER_BG_MAP[module.coverColor] ?? 'bg-[#2438C9]';
  const submittedDate = new Date(module.submittedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkError(null);
    setLinkSavedNotice(false);

    const trimmed = linkDraft.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        setLinkError('Tautan harus diawali dengan https:// atau http://.');
        return;
      }
    } catch {
      setLinkError('Format tautan tidak valid. Contoh: https://heyzine.com/flip-book/...');
      return;
    }

    setSavingLink(true);
    try {
      await onUpdateLink(module.id, trimmed);
      setEditingLink(false);
      setLinkSavedNotice(true);
    } catch (err) {
      setLinkError(
        err instanceof Error ? err.message : 'Gagal menyimpan tautan e-modul.',
      );
    } finally {
      setSavingLink(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
        <button
          type="button"
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D4D8E6] bg-white px-3.5 py-2 text-xs font-semibold text-[#14181F] transition-colors hover:border-[#2438C9] hover:text-[#2438C9] cursor-pointer sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span>Kembali ke Katalog</span>
        </button>

        <button
          type="button"
          onClick={() => onEndorse(module.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D4D8E6] bg-white px-3.5 py-2 text-xs font-bold text-[#14181F] transition-colors hover:border-[#C93B5A] hover:text-[#C93B5A] cursor-pointer sm:px-4 sm:py-2.5 sm:text-sm"
        >
          <Heart className="h-4 w-4 shrink-0 text-[#C93B5A]" />
          <span>Apresiasi ({module.likes})</span>
        </button>
      </div>

      <article className="overflow-hidden rounded-2xl border border-[#E3E6F0] bg-white shadow-sm sm:rounded-3xl">
        <div className={`${headerBg} p-5 text-white sm:p-10`}>
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold tracking-wider text-white/90 uppercase">
            <span className="rounded-md bg-white px-2.5 py-1 font-bold text-[#14181F]">
              {module.topic}
            </span>
            <span>·</span>
            <span>{module.offering}</span>
            <span>·</span>
            <span>{module.format}</span>
          </div>

          <h1 className="mt-4 font-display text-2xl leading-tight font-extrabold sm:text-4xl">
            {module.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/95">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <User className="h-4 w-4" />
              {module.authorName} (NIM {module.nim})
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <BookOpen className="h-4 w-4" />
              Sasaran: {module.targetAudience}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-6 p-5 sm:gap-8 sm:p-10">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#D4D8E6] bg-[#F7F8FC] p-4 sm:gap-5 sm:p-6 lg:flex-row lg:items-center">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#2438C9] uppercase">
                <Link2 className="h-3.5 w-3.5 shrink-0" />
                Akses Halaman Link E-Modul
              </span>
              {module.externalUrl ? (
                <p className="font-mono text-xs break-all text-[#4A5160] sm:text-sm">
                  {module.externalUrl}
                </p>
              ) : module.fileUrl ? (
                <p className="break-words text-sm font-medium text-[#14181F]">
                  Berkas terlampir: {module.fileName}{' '}
                  {module.fileSizeLabel ? `(${module.fileSizeLabel})` : ''}
                </p>
              ) : (
                <p className="text-sm text-[#4A5160]">
                  Belum ada tautan eksternal (Canva / Heyzine / Google Drive / Web) yang ditautkan pada karya ini.
                </p>
              )}
              {linkSavedNotice && (
                <p className="mt-1 text-xs font-semibold text-[#0F7B6C]">
                  Tautan e-modul berhasil disimpan! Klik tombol di samping atau BUKA E-MODUL di katalog untuk langsung menuju halaman tautan.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 shrink-0">
              {module.externalUrl && (
                <a
                  href={module.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#2438C9] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1c2da6] sm:min-h-[48px] sm:w-auto sm:px-6"
                >
                  Pindah ke Halaman Link
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              {module.fileUrl && (
                <a
                  href={module.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#14181F] px-6 text-sm font-bold text-white transition-colors hover:bg-[#2a3140]"
                >
                  <Download className="h-4 w-4" />
                  Buka / Unduh Berkas
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  setLinkDraft(module.externalUrl ?? '');
                  setLinkError(null);
                  setEditingLink((prev) => !prev);
                }}
                className="inline-flex min-h-[48px] items-center rounded-xl border border-[#B8BED0] bg-white px-4 text-sm font-semibold text-[#14181F] transition-colors hover:border-[#2438C9] hover:text-[#2438C9] cursor-pointer"
              >
                {editingLink
                  ? 'Batal'
                  : module.externalUrl
                    ? 'Ubah Tautan'
                    : '+ Tautkan Link E-Modul'}
              </button>
            </div>
          </div>

          {editingLink && (
            <form
              onSubmit={handleSaveLink}
              className="flex flex-col gap-3 rounded-2xl border border-[#2438C9]/30 bg-white p-5"
            >
              <label
                htmlFor="edit-external-url"
                className="text-sm font-bold text-[#14181F]"
              >
                Tempel Tautan Halaman E-Modul (Heyzine, Canva, Google Drive, atau Web)
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="edit-external-url"
                  type="url"
                  value={linkDraft}
                  onChange={(e) => setLinkDraft(e.target.value)}
                  placeholder="https://heyzine.com/flip-book/..."
                  className="min-h-[48px] flex-1 rounded-xl border border-[#B8BED0] px-4 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={savingLink}
                  className="min-h-[48px] rounded-xl bg-[#2438C9] px-6 text-sm font-bold text-white transition-colors hover:bg-[#1c2da6] disabled:opacity-60 cursor-pointer"
                >
                  {savingLink ? 'Menyimpan…' : 'Simpan Tautan'}
                </button>
              </div>
              {linkError && (
                <p className="text-xs font-semibold text-[#9F1239]">{linkError}</p>
              )}
            </form>
          )}

          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-[#E3E6F0] p-5 sm:grid-cols-3">
            <div>
              <span className="text-xs font-semibold text-[#6A7184] uppercase">
                Status Tinjauan
              </span>
              <p className="mt-1 text-base font-bold text-[#14181F]">
                {module.status}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#6A7184] uppercase">
                Skor Rubrik
              </span>
              <p className="mt-1 font-mono text-base font-bold text-[#2438C9]">
                {module.rubricScore > 0
                  ? `${module.rubricScore} / 100`
                  : 'Menunggu Penilaian'}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#6A7184] uppercase">
                Tanggal Publikasi
              </span>
              <p className="mt-1 text-base font-semibold text-[#14181F]">
                {submittedDate}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-wider text-[#6A7184] uppercase">
              Ringkasan & Tujuan Bahan Pembelajaran
            </h2>
            <p className="mt-2.5 text-base leading-relaxed text-[#14181F]">
              {module.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-2xl border border-[#E3E6F0] p-6 lg:col-span-6">
              <h2 className="font-display text-lg font-bold text-[#14181F]">
                Capaian Pembelajaran
              </h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-[#4A5160]">
                {module.learningObjectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F7B6C]" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#E3E6F0] p-6 lg:col-span-6">
              <h2 className="font-display text-lg font-bold text-[#14181F]">
                Peta Bab E-Modul
              </h2>
              <div className="mt-4 flex flex-col gap-2.5">
                {module.chapters.map((chapter, idx) => {
                  const active = activeChapterIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveChapterIdx(idx)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'border-[#2438C9] bg-[#2438C9]/5 text-[#2438C9]'
                          : 'border-[#E3E6F0] bg-[#F7F8FC] text-[#14181F] hover:border-[#B8BED0]'
                      }`}
                    >
                      {chapter}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
