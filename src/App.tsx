import React, { useCallback, useEffect, useState } from 'react';
import { AboutProgramSection } from './components/AboutProgramSection';
import { BrandHeader } from './components/BrandHeader';
import { CatalogSection } from './components/CatalogSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { ModuleDetailPage } from './components/ModuleDetailPage';
import { TeamSection } from './components/TeamSection';
import { UploadPage } from './components/UploadPage';
import { BASE_COLLECTION_OFFSET, SEED_MODULES } from './data/seedModules';
import type { EModuleItem } from './types/module';

function parseInitialRoute(): {
  view: 'home' | 'upload' | 'module';
  moduleId: string | null;
} {
  if (typeof window === 'undefined') return { view: 'home', moduleId: null };
  const hash = window.location.hash;
  if (hash === '#/unggah') {
    return { view: 'upload', moduleId: null };
  }
  if (hash.startsWith('#/emodul/')) {
    return {
      view: 'module',
      moduleId: decodeURIComponent(hash.replace('#/emodul/', '')),
    };
  }
  return { view: 'home', moduleId: null };
}

export default function App() {
  const initialRoute = parseInitialRoute();
  const [activeView, setActiveView] = useState<'home' | 'upload' | 'module'>(
    initialRoute.view,
  );
  const [modules, setModules] = useState<EModuleItem[]>(SEED_MODULES);
  const [hasLoadedFromServer, setHasLoadedFromServer] = useState(false);
  const [totalCollectedCount, setTotalCollectedCount] = useState<number>(
    BASE_COLLECTION_OFFSET + SEED_MODULES.length,
  );
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(
    initialRoute.moduleId,
  );

  const selectedModule =
    modules.find((item) => item.id === selectedModuleId) ?? null;

  const loadModules = useCallback(async () => {
    try {
      const response = await fetch('/api/modules');
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data.modules)) {
        setModules(data.modules);
        if (typeof data.totalCollectedCount === 'number') {
          setTotalCollectedCount(data.totalCollectedCount);
        }
      }
    } catch {
      // Keep seed fallback when static preview runs without API server
    } finally {
      setHasLoadedFromServer(true);
    }
  }, []);

  useEffect(() => {
    void loadModules();
  }, [loadModules]);

  useEffect(() => {
    const syncFromHash = () => {
      const route = parseInitialRoute();
      setActiveView(route.view);
      setSelectedModuleId(route.moduleId);
    };
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const scrollToSection = useCallback((sectionId?: string) => {
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }, []);

  const handleNavigate = (view: 'home' | 'upload', sectionId?: string) => {
    setActiveView(view);
    setSelectedModuleId(null);
    if (view === 'upload') {
      window.location.hash = '#/unggah';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (window.location.hash) {
        window.history.pushState(
          null,
          '',
          window.location.pathname + window.location.search,
        );
      }
      scrollToSection(sectionId);
    }
  };

  const handleOpenModulePage = (module: EModuleItem) => {
    setSelectedModuleId(module.id);
    setActiveView('module');
    window.location.hash = `#/emodul/${encodeURIComponent(module.id)}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEndorseModule = async (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m)),
    );

    try {
      const response = await fetch(`/api/modules/${encodeURIComponent(id)}/endorse`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.module) {
          setModules((prev) =>
            prev.map((m) => (m.id === id ? data.module : m)),
          );
        }
      }
    } catch {
      // Optimistic count remains updated locally
    }
  };

  const handleUpdateModuleLink = async (id: string, externalUrl: string) => {
    const response = await fetch(`/api/modules/${encodeURIComponent(id)}/link`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ externalUrl }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? 'Gagal menyimpan tautan.');
    }
    if (data.module) {
      setModules((prev) =>
        prev.map((m) => (m.id === id ? data.module : m)),
      );
    }
  };

  const handleSuccessSubmit = (
    savedModule: EModuleItem,
    nextTotalCount: number,
    replaced: boolean,
  ) => {
    setModules((prev) => {
      if (replaced) {
        const filtered = prev.filter((item) => item.nim !== savedModule.nim);
        return [savedModule, ...filtered];
      }
      return [savedModule, ...prev];
    });
    if (typeof nextTotalCount === 'number') {
      setTotalCollectedCount(nextTotalCount);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#F7F8FC] text-[#14181F]">
      <BrandHeader activeView={activeView} onNavigate={handleNavigate} />

      {activeView === 'upload' ? (
        <div className="flex-1">
          <UploadPage
            onSuccessSubmit={handleSuccessSubmit}
            onBackToCatalog={() => handleNavigate('home', 'katalog')}
          />
        </div>
      ) : activeView === 'module' ? (
        <div className="flex-1">
          {selectedModule ? (
            <ModuleDetailPage
              key={selectedModule.id}
              module={selectedModule}
              onBackToCatalog={() => handleNavigate('home', 'katalog')}
              onEndorse={handleEndorseModule}
              onUpdateLink={handleUpdateModuleLink}
            />
          ) : !hasLoadedFromServer ? (
            <div className="mx-auto max-w-3xl px-5 py-24 text-center text-sm text-[#4A5160]">
              Memuat detail e-modul…
            </div>
          ) : (
            <div className="mx-auto max-w-2xl px-5 py-24 text-center">
              <h1 className="font-display text-2xl font-bold text-[#14181F]">
                E-Modul Tidak Ditemukan
              </h1>
              <p className="mt-2 text-sm text-[#4A5160]">
                Karya yang dicari tidak tersedia atau tautan telah berubah.
              </p>
              <button
                type="button"
                onClick={() => handleNavigate('home', 'katalog')}
                className="mt-6 inline-flex min-h-[46px] items-center rounded-xl bg-[#2438C9] px-6 text-sm font-bold text-white hover:bg-[#1c2da6] cursor-pointer"
              >
                Kembali ke Katalog
              </button>
            </div>
          )}
        </div>
      ) : (
        <main className="flex-1">
          <HeroSection
            totalCollectedCount={totalCollectedCount}
            latestModule={modules[0]}
            onGoToUpload={() => handleNavigate('upload')}
            onExploreCatalog={() => scrollToSection('katalog')}
            onOpenModule={handleOpenModulePage}
          />
          <AboutProgramSection />
          <CatalogSection
            modules={modules}
            onSelectModule={handleOpenModulePage}
            onEndorseModule={handleEndorseModule}
          />
          <TeamSection onGoToUpload={() => handleNavigate('upload')} />
        </main>
      )}

      <Footer onScrollTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
    </div>
  );
}
