import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileCheck2,
  Trash2,
  Upload,
} from 'lucide-react';
import { MEDIA_FORMATS, OFFERINGS } from '../data/seedModules';
import type { EModuleItem, MediaFormat, Offering, SubmitModulePayload } from '../types/module';

interface UploadPageProps {
  onSuccessSubmit: (savedModule: EModuleItem, totalCollectedCount: number, replaced: boolean) => void;
  onBackToCatalog: () => void;
}

const MAX_FILE_BYTES = 15 * 1024 * 1024;

export function UploadPage({ onSuccessSubmit, onBackToCatalog }: UploadPageProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [authorName, setAuthorName] = useState('');
  const [nim, setNim] = useState('');
  const [offering, setOffering] = useState<Offering>('Offering A2A');
  const [format, setFormat] = useState<MediaFormat>('Heyzine Flipbook');
  const [topic, setTopic] = useState('Multimedia Interaktif');
  const [targetAudience, setTargetAudience] = useState('SMP / SMA Sederajat');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [isOriginal, setIsOriginal] = useState(false);

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    sizeLabel: string;
    base64: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    module: EModuleItem;
    replaced: boolean;
  } | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFilePicked = (file: File | null) => {
    setErrorMessage(null);
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const validExt =
      lowerName.endsWith('.pdf') ||
      lowerName.endsWith('.zip') ||
      lowerName.endsWith('.html') ||
      lowerName.endsWith('.htm');

    if (!validExt) {
      setErrorMessage('Format berkas harus berupa PDF, HTML5 (.html), atau ZIP.');
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setErrorMessage('Ukuran berkas maksimal 15 MB agar unggahan berjalan stabil.');
      return;
    }

    setIsReadingFile(true);
    const reader = new FileReader();
    reader.onload = () => {
      setIsReadingFile(false);
      if (typeof reader.result === 'string') {
        setSelectedFile({
          name: file.name,
          sizeLabel: formatFileSize(file.size),
          base64: reader.result,
        });
      }
    };
    reader.onerror = () => {
      setIsReadingFile(false);
      setErrorMessage('Gagal membaca berkas. Pastikan berkas tidak rusak dan coba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (isReadingFile) {
      setErrorMessage('Berkas sedang diproses, tunggu sebentar sebelum mengirim.');
      return;
    }
    if (authorName.trim().length < 3) {
      setErrorMessage('Masukkan nama lengkap sesuai SIAKAD.');
      return;
    }
    if (!/^[0-9]{6,16}$/.test(nim.trim())) {
      setErrorMessage('Masukkan NIM berupa angka 6–16 digit.');
      return;
    }
    if (title.trim().length < 5) {
      setErrorMessage('Judul e-modul minimal 5 karakter.');
      return;
    }
    const trimmedUrl = externalUrl.trim();
    if (trimmedUrl) {
      try {
        const parsed = new URL(trimmedUrl);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          setErrorMessage('Tautan harus diawali dengan https:// atau http://.');
          return;
        }
      } catch {
        setErrorMessage('Format tautan tidak valid. Contoh: https://heyzine.com/flip-book/...');
        return;
      }
    }
    if (!selectedFile && !trimmedUrl) {
      setErrorMessage('Unggah berkas e-modul atau isi tautan Canva / Heyzine / Google Drive.');
      return;
    }
    if (!isOriginal) {
      setErrorMessage('Centang pernyataan bahwa e-modul ini karya sendiri.');
      return;
    }

    const payload: SubmitModulePayload = {
      authorName: authorName.trim(),
      nim: nim.trim(),
      offering,
      format,
      topic: topic.trim() || 'Bahan Pembelajaran',
      targetAudience: targetAudience.trim() || 'Peserta Didik',
      title: title.trim(),
      description: description.trim(),
      externalUrl: externalUrl.trim() || undefined,
      fileName: selectedFile?.name,
      fileSizeLabel: selectedFile?.sizeLabel,
      fileContentBase64: selectedFile?.base64,
      isOriginal,
    };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error ?? 'Gagal mengirim e-modul. Periksa kembali isian.');
        return;
      }

      setSubmittedResult({ module: data.module, replaced: Boolean(data.replaced) });
      onSuccessSubmit(data.module, data.totalCollectedCount, Boolean(data.replaced));
    } catch {
      setErrorMessage('Terjadi gangguan koneksi saat mengirim tugas. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedResult(null);
    setAuthorName('');
    setNim('');
    setTitle('');
    setDescription('');
    setExternalUrl('');
    setSelectedFile(null);
    setIsOriginal(false);
    setErrorMessage(null);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
      <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#E3E6F0] bg-white p-5 sm:p-9 lg:col-span-8">
          {submittedResult ? (
            <div className="flex flex-col items-start gap-5 py-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F4EC] text-[#0F7B6C]">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <h1 className="font-display text-2xl font-bold text-[#14181F] sm:text-3xl">
                  {submittedResult.replaced
                    ? 'Versi Terbaru E-Modul Berhasil Diperbarui'
                    : 'E-Modul Berhasil Dikirim ke Portofolio'}
                </h1>
                <p className="mt-2 text-base text-[#4A5160]">
                  Karya{' '}
                  <strong className="text-[#14181F]">
                    {submittedResult.module.title}
                  </strong>{' '}
                  oleh {submittedResult.module.authorName} (
                  {submittedResult.module.offering}) kini tercatat dengan status{' '}
                  <strong className="text-[#B45309]">Dalam Tinjauan</strong> dan
                  dapat dilihat pada katalog.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={onBackToCatalog}
                  className="inline-flex min-h-[48px] items-center rounded-xl bg-[#2438C9] px-6 text-sm font-bold text-white hover:bg-[#1c2da6] cursor-pointer"
                >
                  Lihat Karya di Katalog
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex min-h-[48px] items-center rounded-xl border border-[#B8BED0] bg-white px-6 text-sm font-semibold text-[#14181F] hover:border-[#14181F] cursor-pointer"
                >
                  Unggah E-Modul Lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight text-[#14181F]">
                  Unggah E-Modul
                </h1>
                <p className="mt-1 text-sm text-[#4A5160] sm:text-[15px]">
                  Isi data di bawah, lalu kirim sebelum batas waktu pengumpulan.
                </p>
              </div>

              {errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-[#F3B7C4] bg-[#FFF5F7] px-4 py-3 text-sm font-medium text-[#9F1239]"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="nama"
                    className="text-sm font-semibold text-[#14181F]"
                  >
                    Nama lengkap
                  </label>
                  <input
                    id="nama"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Nama sesuai SIAKAD"
                    className="min-h-[48px] rounded-xl border border-[#B8BED0] px-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="nim"
                    className="text-sm font-semibold text-[#14181F]"
                  >
                    NIM
                  </label>
                  <input
                    id="nim"
                    type="text"
                    inputMode="numeric"
                    value={nim}
                    onChange={(e) => setNim(e.target.value)}
                    placeholder="Contoh: 240121604108"
                    className="min-h-[48px] rounded-xl border border-[#B8BED0] px-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="offering"
                    className="text-sm font-semibold text-[#14181F]"
                  >
                    Offering
                  </label>
                  <select
                    id="offering"
                    value={offering}
                    onChange={(e) => setOffering(e.target.value as Offering)}
                    className="min-h-[48px] rounded-xl border border-[#B8BED0] bg-white px-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none cursor-pointer"
                  >
                    {OFFERINGS.map((off) => (
                      <option key={off} value={off}>
                        {off}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="format-media"
                    className="text-sm font-semibold text-[#14181F]"
                  >
                    Format Media E-Modul
                  </label>
                  <select
                    id="format-media"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as MediaFormat)}
                    className="min-h-[48px] rounded-xl border border-[#B8BED0] bg-white px-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none cursor-pointer"
                  >
                    {MEDIA_FORMATS.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="topik"
                    className="text-sm font-semibold text-[#14181F]"
                  >
                    Topik / Bidang Kajian
                  </label>
                  <input
                    id="topik"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Contoh: Desain Visual, STEM, Literasi Digital"
                    className="min-h-[48px] rounded-xl border border-[#B8BED0] px-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sasaran"
                    className="text-sm font-semibold text-[#14181F]"
                  >
                    Sasaran Pebelajar
                  </label>
                  <input
                    id="sasaran"
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Contoh: SMP Kelas VIII / Mahasiswa S1"
                    className="min-h-[48px] rounded-xl border border-[#B8BED0] px-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="judul"
                  className="text-sm font-semibold text-[#14181F]"
                >
                  Judul e-modul
                </label>
                <input
                  id="judul"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul e-modul yang kamu kembangkan"
                  className="min-h-[48px] rounded-xl border border-[#B8BED0] px-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="deskripsi"
                  className="text-sm font-semibold text-[#14181F]"
                >
                  Deskripsi singkat isi & tujuan e-modul
                </label>
                <textarea
                  id="deskripsi"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tuliskan ringkasan materi serta capaian pembelajaran utama dalam 1–2 kalimat."
                  className="rounded-xl border border-[#B8BED0] p-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-[#14181F]">
                  Berkas e-modul
                </span>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0] ?? null;
                    handleFilePicked(file);
                  }}
                  className={`flex flex-col items-center gap-2.5 rounded-xl border-2 border-dashed p-7 text-center transition-colors ${
                    isDragging
                      ? 'border-[#2438C9] bg-[#2438C9]/5'
                      : 'border-[#8E97B5] bg-[#F7F8FC]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.zip,.html,.htm"
                    onChange={(e) => handleFilePicked(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileCheck2 className="h-8 w-8 text-[#0F7B6C]" />
                      <p className="text-sm font-bold text-[#14181F]">
                        {selectedFile.name}{' '}
                        <span className="font-normal text-[#4A5160]">
                          ({selectedFile.sizeLabel})
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C93B5A] hover:underline cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus berkas
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-[#2438C9]" />
                      <span className="font-semibold text-[#14181F]">
                        Tarik berkas ke sini
                      </span>
                      <span className="text-xs text-[#4A5160]">
                        PDF, HTML5, atau ZIP · maksimal 15 MB
                      </span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-1 min-h-[42px] rounded-lg border-2 border-[#2438C9] bg-white px-5 text-sm font-semibold text-[#2438C9] transition-colors hover:bg-[#2438C9] hover:text-white cursor-pointer"
                      >
                        Pilih berkas
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="tautan"
                  className="text-sm font-semibold text-[#14181F]"
                >
                  Atau tautan e-modul (Canva, Heyzine, Google Drive)
                </label>
                <input
                  id="tautan"
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://"
                  className="min-h-[48px] rounded-xl border border-[#B8BED0] px-3.5 text-[15px] text-[#14181F] focus:border-[#2438C9] focus:ring-2 focus:ring-[#2438C9]/15 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-[#4A5160] cursor-pointer">
                <input
                  id="orisinal"
                  type="checkbox"
                  checked={isOriginal}
                  onChange={(e) => setIsOriginal(e.target.checked)}
                  className="h-5 w-5 rounded border-[#B8BED0] accent-[#2438C9]"
                />
                <span>Saya menyatakan e-modul ini karya sendiri dan bebas plagiarisme.</span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting || isReadingFile}
                className="mt-1 inline-flex min-h-[52px] w-full items-center justify-center rounded-xl bg-[#2438C9] px-8 text-base font-semibold text-white transition-colors hover:bg-[#1c2da6] disabled:opacity-60 cursor-pointer sm:w-fit"
              >
                {isReadingFile
                  ? 'Memproses Berkas…'
                  : isSubmitting
                    ? 'Mengirim Tugas…'
                    : 'Kirim Tugas'}
              </button>
            </form>
          )}
        </div>

        <aside className="flex flex-col gap-5 lg:col-span-4">
          <div className="rounded-2xl border border-[#E3E6F0] bg-white p-5 sm:p-7">
            <h2 className="font-display text-lg font-bold text-[#14181F]">
              Ketentuan
            </h2>
            <ol className="mt-3 flex flex-col gap-2.5 text-[15px] leading-relaxed text-[#4A5160]">
              <li>1. Gunakan format yang diminta dosen (PDF, HTML5, ZIP, atau tautan interaktif).</li>
              <li>2. Pastikan tautan Canva, Heyzine, atau Google Drive dapat dibuka tanpa izin khusus.</li>
              <li>3. Unggahan ulang menggunakan NIM yang sama menggantikan versi sebelumnya.</li>
            </ol>
          </div>

          <div className="rounded-2xl bg-[#FFF1D6] p-5 text-[#7A4B00] sm:p-7">
            <h2 className="font-display text-lg font-bold">Batas unggah</h2>
            <p className="mt-1.5 text-[15px] font-semibold">
              Minggu ke-16 · 12 Juni 2026, 23.59 WIB
            </p>
            <p className="mt-1 text-xs opacity-85">
              Semester Genap 2025/2026 · Mata Kuliah Bahan Pembelajaran TEP UM
            </p>
          </div>

          <div className="rounded-2xl border border-[#E3E6F0] bg-white p-5 sm:p-7">
            <h2 className="font-display text-lg font-bold text-[#14181F]">
              Format Penamaan Berkas
            </h2>
            <p className="mt-2 font-mono text-xs leading-relaxed break-all text-[#4A5160]">
              Offering_NIM_NamaDepan_JudulSingkat.pdf
            </p>
            <p className="mt-2 font-mono text-[11px] break-all text-[#6A7184]">
              Contoh: A2A_240121604108_Nadia_DesainVisual.pdf
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
