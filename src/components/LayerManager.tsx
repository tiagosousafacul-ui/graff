import React from 'react';
import { DiagramLayer } from '../types/graffiti';
import { Layers, Eye, EyeOff, Sliders, Maximize2, Sparkles, Box, LayoutGrid, Paintbrush } from 'lucide-react';

interface LayerManagerProps {
  layers: DiagramLayer[];
  onToggleLayer: (id: string) => void;
  onSetLayerOpacity: (id: string, opacity: number) => void;
  viewMode: '2d-diagram' | '3d-webgl' | 'spray-sim';
  onChangeViewMode: (mode: '2d-diagram' | '3d-webgl' | 'spray-sim') => void;
  explodedOffset: number;
  onChangeExplodedOffset: (val: number) => void;
  anaglyphMode: boolean;
  onToggleAnaglyph: () => void;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  onToggleLayer,
  onSetLayerOpacity,
  viewMode,
  onChangeViewMode,
  explodedOffset,
  onChangeExplodedOffset,
  anaglyphMode,
  onToggleAnaglyph,
  showAnnotations,
  onToggleAnnotations
}) => {
  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-5">
      {/* View Mode Segmented Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Modo de Visualização do Grafite:
        </span>

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => onChangeViewMode('2d-diagram')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === '2d-diagram'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Diagrama Técnico 2D</span>
          </button>

          <button
            onClick={() => onChangeViewMode('3d-webgl')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === '3d-webgl'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Visualizador 3D Real</span>
          </button>

          <button
            onClick={() => onChangeViewMode('spray-sim')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'spray-sim'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Simulador Spray</span>
          </button>
        </div>
      </div>

      {/* Auxiliary Visual Toggles & Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        {/* Exploded Layers Slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Explosão de Camadas 3D</span>
            <span className="font-mono text-emerald-400">{Math.round(explodedOffset * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={explodedOffset}
            onChange={(e) => onChangeExplodedOffset(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Anaglyph 3D Toggle */}
        <div className="flex items-center justify-between sm:justify-center gap-3">
          <span className="text-xs text-slate-300">Óculos 3D (Anáglifo)</span>
          <button
            onClick={onToggleAnaglyph}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              anaglyphMode
                ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {anaglyphMode ? 'Ativo (Red/Cyan)' : 'Desativado'}
          </button>
        </div>

        {/* Annotations Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs text-slate-300">Medidas & Cotas</span>
          <button
            onClick={onToggleAnnotations}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              showAnnotations
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            {showAnnotations ? 'Exibindo Cotas' : 'Ocultas'}
          </button>
        </div>
      </div>

      {/* Individual Layer Matrix */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider">
            Camadas Estruturais do Design ({layers.filter(l => l.visible).length}/{layers.length} Ativas):
          </span>
          <span className="text-slate-500 text-[11px]">Clique no olho para isolar ou ocultar uma camada</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                layer.visible
                  ? 'bg-slate-950/80 border-slate-700/80'
                  : 'bg-slate-950/30 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: layer.color }}
                />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-200 truncate block">
                    {layer.name}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {layer.capUsed}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onToggleLayer(layer.id)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  layer.visible
                    ? 'text-emerald-400 hover:bg-slate-800'
                    : 'text-slate-600 hover:bg-slate-800 hover:text-slate-400'
                }`}
                title={layer.visible ? 'Ocultar Camada' : 'Exibir Camada'}
              >
                {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
