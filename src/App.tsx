import React, { useState, useEffect } from 'react';
import {
  INITIAL_LAYERS,
  GRAFFITI_STEPS,
  GRAFFITI_STEPS_NATURE,
  GRAFFITI_STEPS_GEOMETRIC,
  DEFAULT_PALETTE,
  COLORWAY_PRESETS
} from './data/graffitiGuideData';
import { DesignTheme, CustomPalette, ColorwayPreset } from './types/graffiti';
import { GraffitiDiagram2D } from './components/GraffitiDiagram2D';
import { GraffitiCanvas3D } from './components/GraffitiCanvas3D';
import { StepByStepGuide } from './components/StepByStepGuide';
import { SpraySimulator } from './components/SpraySimulator';
import { ColorPaletteTheory } from './components/ColorPaletteTheory';
import { UrbanColorRack } from './components/UrbanColorRack';
import { LayerManager } from './components/LayerManager';
import { BlueprintExporter } from './components/BlueprintExporter';
import {
  Compass,
  Layers,
  Sparkles,
  Download,
  Info,
  Palette,
  Eye,
  Sliders,
  CheckCircle2,
  Share2,
  Trees,
  Shapes,
  Type,
  Sun,
  Shield,
  Lightbulb,
  Maximize2,
  Flame,
  Zap
} from 'lucide-react';

export default function App() {
  const [layers, setLayers] = useState(INITIAL_LAYERS);
  const [theme, setTheme] = useState<DesignTheme>('nature');
  const [customWord, setCustomWord] = useState('NATURE');
  const [palette, setPalette] = useState<CustomPalette>(DEFAULT_PALETTE);
  const [activeColorwayId, setActiveColorwayId] = useState('rgb-classic');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'2d-diagram' | '3d-webgl' | 'spray-sim'>('2d-diagram');
  const [vanishingPoint, setVanishingPoint] = useState({ x: 500, y: 530 });
  const [explodedOffset, setExplodedOffset] = useState(0);
  const [anaglyphMode, setAnaglyphMode] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [isPlayingSteps, setIsPlayingSteps] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Determine active steps according to design theme
  const currentSteps = theme === 'nature'
    ? GRAFFITI_STEPS_NATURE
    : theme === 'geometric'
    ? GRAFFITI_STEPS_GEOMETRIC
    : GRAFFITI_STEPS;

  // Toggle Layer visibility
  const handleToggleLayer = (id: string) => {
    setLayers(prev =>
      prev.map(l => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const handleSetLayerOpacity = (id: string, opacity: number) => {
    setLayers(prev =>
      prev.map(l => (l.id === id ? { ...l, opacity } : l))
    );
  };

  const handleSelectColorway = (preset: ColorwayPreset) => {
    setActiveColorwayId(preset.id);
    setPalette(preset.palette);
  };

  // Step slideshow playback
  useEffect(() => {
    if (!isPlayingSteps) return;
    const interval = setInterval(() => {
      setActiveStepIndex(prev => {
        if (prev >= currentSteps.length - 1) {
          setIsPlayingSteps(false);
          return 0;
        }
        return prev + 1;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlayingSteps, currentSteps.length]);

  // When step changes, highlight corresponding layer
  const handleSelectStep = (index: number) => {
    setActiveStepIndex(index);
    const stepLayerMap = [
      'grid',
      'skeleton',
      'fillin',
      'blocks3d',
      'greenpower',
      'masteroutline',
      'highlights',
      'powerhalo'
    ];
    const targetLayerId = stepLayerMap[index];
    if (targetLayerId) {
      setLayers(prev =>
        prev.map(l => (l.id === targetLayerId ? { ...l, visible: true } : l))
      );
    }
  };

  const handleThemeChange = (newTheme: DesignTheme) => {
    setTheme(newTheme);
    setActiveStepIndex(0);
    if (newTheme === 'nature' && (customWord === '3D' || customWord === 'GEO')) {
      setCustomWord('NATURE');
    } else if (newTheme === 'geometric' && customWord === 'NATURE') {
      setCustomWord('GEO');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-black">
      {/* Hazard accent strip at very top */}
      <div className="w-full h-1.5 bg-hazard-stripes opacity-80" />

      {/* 1. TOP BAR (Strict 3-Zone Top Bar Contract with Urban Identity) */}
      <header className="sticky top-0 z-40 bg-[#070a0f]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark with Street Art Tag */}
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-graffiti flex items-center gap-2 hover:text-amber-400 transition-colors"
          >
            <span className="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
            <span className="tracking-wider">GRAFFITI LABS TISOUT</span>
          </a>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-400">
            <a
              href="#diagrama"
              onClick={() => setViewMode('2d-diagram')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 ${viewMode === '2d-diagram' ? 'text-amber-400' : ''}`}
            >
              Diagrama & Peça
            </a>
            <a
              href="#paleta-completa"
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Cores de Spray</span>
            </a>
            <a
              href="#simulador"
              onClick={() => setViewMode('spray-sim')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 ${viewMode === 'spray-sim' ? 'text-amber-400' : ''}`}
            >
              Simulador Muro Pro
            </a>
            <a
              href="#passo-a-passo"
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              Passo a Passo
            </a>
            <a
              href="#sombreamento-tecnicas"
              className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
            >
              Técnicas 3D
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shadow-amber-400/20 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 font-display uppercase tracking-wider"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Blueprint</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO / URBAN STREET-ART BANNER */}
      <section className="relative w-full border-b border-slate-800/80 bg-gradient-to-b from-[#0d131f] to-transparent py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Metadata clean text with Street Calligraphy */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-amber-400 font-tag text-sm tracking-normal">BLACKBOOK WORKSHOP</span>
            <span aria-hidden="true">·</span>
            <span>Estilo Wildstyle Block & Isométrico</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Paleta 22 Sprays Liberada</span>
            <span aria-hidden="true">·</span>
            <span>Simulador de Muro com Áudio Hiss</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display uppercase text-balance leading-tight">
                Graffiti Labs Tisout
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Estúdio de grafite 3D e laboratório de spray: personalize sua tag, explore camadas explodidas em perspectiva, domine os bicos profissionais e crie murais no muro com física e áudio real.
              </p>
            </div>

            {/* Custom Letters Input & Preset Palette */}
            <div className="flex flex-col gap-3 p-4 bg-[#0d121c] rounded-2xl border-2 border-slate-800 shadow-2xl self-start lg:self-auto shrink-0 w-full sm:w-auto tape-tag">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5 font-display">
                  <Type className="w-4 h-4 text-amber-400" />
                  <span>Letras do Grafite (Tag):</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  {customWord.length}/6 LETRAS
                </span>
              </div>

              {/* Text Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={customWord}
                  onChange={(e) => setCustomWord(e.target.value.toUpperCase())}
                  placeholder="EX: NATURE"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 border-2 border-slate-700 font-graffiti text-amber-400 tracking-wider text-base focus:outline-none focus:border-amber-400 w-48 shadow-inner"
                />
                <button
                  onClick={() => setCustomWord('NATURE')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Tags:</span>
                {['NATURE', 'BIO', 'GEO', 'VERDE', 'RIO', '3D'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setCustomWord(preset)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                      customWord === preset
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Selector Strip (Urban Street Art Badges) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {/* Theme 1: Nature */}
            <button
              onClick={() => handleThemeChange('nature')}
              className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                theme === 'nature'
                  ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xl'
                  : 'bg-[#0d121c]/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Trees className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-display">1. Bio-Wildstyle (Natureza)</span>
                  {theme === 'nature' && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Folhas tropicais de Monstera, cipós 3D e horizonte com sol poente e ondas azuis profundas.
                </p>
              </div>
            </button>

            {/* Theme 2: Geometric */}
            <button
              onClick={() => handleThemeChange('geometric')}
              className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                theme === 'geometric'
                  ? 'bg-cyan-950/40 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xl'
                  : 'bg-[#0d121c]/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                <Shapes className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-display">2. Abstrato Geométrico 3D</span>
                  {theme === 'geometric' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Prismas triangulares flutuantes, esferas azuis com volume volumétrico e feixes cinéticos de velocidade.
                </p>
              </div>
            </button>

            {/* Theme 3: Letters 3D */}
            <button
              onClick={() => handleThemeChange('letters3d')}
              className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                theme === 'letters3d'
                  ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-xl'
                  : 'bg-[#0d121c]/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <Type className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-display">3. Wildstyle Tipográfico</span>
                  {theme === 'letters3d' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Foco na escultura das letras bloco, chanfros a 45°, cortes de energia e contorno de choque elétrico.
                </p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE / INTERACTIVE STAGE */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-10">
        {/* SECTION A: THE DIAGRAM STAGE */}
        <section id="diagrama" className="flex flex-col gap-5 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display flex items-center gap-2">
                <span>Diagrama de Construção com a Tag:</span>
                <span className="text-amber-400 font-graffiti tracking-wider underline decoration-amber-500/60 text-2xl">
                  {customWord || '3D'}
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Ponto de fuga arrastável, cores ativas em tempo real e visualização de camadas explodidas.
              </p>
            </div>
          </div>

          {/* Interactive Screen Display Based on View Mode */}
          {viewMode === '2d-diagram' && (
            <GraffitiDiagram2D
              layers={layers}
              onToggleLayer={handleToggleLayer}
              onSetLayerOpacity={handleSetLayerOpacity}
              vanishingPoint={vanishingPoint}
              onVanishingPointChange={setVanishingPoint}
              activeStep={activeStepIndex}
              anaglyphMode={anaglyphMode}
              explodedOffset={explodedOffset}
              showAnnotations={showAnnotations}
              customWord={customWord}
              theme={theme}
              palette={palette}
            />
          )}

          {viewMode === '3d-webgl' && (
            <GraffitiCanvas3D
              explodedSpread={explodedOffset}
              wireframe={false}
              lightingAngle={45}
              rotationSpeed={0.3}
              theme={theme}
              customWord={customWord}
              palette={palette}
            />
          )}

          {viewMode === 'spray-sim' && (
            <SpraySimulator customWord={customWord} />
          )}

          {/* Layer and View Controls Deck */}
          <LayerManager
            layers={layers}
            onToggleLayer={handleToggleLayer}
            onSetLayerOpacity={handleSetLayerOpacity}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            explodedOffset={explodedOffset}
            onChangeExplodedOffset={setExplodedOffset}
            anaglyphMode={anaglyphMode}
            onToggleAnaglyph={() => setAnaglyphMode(!anaglyphMode)}
            showAnnotations={showAnnotations}
            onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
          />
        </section>

        {/* SECTION B: COMPLETE SPRAY CAN RACK & COLORWAY PRESETS */}
        <section id="paleta-completa" className="scroll-mt-24">
          <UrbanColorRack
            palette={palette}
            onChangePalette={setPalette}
            activeColorwayId={activeColorwayId}
            onSelectColorway={handleSelectColorway}
          />
        </section>

        {/* SECTION C: ADVANCED PRO SPRAY SIMULATOR */}
        {viewMode !== 'spray-sim' && (
          <section id="simulador" className="scroll-mt-24">
            <SpraySimulator customWord={customWord} />
          </section>
        )}

        {/* SECTION D: STEP-BY-STEP MASTERCLASS */}
        <section id="passo-a-passo" className="flex flex-col gap-4 scroll-mt-24">
          <StepByStepGuide
            steps={currentSteps}
            currentStepIndex={activeStepIndex}
            onSelectStep={handleSelectStep}
            isPlaying={isPlayingSteps}
            onTogglePlay={() => setIsPlayingSteps(!isPlayingSteps)}
            theme={theme}
            onChangeTheme={handleThemeChange}
          />
        </section>

        {/* SECTION E: ADVANCED 3D SPRAY SHADING & DEPTH TECHNIQUES */}
        <section id="sombreamento-tecnicas" className="p-6 rounded-2xl bg-[#0d121c] border border-slate-800 shadow-2xl flex flex-col gap-6 scroll-mt-24">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono uppercase tracking-wider mb-1">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Dicas de Mestre: Sombreamento & Profundidade com Spray 3D</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display">
              Física do Spray: Como Criar Volume Tridimensional Real
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Técnicas de ângulo de incidência, máscara de mão, cortes com papelão e uso de degradês para simular relevo no muro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Technique 1 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2.5">
              <span className="font-bold text-emerald-400 text-sm font-display flex items-center gap-1.5">
                <Trees className="w-4 h-4" />
                <span>1. Sombreamento de Folhas 3D</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                Para que as folhas pareçam sair da parede, use o <strong>Azul Noite</strong> suave como sombra projetada (Drop Shadow) a 1cm da borda inferior da folha sobre as letras. O azul reflete a luz do céu e cria sombra muito mais rica que o preto puro.
              </p>
              <div className="mt-auto p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-400 border border-slate-800/80">
                Cap: Soft Cap · Lata a 15cm a 45°
              </div>
            </div>

            {/* Technique 2 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2.5">
              <span className="font-bold text-blue-400 text-sm font-display flex items-center gap-1.5">
                <Shapes className="w-4 h-4" />
                <span>2. Esferas Azuis em 3D</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                Técnica do crescente lunar: preencha com Azul Cobalto, aplique meia-lua escura na base direita e deixe um milímetro de <strong>luz refletida (bounce light)</strong> verde na borda oposta. Esse reflexo é o segredo do volume esférico.
              </p>
              <div className="mt-auto p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-400 border border-slate-800/80">
                Cap: Skinny Pro · Stencil de papelão
              </div>
            </div>

            {/* Technique 3 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2.5">
              <span className="font-bold text-red-400 text-sm font-display flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4" />
                <span>3. Prismas Facetados em Vermelho</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                Em prismas 3D, cada face deve ter uma leitura tonal distinta: Face 1 (Luz direta: Vermelho vivo + Laranja), Face 2 (Média: Vermelho carmim), Face 3 (Sombra interna: Vermelho escuro/vinho com azul). Use a máscara de papelão para arestas retas.
              </p>
              <div className="mt-auto p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-400 border border-slate-800/80">
                Cap: German Skinny · Máscara reta
              </div>
            </div>

            {/* Technique 4 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col gap-2.5">
              <span className="font-bold text-emerald-400 text-sm font-display flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>4. Linhas de Velocidade</span>
              </span>
              <p className="text-slate-300 leading-relaxed">
                As linhas de velocidade devem ser feitas com um único golpe rápido do ombro. Faça feixes paralelos que cruzam por trás dos triângulos vermelhos e passam na frente das esferas azuis para criar planos espaciais intercalados.
              </p>
              <div className="mt-auto p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-400 border border-slate-800/80">
                Cap: Astro Fat ou Skinny Universal
              </div>
            </div>
          </div>
        </section>

        {/* SECTION F: CHROMATIC PHYSICS & COLOR THEORY */}
        <section id="teoria-das-cores" className="flex flex-col gap-4 scroll-mt-24">
          <ColorPaletteTheory />
        </section>
      </main>

      {/* 4. FOOTER (Urban Hall of Fame Aesthetic) */}
      <footer className="mt-auto border-t border-slate-800 bg-[#070a0f] py-6 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-graffiti text-white text-sm">GRAFFITI LABS TISOUT</span>
            <span>·</span>
            <span>Estúdio Urbano de Spray & Cultura de Rua</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>22 Cores de Spray</span>
            <span>·</span>
            <span>Máscara de Papelão</span>
            <span>·</span>
            <span>Perspectiva 3D</span>
          </div>
        </div>
      </footer>

      {/* 5. BLUEPRINT EXPORT MODAL */}
      <BlueprintExporter
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        vanishingPoint={vanishingPoint}
        customWord={customWord}
        theme={theme}
      />
    </div>
  );
}
