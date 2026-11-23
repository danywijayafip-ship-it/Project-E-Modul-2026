import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  BASE_COLLECTION_OFFSET,
  COVER_PALETTE,
  MEDIA_FORMATS,
  OFFERINGS,
  SEED_MODULES,
} from './src/data/seedModules.ts';
import type { EModuleItem, MediaFormat, Offering } from './src/types/module.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const MODULES_FILE = path.join(DATA_DIR, 'modules.json');
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.zip', '.html', '.htm']);

function ensureStorage(): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(MODULES_FILE)) {
    fs.writeFileSync(MODULES_FILE, JSON.stringify(SEED_MODULES, null, 2), 'utf8');
  }
}

function readModules(): EModuleItem[] {
  ensureStorage();
  try {
    const raw = fs.readFileSync(MODULES_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed as EModuleItem[];
    }
  } catch {
    // Fallback to seed modules if storage file was corrupted
  }
  return [...SEED_MODULES];
}

function writeModules(modules: EModuleItem[]): void {
  ensureStorage();
  fs.writeFileSync(MODULES_FILE, JSON.stringify(modules, null, 2), 'utf8');
}

function sanitizeSafeUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function sanitizeFileName(rawName: string): string {
  const base = path.basename(rawName).replace(/[^a-zA-Z0-9._-]/g, '_');
  return base.slice(0, 120) || 'emodul.pdf';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function startServer(): Promise<void> {
  ensureStorage();

  const app = express();
  app.use(express.json({ limit: '22mb' }));

  app.get('/api/modules', (_req, res) => {
    const modules = readModules();
    res.json({
      modules,
      totalCollectedCount: BASE_COLLECTION_OFFSET + modules.length,
    });
  });

  app.post('/api/modules', (req, res) => {
    const body = req.body ?? {};
    const authorName = typeof body.authorName === 'string' ? body.authorName.trim() : '';
    const nim = typeof body.nim === 'string' ? body.nim.trim() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description =
      typeof body.description === 'string' ? body.description.trim() : '';
    const topic =
      typeof body.topic === 'string' && body.topic.trim()
        ? body.topic.trim().slice(0, 48)
        : 'Bahan Pembelajaran';
    const targetAudience =
      typeof body.targetAudience === 'string' && body.targetAudience.trim()
        ? body.targetAudience.trim().slice(0, 48)
        : 'Peserta Didik / Umum';
    const offering = OFFERINGS.includes(body.offering as Offering)
      ? (body.offering as Offering)
      : 'Offering A2A';
    const format = MEDIA_FORMATS.includes(body.format as MediaFormat)
      ? (body.format as MediaFormat)
      : 'PDF Interaktif';
    const isOriginal = body.isOriginal === true;

    if (authorName.length < 3) {
      res.status(400).json({ error: 'Nama lengkap mahasiswa wajib diisi (min. 3 karakter).' });
      return;
    }
    if (!/^[0-9]{6,16}$/.test(nim)) {
      res.status(400).json({ error: 'NIM harus berupa angka 6–16 digit sesuai SIAKAD.' });
      return;
    }
    if (title.length < 5) {
      res.status(400).json({ error: 'Judul e-modul wajib diisi (min. 5 karakter).' });
      return;
    }
    if (!isOriginal) {
      res.status(400).json({
        error: 'Centang pernyataan keaslian karya sebelum mengirim tugas.',
      });
      return;
    }

    const rawUrl = typeof body.externalUrl === 'string' ? body.externalUrl.trim() : '';
    const externalUrl = sanitizeSafeUrl(rawUrl);
    if (rawUrl && !externalUrl) {
      res.status(400).json({
        error: 'Tautan harus diawali dengan https:// atau http:// yang valid.',
      });
      return;
    }

    let savedFileName: string | undefined;
    let savedFileSizeLabel: string | undefined;
    let savedFileUrl: string | undefined;

    if (
      typeof body.fileName === 'string' &&
      body.fileName.trim() &&
      typeof body.fileContentBase64 === 'string' &&
      body.fileContentBase64.trim()
    ) {
      const safeName = sanitizeFileName(body.fileName);
      const ext = path.extname(safeName).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        res.status(400).json({
          error: 'Format berkas tidak didukung. Gunakan PDF, HTML5, atau ZIP.',
        });
        return;
      }
      const base64Payload = body.fileContentBase64.includes(',')
        ? body.fileContentBase64.split(',')[1]
        : body.fileContentBase64;
      const buffer = Buffer.from(base64Payload, 'base64');
      if (buffer.length === 0 || buffer.length > MAX_UPLOAD_BYTES) {
        res.status(400).json({
          error: 'Ukuran berkas melebihi batas maksimal 15 MB atau berkas kosong.',
        });
        return;
      }

      const uniqueName = `${nim}_${Date.now()}_${safeName}`;
      fs.writeFileSync(path.join(UPLOADS_DIR, uniqueName), buffer);
      savedFileName = safeName;
      savedFileSizeLabel = formatBytes(buffer.length);
      savedFileUrl = `/api/uploads/${encodeURIComponent(uniqueName)}`;
    }

    if (!externalUrl && !savedFileUrl) {
      res.status(400).json({
        error: 'Unggah berkas e-modul atau sertakan tautan e-modul yang dapat diakses.',
      });
      return;
    }

    const modules = readModules();
    const existingIndex = modules.findIndex((item) => item.nim === nim);
    const nowIso = new Date().toISOString();
    const coverColor =
      COVER_PALETTE[(modules.length + nim.charCodeAt(nim.length - 1)) % COVER_PALETTE.length];

    const normalizedDescription =
      description ||
      `E-modul ${format} karya ${authorName} (${offering}) untuk mendukung pembelajaran ${topic.toLowerCase()}.`;

    if (existingIndex >= 0) {
      const updated: EModuleItem = {
        ...modules[existingIndex],
        title,
        description: normalizedDescription,
        authorName,
        offering,
        topic,
        format,
        targetAudience,
        status: 'Dalam Tinjauan',
        externalUrl,
        fileName: savedFileName,
        fileSizeLabel: savedFileSizeLabel,
        fileUrl: savedFileUrl,
        submittedAt: nowIso,
      };
      modules.splice(existingIndex, 1);
      modules.unshift(updated);
      writeModules(modules);
      res.status(200).json({
        module: updated,
        replaced: true,
        totalCollectedCount: BASE_COLLECTION_OFFSET + modules.length,
      });
      return;
    }

    const newItem: EModuleItem = {
      id: `mod-${Date.now()}`,
      title,
      description: normalizedDescription,
      learningObjectives: [
        `Memahami konsep inti ${title} secara mandiri melalui media ${format}.`,
        'Menyelesaikan aktivitas latihan dan refleksi pemahaman yang tersedia di dalam e-modul.',
      ],
      chapters: [
        'Bagian 1 · Pengantar & Peta Kompetensi',
        'Bagian 2 · Uraian Materi & Contoh Kontekstual',
        'Bagian 3 · Evaluasi Mandiri',
      ],
      authorName,
      nim,
      offering,
      topic,
      format,
      targetAudience,
      coverColor,
      status: 'Dalam Tinjauan',
      rubricScore: 0,
      externalUrl,
      fileName: savedFileName,
      fileSizeLabel: savedFileSizeLabel,
      fileUrl: savedFileUrl,
      submittedAt: nowIso,
      likes: 1,
    };

    modules.unshift(newItem);
    writeModules(modules);
    res.status(201).json({
      module: newItem,
      replaced: false,
      totalCollectedCount: BASE_COLLECTION_OFFSET + modules.length,
    });
  });

  app.post('/api/modules/:id/endorse', (req, res) => {
    const id = req.params.id;
    const modules = readModules();
    const index = modules.findIndex((m) => m.id === id);
    if (index < 0) {
      res.status(404).json({ error: 'E-modul tidak ditemukan.' });
      return;
    }
    modules[index] = {
      ...modules[index],
      likes: (modules[index].likes ?? 0) + 1,
    };
    writeModules(modules);
    res.json({ module: modules[index] });
  });

  app.patch('/api/modules/:id/link', (req, res) => {
    const id = req.params.id;
    const rawUrl = typeof req.body?.externalUrl === 'string' ? req.body.externalUrl.trim() : '';
    const externalUrl = sanitizeSafeUrl(rawUrl);

    if (!externalUrl) {
      res.status(400).json({
        error: 'Masukkan tautan yang valid diawali https:// atau http://.',
      });
      return;
    }

    const modules = readModules();
    const index = modules.findIndex((m) => m.id === id);
    if (index < 0) {
      res.status(404).json({ error: 'E-modul tidak ditemukan.' });
      return;
    }

    modules[index] = {
      ...modules[index],
      externalUrl,
    };
    writeModules(modules);
    res.json({ module: modules[index] });
  });

  app.get('/api/uploads/:filename', (req, res) => {
    const safeFile = path.basename(req.params.filename);
    const fullPath = path.join(UPLOADS_DIR, safeFile);
    if (!fullPath.startsWith(UPLOADS_DIR) || !fs.existsSync(fullPath)) {
      res.status(404).json({ error: 'Berkas tidak ditemukan.' });
      return;
    }
    const ext = path.extname(safeFile).toLowerCase();
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${safeFile}"`);
    } else {
      res.setHeader('Content-Disposition', `attachment; filename="${safeFile}"`);
    }
    res.sendFile(fullPath);
  });

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (
        err &&
        typeof err === 'object' &&
        'type' in err &&
        (err as { type?: string }).type === 'entity.too.large'
      ) {
        res.status(413).json({
          error: 'Ukuran berkas terlalu besar. Maksimal 15 MB.',
        });
        return;
      }
      if (err instanceof SyntaxError) {
        res.status(400).json({ error: 'Format data tidak valid.' });
        return;
      }
      next(err);
    },
  );

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portofolio E-Modul TEP UM berjalan pada http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Gagal menjalankan server:', err);
  process.exit(1);
});
