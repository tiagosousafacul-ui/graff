import { GraffitiStep, DesignTheme } from '../types/graffiti';
import { ChevronLeft, ChevronRight, Play, Pause, AlertTriangle, Lightbulb, Compass, Crosshair, Trees, Shapes, Type } from 'lucide-react';

interface StepByStepGuideProps {
  steps: GraffitiStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  theme: DesignTheme;
  onChangeTheme: (t: DesignTheme) => void;
}

export const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  steps,
  currentStepIndex,
  onSelectStep,
  isPlaying,
  onTogglePlay,
  theme,
  onChangeTheme
}) => {
  const currentStep = steps[currentStepIndex];

  const handlePrev = () => {
    if (currentStepIndex > 0) onSelectStep(currentStepIndex - 1);
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) onSelectStep(currentStepIndex + 1);
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col gap-6">
      {/* Design Theme Selector Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
            Trilha de Aprendizado Passo a Passo:
          </span>
          <span className="text-xs text-slate-500">
            {theme === 'nature'
              ? 'Técnicas de sombreamento de folhas 3D, paisagem solar abstrata e degradê verde botânico'
              : theme === 'geometric'
              ? 'Construção de prismas triangulares 3D, esferas azuis com volume e linhas dinâmicas'
              : 'Estruturação de letras bloco em Wildstyle 3D com ponto de fuga e degradê vertical'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => onChangeTheme('nature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              theme === 'nature'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>Natureza & Folhas</span>
          </button>

          <button
            onClick={() => onChangeTheme('geometric')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              theme === 'geometric'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shapes className="w-3.5 h-3.5" />
            <span>Abstrato Geométrico</span>
          </button>

          <button
            onClick={() => onChangeTheme('letters3d')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              theme === 'letters3d'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Letras 3D</span>
          </button>
        </div>
      </div>

      {/* Header and Step Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>{currentStep.phase}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Etapa {currentStep.id} de {steps.length}: {currentStep.title}
          </h2>
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pausar' : 'Apresentação'}</span>
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors cursor-pointer"
            aria-label="Passo anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-mono px-2 text-slate-400 tabular-nums">
            {currentStepIndex + 1}/{steps.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-200 transition-colors cursor-pointer"
            aria-label="Próximo passo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Dots Bar */}
      <div className="grid grid-cols-8 gap-2">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;
          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(idx)}
              className={`group flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl transition-all cursor-pointer border ${
                isActive
                  ? 'bg-slate-800 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                  : isPassed
                  ? 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-600 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-transform ${
                  isActive
                    ? 'bg-emerald-400 scale-125 ring-4 ring-emerald-500/20'
                    : isPassed
                    ? 'bg-slate-400'
                    : 'bg-slate-700'
                }`}
              />
              <span className="text-[11px] font-mono leading-none">
                0{step.id}
              </span>
            </button>
          );
        })}
      </div>

      {/* Technical Specifications Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 text-xs">
        <div>
          <span className="text-slate-500 block mb-1">Cor Primária</span>
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: currentStep.accentColor }}
            />
            <span className="truncate">{currentStep.colorUsed}</span>
          </div>
        </div>

        <div>
          <span className="text-slate-500 block mb-1">Cap Recomendado</span>
          <span className="font-medium text-emerald-400 truncate block">
            {currentStep.capRecommended}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block mb-1">Distância do Muro</span>
          <span className="font-mono text-slate-300 block">
            {currentStep.sprayDistance}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block mb-1">Pressão & Velocidade</span>
          <span className="font-medium text-slate-300 block">
            {currentStep.pressure}
          </span>
        </div>
      </div>

      {/* Main Instructional Content */}
      <div className="flex flex-col gap-4">
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          {currentStep.summary}
        </p>

        {/* Detailed Execution Sequence */}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Passo a Passo Prático de Execução:
          </h3>
          <div className="grid gap-2">
            {currentStep.detailedSteps.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs sm:text-sm text-slate-300"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800 text-emerald-400 font-mono text-xs shrink-0 font-bold">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tips and Critical Mistakes Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Pro Tips */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <span>Dicas de Grafiteiro Veterano</span>
            </div>
            <ul className="space-y-2 text-xs text-emerald-200/90 leading-relaxed">
              {currentStep.proTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">·</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mistakes to Avoid */}
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>O que NUNCA fazer nesta etapa</span>
            </div>
            <ul className="space-y-2 text-xs text-rose-200/90 leading-relaxed">
              {currentStep.mistakesToAvoid.map((err, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 mt-0.5">·</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
