import React from 'react';
import { SPRAY_CANS } from '../data/graffitiGuideData';
import { Palette, Eye, Zap, Layers, Sparkles } from 'lucide-react';

export const ColorPaletteTheory: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono uppercase tracking-wider mb-1">
          <Palette className="w-3.5 h-3.5" />
          <span>Física Cromática & Óptica de Rua</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          A Tríade Vermelho + Azul + Verde: Por Que Funciona no 3D
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Você pediu Vermelho, Azul e talvez um Verde à nossa escolha. Veja como a ciência da visão e a cultura do graffiti transformam essa combinação em puro impacto tridimensional.
        </p>
      </div>

      {/* 3 Pillars of Chromatic Depth Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vermelho */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-red-500/30 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg shadow-red-500/40" />
            <h3 className="text-sm font-bold text-white">1. Vermelho Fogo (Projeção)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            O vermelho possui o maior comprimento de onda (~650nm) do espectro visível. O olho humano o refrata de forma a fazê-lo parecer <strong className="text-red-400">mais próximo e à frente</strong> do observador.
          </p>
          <div className="mt-auto text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            Posição: Topo das letras & faces iluminadas
          </div>
        </div>

        {/* Azul */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-blue-500/30 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-blue-600 shadow-lg shadow-blue-500/40" />
            <h3 className="text-sm font-bold text-white">2. Azul Cobalto (Recuo Óptico)</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Com comprimento de onda curto (~450nm), o azul é naturalmente absorvido pelo olho como <strong className="text-blue-400">fundo e sombra</strong> (efeito chromostereopsis). Cria o fosso de profundidade que ancora a letra na parede.
          </p>
          <div className="mt-auto text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            Posição: Base, faces inferiores do 3D & sombras
          </div>
        </div>

        {/* Verde */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/30 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/40" />
            <h3 className="text-sm font-bold text-white">3. O Verde Escolhido: Verde Limão</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Se misturar vermelho e azul sem cuidado, você obtém marrom escuro. O <strong className="text-emerald-400">Verde Limão Elétrico</strong> é o elemento coringa: ele atua como bisel de corte e halo externo que isola e eletrifica a peça!
          </p>
          <div className="mt-auto text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            Posição: Power Outline, setas de corte & biséis
          </div>
        </div>
      </div>

      {/* Swatches Breakdown Table */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Especificações das Latas & Pigmentos Recomendados:
        </h3>
        <div className="grid gap-2">
          {SPRAY_CANS.map((can) => (
            <div
              key={can.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-md shrink-0 shadow-sm border border-white/20"
                  style={{ backgroundColor: can.hex }}
                />
                <div>
                  <span className="font-bold text-slate-100 block sm:inline">{can.name}</span>
                  <span className="text-slate-400 sm:ml-2">({can.colorName})</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-slate-300">
                <span className="text-slate-400">Função: {can.roleInDesign}</span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-emerald-400">{can.recommendedCap}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Street Pro Tips Section */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3">
        <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-semibold block mb-0.5">
            Dica de Ouro para a Lata não Entupir no Inverno:
          </strong>
          Em dias frios, a pressão das latas cai e o spray pode espirrar bolhas. Deixe as latas no sol por 15 minutos ou chacoalhe por 2 minutos seguidos antes do primeiro traço. Guarde sempre os bicos usados imersos em solvente ou dê um jato de lata invertida para desobstruir.
        </div>
      </div>
    </div>
  );
};
