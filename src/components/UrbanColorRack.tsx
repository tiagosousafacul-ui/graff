import React, { useState } from 'react';
import { CustomPalette, ColorwayPreset, SprayCan } from '../types/graffiti';
import { FULL_SPRAY_PALETTE, COLORWAY_PRESETS } from '../data/graffitiGuideData';
import { Palette, Check, Sparkles, Pipette, Zap, Sliders, RefreshCw } from 'lucide-react';

interface UrbanColorRackProps {
  palette: CustomPalette;
  onChangePalette: (palette: CustomPalette) => void;
  activeColorwayId: string;
  onSelectColorway: (preset: ColorwayPreset) => void;
  onPlayCanClick?: () => void;
}

type PaletteZone = 'topFill' | 'bottomFill' | 'extrusion3d' | 'powerGreen' | 'halo';

export const UrbanColorRack: React.FC<UrbanColorRackProps> = ({
  palette,
  onChangePalette,
  activeColorwayId,
  onSelectColorway,
  onPlayCanClick
}) => {
  const [selectedZone, setSelectedZone] = useState<PaletteZone>('topFill');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const zoneLabels: Record<PaletteZone, { title: string; desc: string }> = {
    topFill: { title: '1. Topo das Letras', desc: 'Preenchimento superior quente / luminoso' },
    bottomFill: { title: '2. Base das Letras', desc: 'Preenchimento inferior e fusão de degradê' },
    extrusion3d: { title: '3. Bloco 3D', desc: 'Profundidade tridimensional e faces de sombra' },
    powerGreen: { title: '4. Cortes & Acentos', desc: 'Setas de fluxo, biséis e ranhuras de energia' },
    halo: { title: '5. Halo / Power Outline', desc: 'Contorno de choque externo que descola do muro' }
  };

  const handleSelectColor = (can: SprayCan) => {
    if (onPlayCanClick) onPlayCanClick();
    onChangePalette({
      ...palette,
      [selectedZone]: can.hex
    });
  };

  const filteredCans = activeFilter === 'all'
    ? FULL_SPRAY_PALETTE
    : FULL_SPRAY_PALETTE.filter(c => {
        if (activeFilter === 'warm') return ['red', 'orange', 'yellow', 'pink'].includes(c.tone);
        if (activeFilter === 'cool') return ['blue', 'cyan', 'green'].includes(c.tone);
        if (activeFilter === 'special') return ['purple', 'gold', 'grey', 'black', 'white'].includes(c.tone);
        return true;
      });

  return (
    <div className="w-full bg-[#0d121c] rounded-2xl border border-slate-800 p-6 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
      {/* Urban Stencil Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span className="font-tag text-sm tracking-normal">Prateleira de Sprays & Paleta Completa</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display flex items-center gap-2">
            <span>Cores de Rua: Personalização Total</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
              22 Sprays Originais
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Escolha uma harmonia pronta ou clique em qualquer área do grafite para carregar a cor da sua lata de spray favorita!
          </p>
        </div>

        {/* Colorway Presets Pills */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {COLORWAY_PRESETS.map((preset) => {
            const isActive = activeColorwayId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectColorway(preset)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center -space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full border border-black/40" style={{ backgroundColor: preset.palette.topFill }} />
                  <span className="w-2.5 h-2.5 rounded-full border border-black/40" style={{ backgroundColor: preset.palette.bottomFill }} />
                  <span className="w-2.5 h-2.5 rounded-full border border-black/40" style={{ backgroundColor: preset.palette.powerGreen }} />
                </div>
                <span>{preset.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Zone Selector Strip */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Pipette className="w-3.5 h-3.5 text-amber-400" />
          <span>Passo 1: Selecione Qual Zona do Grafite Deseja Colorir:</span>
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {(Object.keys(zoneLabels) as PaletteZone[]).map((zone) => {
            const isSelected = selectedZone === zone;
            const currentColor = palette[zone];
            return (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`flex flex-col gap-1.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 shadow-lg ring-2 ring-amber-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white block truncate">
                    {zoneLabels[zone].title}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full border border-white/40 shadow-sm shrink-0"
                    style={{ backgroundColor: currentColor }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {zoneLabels[zone].desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Spray Can Shelf Rack */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Passo 2: Clique em Qualquer Lata de Spray para Aplicar na Zona Selecionada ({zoneLabels[selectedZone].title}):</span>
          </span>

          {/* Color Family Filters */}
          <div className="flex items-center gap-1 self-start sm:self-auto text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${activeFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Todos (22)
            </button>
            <button
              onClick={() => setActiveFilter('warm')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${activeFilter === 'warm' ? 'bg-red-950/60 text-red-300 font-bold border border-red-800/50' : 'text-slate-400 hover:text-white'}`}
            >
              Quentes
            </button>
            <button
              onClick={() => setActiveFilter('cool')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${activeFilter === 'cool' ? 'bg-blue-950/60 text-blue-300 font-bold border border-blue-800/50' : 'text-slate-400 hover:text-white'}`}
            >
              Frios
            </button>
            <button
              onClick={() => setActiveFilter('special')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${activeFilter === 'special' ? 'bg-purple-950/60 text-purple-300 font-bold border border-purple-800/50' : 'text-slate-400 hover:text-white'}`}
            >
              Especiais
            </button>
          </div>
        </div>

        {/* The Spray Rack Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/90 shadow-inner max-h-[360px] overflow-y-auto">
          {filteredCans.map((can) => {
            const isCurrentZoneColor = palette[selectedZone].toLowerCase() === can.hex.toLowerCase();
            return (
              <button
                key={can.id}
                onClick={() => handleSelectColor(can)}
                className={`group flex flex-col items-center p-2.5 rounded-xl border text-center transition-all cursor-pointer relative ${
                  isCurrentZoneColor
                    ? 'bg-slate-800 border-amber-400 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                }`}
                title={`${can.name} - ${can.roleInDesign}`}
              >
                {/* 3D Realistic Spray Can Graphic Icon */}
                <div className="relative w-8 h-14 mb-2 flex flex-col items-center">
                  {/* Cap Nozzle */}
                  <div className="w-2.5 h-2.5 bg-slate-300 rounded-t-sm border border-black/40" />
                  {/* Valve ring */}
                  <div className="w-4 h-1 bg-slate-600 rounded-sm" />
                  {/* Can Cylinder */}
                  <div
                    className="w-8 h-11 rounded-b-md shadow-md flex flex-col justify-between p-0.5 border border-black/50 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: can.hex }}
                  >
                    {/* Metal sheen reflection highlight */}
                    <div className="w-full h-full bg-gradient-to-r from-white/30 via-transparent to-black/30 rounded-b-sm pointer-events-none" />
                  </div>

                  {isCurrentZoneColor && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="p-1 rounded-full bg-black/70 text-amber-400 shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Can Labels */}
                <span className="text-[11px] font-bold text-slate-100 truncate w-full block">
                  {can.colorName.split(' ')[0]}
                </span>
                <span className="text-[9px] font-mono text-slate-400 block truncate w-full">
                  {can.hex.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
