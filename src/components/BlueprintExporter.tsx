import React from 'react';
import { X, Printer, Download, CheckCircle, Shield, Compass } from 'lucide-react';
import { SPRAY_CANS, SPRAY_CAPS, GRAFFITI_STEPS } from '../data/graffitiGuideData';

import { DesignTheme } from '../types/graffiti';

interface BlueprintExporterProps {
  isOpen: boolean;
  onClose: () => void;
  vanishingPoint: { x: number; y: number };
  customWord: string;
  theme: DesignTheme;
}

export const BlueprintExporter: React.FC<BlueprintExporterProps> = ({
  isOpen,
  onClose,
  vanishingPoint,
  customWord,
  theme
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Blueprint Técnico: Graffiti Labs Tisout (Guia de Campo 3D)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Blueprint Body */}
        <div className="p-6 space-y-6 print:p-0 print:space-y-4 text-slate-200">
          {/* Top Info Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">LETRAS DA PEÇA:</span>
              <span className="text-emerald-400 font-bold text-base tracking-wider">{customWord.toUpperCase() || '3D'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">TEMA:</span>
              <span className="text-white font-bold">
                {theme === 'nature' ? 'Bio-Wildstyle (Natureza & Folhas)' : theme === 'geometric' ? 'Abstrato Geométrico 3D' : 'Wildstyle Tipográfico 3D'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">ESCALA RECOMENDADA:</span>
              <span className="text-cyan-400 font-bold">3,50m Largura × 2,00m Altura</span>
            </div>
          </div>

          {/* Color Pallet & Cans Required */}
          <div>
            <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">
              1. Kit de Tintas Spray Necessário:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
              {SPRAY_CANS.map((can) => (
                <div key={can.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: can.hex }} />
                    <span className="font-bold text-white truncate">{can.colorName}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{can.name}</span>
                  <span className="text-[10px] text-emerald-400 font-mono mt-auto">{can.recommendedCap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Caps Required */}
          <div>
            <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">
              2. Kit de Bicos (Caps):
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {SPRAY_CAPS.map((cap) => (
                <div key={cap.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="font-bold text-white block">{cap.name}</span>
                  <span className="text-slate-400 text-[11px] block mt-0.5">{cap.bestFor}</span>
                  <span className="text-[10px] text-cyan-400 font-mono block mt-1">Traço: {cap.strokeWidth}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sequence of 8 Steps Checklist */}
          <div>
            <h3 className="text-xs uppercase font-bold text-emerald-400 tracking-wider mb-2">
              3. Checklist da Sequência de Pintura no Muro:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {GRAFFITI_STEPS.map((step) => (
                <div key={step.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-800 text-emerald-400 font-mono text-xs shrink-0 font-bold">
                    {step.id}
                  </span>
                  <div>
                    <span className="font-bold text-white block">{step.title}</span>
                    <span className="text-slate-400 text-[11px] block">{step.summary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Protocol Box */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs flex items-start gap-3 text-amber-200">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-semibold block mb-0.5">Segurança & Ética Urbana:</strong>
              Use máscara respiratória com filtro para vapores orgânicos (A1P2) e pinte sempre a favor do vento para não respirar solvente. Pinte em paredes autorizadas, murais comunitários ou "Hall of Fame" dedicados à arte de rua.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
