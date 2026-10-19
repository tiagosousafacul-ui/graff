import React, { useState, useMemo } from 'react';
import { DiagramLayer, DesignTheme, CustomPalette } from '../types/graffiti';
import { generateWordPolygons, LetterPolygon } from '../utils/graffitiLetters';
import { Crosshair, Move, Sparkles, Sliders } from 'lucide-react';

interface GraffitiDiagram2DProps {
  layers: DiagramLayer[];
  onToggleLayer: (id: string) => void;
  onSetLayerOpacity: (id: string, opacity: number) => void;
  vanishingPoint: { x: number; y: number };
  onVanishingPointChange: (vp: { x: number; y: number }) => void;
  activeStep: number;
  anaglyphMode: boolean;
  explodedOffset: number;
  showAnnotations: boolean;
  customWord: string;
  theme: DesignTheme;
  palette: CustomPalette;
}

export const GraffitiDiagram2D: React.FC<GraffitiDiagram2DProps> = ({
  layers,
  onToggleLayer,
  vanishingPoint,
  onVanishingPointChange,
  activeStep,
  anaglyphMode,
  explodedOffset,
  showAnnotations,
  customWord,
  theme,
  palette
}) => {
  const [isDraggingVP, setIsDraggingVP] = useState(false);

  // Generate dynamic polygons for user's custom letters!
  const letters: LetterPolygon[] = useMemo(() => {
    return generateWordPolygons(customWord, 1000, 160, 270);
  }, [customWord]);

  // Helper layer visibility checks
  const isLayerActive = (id: string) => {
    const layer = layers.find(l => l.id === id);
    return layer ? layer.visible : true;
  };

  const getLayerOpacity = (id: string) => {
    const layer = layers.find(l => l.id === id);
    return layer ? layer.opacity : 1;
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 600;

    const dist = Math.hypot(x - vanishingPoint.x, y - vanishingPoint.y);
    if (dist < 45) {
      setIsDraggingVP(true);
    }
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDraggingVP) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(100, Math.min(900, ((e.clientX - rect.left) / rect.width) * 1000));
    const y = Math.max(260, Math.min(580, ((e.clientY - rect.top) / rect.height) * 600));
    onVanishingPointChange({ x, y });
  };

  const handleSvgMouseUp = () => {
    setIsDraggingVP(false);
  };

  // 3D projection math
  const depthFactor = 0.32;
  const projectPoint = (x: number, y: number) => {
    const dx = vanishingPoint.x - x;
    const dy = vanishingPoint.y - y;
    return {
      x: x + dx * depthFactor,
      y: y + dy * depthFactor
    };
  };

  // Exploded Y & X offsets
  const getExplodedY = (layerIndex: number) => {
    return explodedOffset * (layerIndex - 3.5) * 20;
  };

  const getExplodedX = (layerIndex: number) => {
    return explodedOffset * (layerIndex - 3.5) * 10;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col">
      {/* Visual Canvas Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold tracking-wide text-slate-100 font-display">
            {theme === 'nature'
              ? 'Bio-Wildstyle 3D: Natureza, Sol & Folhagens Estilizadas'
              : theme === 'geometric'
              ? 'Abstrato Geométrico 3D: Prismas, Esferas & Linhas Dinâmicas'
              : 'Wildstyle Tipográfico 3D: Anatomia & Projeção Angular'}
          </span>
          <span className="text-xs text-emerald-400 font-mono hidden sm:inline">
            [{customWord.toUpperCase() || '3D'}]
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Ponto de Fuga: ({Math.round(vanishingPoint.x)}, {Math.round(vanishingPoint.y)})</span>
          </div>
          {anaglyphMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/50 text-xs text-red-300">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Óculos 3D</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full aspect-[16/9] min-h-[460px] max-h-[660px] bg-slate-950 overflow-hidden select-none cursor-crosshair">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-full"
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleSvgMouseMove}
          onMouseUp={handleSvgMouseUp}
          onMouseLeave={handleSvgMouseUp}
        >
          <defs>
            {/* Wall Backdrop */}
            <linearGradient id="wallBackdrop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a0e17" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#080c14" />
            </linearGradient>

            {/* Brick pattern */}
            <pattern id="brickGrid" width="60" height="30" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 30 60 30 Z" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
              <path d="M 30 0 L 30 30" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>

            {/* Primary Fill-In: Custom Palette Gradient */}
            <linearGradient id="fireIceFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={palette.topFill} />
              <stop offset="40%" stopColor={palette.topFill} />
              <stop offset="70%" stopColor={palette.bottomFill} />
              <stop offset="100%" stopColor={palette.bottomFill} />
            </linearGradient>

            {/* Botanical Foliage Gradient: Deep Emerald to Acid Lime */}
            <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>

            <linearGradient id="leafGradSecondary" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="70%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>

            {/* Geometric Sphere Radial Gradient */}
            <radialGradient id="sphereGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="25%" stopColor="#3b82f6" />
              <stop offset="70%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#091e42" />
            </radialGradient>

            {/* Red Triangular Prism Facets */}
            <linearGradient id="prismLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="prismShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>

            {/* 3D Top Faces Lighting */}
            <linearGradient id="topFaceLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>

            {/* 3D Bottom/Side Faces Shadow */}
            <linearGradient id="sideFaceShadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Sun sunset glow for Nature */}
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
            </radialGradient>

            {/* Green Neon Glow */}
            <filter id="neonGreenGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Power Halo Blur */}
            <filter id="powerHaloBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Drop Shadow for the 3D block */}
            <filter id="wallDropShadow" x="-20%" y="-20%" width="150%" height="150%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="16" />
              <feOffset dx="22" dy="26" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.8" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Wall background */}
          <rect width="1000" height="600" fill="url(#wallBackdrop)" />
          <rect width="1000" height="600" fill="url(#brickGrid)" />

          {/* THEME BACKGROUND: NATURE (Abstract Sunset & Waves) */}
          {theme === 'nature' && (
            <g opacity="0.85">
              {/* Sunset Sunburst */}
              <circle cx="500" cy="180" r="170" fill="url(#sunGlow)" />
              <circle cx="500" cy="180" r="70" fill="#ef4444" opacity="0.3" />

              {/* Distant mountains/waves in cobalt blue */}
              <path
                d="M 0 460 Q 250 400 500 450 T 1000 440 L 1000 600 L 0 600 Z"
                fill="#0f172a"
                opacity="0.8"
              />
              <path
                d="M 0 490 Q 220 450 480 490 T 1000 480 L 1000 600 L 0 600 Z"
                fill="#1e3a8a"
                opacity="0.3"
              />
            </g>
          )}

          {/* THEME BACKGROUND: GEOMETRIC (Isometric Grid & Speed Rays) */}
          {theme === 'geometric' && (
            <g opacity="0.6">
              {/* Dynamic Isometric diagonal rays */}
              <line x1="100" y1="100" x2="900" y2="500" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.4" />
              <line x1="200" y1="80" x2="1000" y2="480" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.4" />
              <line x1="0" y1="200" x2="800" y2="600" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.4" />
              <line x1="900" y1="100" x2="100" y2="500" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="6 6" opacity="0.3" />
            </g>
          )}

          {/* LAYER 8: POWER OUTLINE & HALO (GREEN) */}
          {isLayerActive('powerhalo') && (
            <g
              transform={`translate(${getExplodedX(7)}, ${getExplodedY(7)})`}
              opacity={getLayerOpacity('powerhalo')}
              filter="url(#powerHaloBlur)"
            >
              {letters.map((letter, idx) => (
                <polygon
                  key={`halo-${idx}`}
                  points={letter.frontPoints.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={palette.halo}
                  strokeWidth="38"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              ))}

              {/* Urban Paint Splatters */}
              <circle cx="100" cy="110" r="14" fill={palette.halo} opacity="0.7" />
              <circle cx="85" cy="135" r="7" fill={palette.powerGreen} opacity="0.8" />
              <circle cx="920" cy="150" r="15" fill={palette.halo} opacity="0.6" />
              <circle cx="945" cy="130" r="8" fill={palette.powerGreen} opacity="0.8" />
              <circle cx="900" cy="480" r="18" fill={palette.topFill} opacity="0.6" />
              <circle cx="120" cy="490" r="16" fill={palette.bottomFill} opacity="0.7" />
            </g>
          )}

          {/* LAYER 1: GRID & VANISHING POINT */}
          {isLayerActive('grid') && (
            <g
              transform={`translate(${getExplodedX(0)}, ${getExplodedY(0)})`}
              opacity={getLayerOpacity('grid')}
            >
              {/* Horizon Line */}
              <line
                x1="0"
                y1={vanishingPoint.y}
                x2="1000"
                y2={vanishingPoint.y}
                stroke="#06b6d4"
                strokeWidth="1.2"
                strokeDasharray="6 4"
                opacity="0.6"
              />
              <text x="30" y={vanishingPoint.y - 8} fill="#06b6d4" fontSize="11" fontFamily="Space Mono">
                LINHA DO HORIZONTE (1.40M)
              </text>

              {/* Perspective Rays connecting all key letter vertices to vanishing point */}
              {letters.map((letter, lIdx) =>
                letter.frontPoints.map((pt, pIdx) => (
                  <line
                    key={`ray-${lIdx}-${pIdx}`}
                    x1={pt.x}
                    y1={pt.y}
                    x2={vanishingPoint.x}
                    y2={vanishingPoint.y}
                    stroke="#06b6d4"
                    strokeWidth="0.8"
                    strokeDasharray="4 4"
                    opacity="0.35"
                  />
                ))
              )}

              {/* Vanishing Point Target Circle */}
              <g className="cursor-grab active:cursor-grabbing">
                <circle
                  cx={vanishingPoint.x}
                  cy={vanishingPoint.y}
                  r="22"
                  fill="#06b6d4"
                  fillOpacity="0.2"
                  stroke="#06b6d4"
                  strokeWidth="2"
                />
                <circle cx={vanishingPoint.x} cy={vanishingPoint.y} r="5" fill="#22d3ee" />
                <line
                  x1={vanishingPoint.x - 28}
                  y1={vanishingPoint.y}
                  x2={vanishingPoint.x + 28}
                  y2={vanishingPoint.y}
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                />
                <line
                  x1={vanishingPoint.x}
                  y1={vanishingPoint.y - 28}
                  x2={vanishingPoint.x}
                  y2={vanishingPoint.y + 28}
                  stroke="#22d3ee"
                  strokeWidth="1.5"
                />
                <text
                  x={vanishingPoint.x + 16}
                  y={vanishingPoint.y + 24}
                  fill="#22d3ee"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="Space Mono"
                >
                  P.F. (Ponto de Fuga 3D)
                </text>
              </g>
            </g>
          )}

          {/* LAYER 4: 3D EXTRUDED BLOCKS & SIDES */}
          {isLayerActive('blocks3d') && (
            <g
              transform={`translate(${getExplodedX(3)}, ${getExplodedY(3)})`}
              opacity={getLayerOpacity('blocks3d')}
              filter="url(#wallDropShadow)"
            >
              {/* Anaglyph Stereoscopic Cyan / Red Offset Shadow */}
              {anaglyphMode && (
                <g opacity="0.75" style={{ mixBlendMode: 'screen' }}>
                  <g transform="translate(-12, 0)">
                    {letters.map((letter, lIdx) =>
                      letter.frontPoints.map((pt, i) => {
                        const nextPt = letter.frontPoints[(i + 1) % letter.frontPoints.length];
                        const p1 = projectPoint(pt.x, pt.y);
                        const p2 = projectPoint(nextPt.x, nextPt.y);
                        return (
                          <polygon
                            key={`anaglyph-cyan-${lIdx}-${i}`}
                            points={`${pt.x},${pt.y} ${nextPt.x},${nextPt.y} ${p2.x},${p2.y} ${p1.x},${p1.y}`}
                            fill="#00ffff"
                            opacity="0.3"
                          />
                        );
                      })
                    )}
                  </g>
                  <g transform="translate(12, 0)">
                    {letters.map((letter, lIdx) =>
                      letter.frontPoints.map((pt, i) => {
                        const nextPt = letter.frontPoints[(i + 1) % letter.frontPoints.length];
                        const p1 = projectPoint(pt.x, pt.y);
                        const p2 = projectPoint(nextPt.x, nextPt.y);
                        return (
                          <polygon
                            key={`anaglyph-red-${lIdx}-${i}`}
                            points={`${pt.x},${pt.y} ${nextPt.x},${nextPt.y} ${p2.x},${p2.y} ${p1.x},${p1.y}`}
                            fill="#ff0044"
                            opacity="0.3"
                          />
                        );
                      })
                    )}
                  </g>
                </g>
              )}

              {/* 3D Extrusion polygons for each letter */}
              {letters.map((letter, lIdx) => (
                <g key={`block-letter-${lIdx}`}>
                  {letter.frontPoints.map((pt, i) => {
                    const nextPt = letter.frontPoints[(i + 1) % letter.frontPoints.length];
                    const p1 = projectPoint(pt.x, pt.y);
                    const p2 = projectPoint(nextPt.x, nextPt.y);

                    const isTopFacing = nextPt.x > pt.x || (pt.y > vanishingPoint.y && pt.y < 300);
                    const isBottomFacing = pt.x > nextPt.x || pt.y > 350;

                    return (
                      <polygon
                        key={`ext-${lIdx}-${i}`}
                        points={`${pt.x},${pt.y} ${nextPt.x},${nextPt.y} ${p2.x},${p2.y} ${p1.x},${p1.y}`}
                        fill={isTopFacing ? 'url(#topFaceLight)' : isBottomFacing ? '#091528' : 'url(#sideFaceShadow)'}
                        stroke="#020617"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                      />
                    );
                  })}

                  {/* Hole extrusions if present (e.g. for O, D, P, B, R, A) */}
                  {letter.holes &&
                    letter.holes.map((hole, hIdx) =>
                      hole.map((pt, i) => {
                        const nextPt = hole[(i + 1) % hole.length];
                        const p1 = projectPoint(pt.x, pt.y);
                        const p2 = projectPoint(nextPt.x, nextPt.y);
                        return (
                          <polygon
                            key={`ext-hole-${lIdx}-${hIdx}-${i}`}
                            points={`${pt.x},${pt.y} ${nextPt.x},${nextPt.y} ${p2.x},${p2.y} ${p1.x},${p1.y}`}
                            fill="#020617"
                            stroke="#0f172a"
                            strokeWidth="1"
                          />
                        );
                      })
                    )}

                  {/* Back face polygon */}
                  <polygon
                    points={letter.frontPoints.map(pt => {
                      const p = projectPoint(pt.x, pt.y);
                      return `${p.x},${p.y}`;
                    }).join(' ')}
                    fill="#0a101d"
                    stroke="#0f172a"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                </g>
              ))}

              {/* GEOMETRIC THEME: 3D Floating Triangular Prisms & Spheres Extrusions */}
              {theme === 'geometric' && (
                <g>
                  {/* Floating Red Triangular Prism 1 (Left Top) */}
                  <polygon points="120,80 230,120 160,250" fill="url(#prismLight)" stroke="#020617" strokeWidth="2" />
                  <polygon points="120,80 160,250 190,310 140,110" fill="url(#prismShadow)" stroke="#020617" strokeWidth="2" />

                  {/* Floating Red Triangular Prism 2 (Right Top) */}
                  <polygon points="860,90 750,150 820,270" fill="url(#prismLight)" stroke="#020617" strokeWidth="2" />
                  <polygon points="860,90 820,270 850,330 900,120" fill="url(#prismShadow)" stroke="#020617" strokeWidth="2" />

                  {/* Floating Cobalt Blue 3D Sphere 1 */}
                  <circle cx="160" cy="340" r="48" fill="url(#sphereGrad)" stroke="#020617" strokeWidth="3" />
                  {/* Sphere Shadow on wall */}
                  <ellipse cx="190" cy="410" rx="45" ry="14" fill="#000000" opacity="0.6" />

                  {/* Floating Cobalt Blue 3D Sphere 2 */}
                  <circle cx="840" cy="340" r="54" fill="url(#sphereGrad)" stroke="#020617" strokeWidth="3" />
                  <ellipse cx="875" cy="420" rx="52" ry="16" fill="#000000" opacity="0.6" />
                </g>
              )}
            </g>
          )}

          {/* LAYER 2: SKELETON / ESBOÇO */}
          {isLayerActive('skeleton') && (
            <g
              transform={`translate(${getExplodedX(1)}, ${getExplodedY(1)})`}
              opacity={getLayerOpacity('skeleton')}
            >
              {letters.map((letter, idx) => (
                <g key={`skel-${idx}`}>
                  <rect
                    x={letter.bbox.x}
                    y={letter.bbox.y}
                    width={letter.bbox.width}
                    height={letter.bbox.height}
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <line
                    x1={letter.bbox.x}
                    y1={letter.bbox.y + letter.bbox.height / 2}
                    x2={letter.bbox.x + letter.bbox.width}
                    y2={letter.bbox.y + letter.bbox.height / 2}
                    stroke="#f59e0b"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.6"
                  />
                </g>
              ))}
            </g>
          )}

          {/* LAYER 3: FILL-IN GRADIENT (RED & BLUE) */}
          {isLayerActive('fillin') && (
            <g
              transform={`translate(${getExplodedX(2)}, ${getExplodedY(2)})`}
              opacity={getLayerOpacity('fillin')}
            >
              {letters.map((letter, idx) => (
                <g key={`fill-${idx}`}>
                  {letter.holes ? (
                    <path
                      d={`M ${letter.frontPoints.map(p => `${p.x} ${p.y}`).join(' L ')} Z ${letter.holes
                        .map(h => `M ${h.map(p => `${p.x} ${p.y}`).join(' L ')} Z`)
                        .join(' ')}`}
                      fillRule="evenodd"
                      fill="url(#fireIceFill)"
                    />
                  ) : (
                    <polygon
                      points={letter.frontPoints.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="url(#fireIceFill)"
                    />
                  )}

                  {/* Upper red sheen overlay */}
                  <polygon
                    points={letter.frontPoints.slice(0, 4).map(p => `${p.x},${p.y}`).join(' ')}
                    fill="#ff4d4d"
                    opacity="0.35"
                  />
                </g>
              ))}
            </g>
          )}

          {/* NATURE THEME: BOTANICAL LEAVES & VINES OVERLAY */}
          {theme === 'nature' && isLayerActive('greenpower') && (
            <g
              transform={`translate(${getExplodedX(4)}, ${getExplodedY(4)})`}
              opacity={getLayerOpacity('greenpower')}
            >
              {/* Leaf Drop Shadows on Letters (Occlusion) */}
              <path
                d="M 120 160 Q 220 120 280 200 Q 220 280 120 160 Z"
                fill="#020617"
                opacity="0.6"
                transform="translate(14, 18)"
              />
              <path
                d="M 720 150 Q 820 110 880 190 Q 820 270 720 150 Z"
                fill="#020617"
                opacity="0.6"
                transform="translate(14, 18)"
              />

              {/* Stylized Monstera Tropical Leaf 1 (Left Wing) */}
              <g className="cursor-pointer">
                <path
                  d="M 80 220 C 130 110 240 120 290 190 C 240 260 180 290 80 220 Z"
                  fill="url(#leafGrad)"
                  stroke="#020617"
                  strokeWidth="5"
                />
                {/* Monstera Cutouts / Slits */}
                <path d="M 150 170 Q 200 160 210 180 Q 180 190 150 170 Z" fill="#090d16" />
                <path d="M 160 220 Q 220 210 230 230 Q 190 240 160 220 Z" fill="#090d16" />
                {/* Leaf Central Rib & Veins */}
                <path d="M 90 220 Q 190 200 280 190" fill="none" stroke="#86efac" strokeWidth="2.5" />
                <path d="M 170 205 L 210 170" fill="none" stroke="#86efac" strokeWidth="1.5" />
                <path d="M 190 200 L 220 230" fill="none" stroke="#86efac" strokeWidth="1.5" />
              </g>

              {/* Stylized Monstera Tropical Leaf 2 (Right Wing) */}
              <g className="cursor-pointer">
                <path
                  d="M 920 230 C 870 120 760 130 710 200 C 760 270 820 300 920 230 Z"
                  fill="url(#leafGrad)"
                  stroke="#020617"
                  strokeWidth="5"
                />
                <path d="M 850 180 Q 800 170 790 190 Q 820 200 850 180 Z" fill="#090d16" />
                <path d="M 840 230 Q 780 220 770 240 Q 810 250 840 230 Z" fill="#090d16" />
                <path d="M 910 230 Q 810 210 720 200" fill="none" stroke="#86efac" strokeWidth="2.5" />
              </g>

              {/* Center Tropical Palm Leaves emerging over top */}
              <path
                d="M 440 160 Q 500 80 560 160 Q 500 130 440 160 Z"
                fill="url(#leafGradSecondary)"
                stroke="#020617"
                strokeWidth="3.5"
              />
              <path
                d="M 370 180 Q 430 110 470 180 Q 420 160 370 180 Z"
                fill="url(#leafGradSecondary)"
                stroke="#020617"
                strokeWidth="3"
              />
              <path
                d="M 630 180 Q 570 110 530 180 Q 580 160 630 180 Z"
                fill="url(#leafGradSecondary)"
                stroke="#020617"
                strokeWidth="3"
              />

              {/* 3D Intertwining Vines Wrapping Around Letter Stems */}
              <path
                d="M 280 320 Q 340 370 380 310 Q 420 260 480 330 Q 540 390 600 320 Q 660 270 720 330"
                fill="none"
                stroke="#22c55e"
                strokeWidth="12"
                strokeLinecap="round"
                filter="url(#neonGreenGlow)"
              />
              <path
                d="M 280 320 Q 340 370 380 310 Q 420 260 480 330 Q 540 390 600 320 Q 660 270 720 330"
                fill="none"
                stroke="#86efac"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* GEOMETRIC THEME: DYNAMIC GREEN SPEED LINES & ISOMETRIC CUBES */}
          {theme === 'geometric' && isLayerActive('greenpower') && (
            <g
              transform={`translate(${getExplodedX(4)}, ${getExplodedY(4)})`}
              opacity={getLayerOpacity('greenpower')}
              filter="url(#neonGreenGlow)"
            >
              {/* Dynamic Velocity Speed Lines */}
              <line x1="80" y1="260" x2="280" y2="260" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" />
              <line x1="120" y1="280" x2="260" y2="280" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
              <line x1="60" y1="300" x2="200" y2="300" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" />

              <line x1="720" y1="260" x2="920" y2="260" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" />
              <line x1="740" y1="280" x2="880" y2="280" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
              <line x1="800" y1="300" x2="940" y2="300" stroke="#4ade80" strokeWidth="6" strokeLinecap="round" />

              {/* Floating Isometric Green Cubes */}
              <g transform="translate(100, 150)">
                <polygon points="0,15 25,0 50,15 25,30" fill="#4ade80" />
                <polygon points="0,15 25,30 25,60 0,45" fill="#22c55e" />
                <polygon points="25,30 50,15 50,45 25,60" fill="#15803d" />
              </g>

              <g transform="translate(860, 160)">
                <polygon points="0,12 20,0 40,12 20,24" fill="#4ade80" />
                <polygon points="0,12 20,24 20,48 0,36" fill="#22c55e" />
                <polygon points="20,24 40,12 40,36 20,48" fill="#15803d" />
              </g>

              {/* Dynamic Kinetic Arrows */}
              <polygon points="290,130 350,110 330,135 370,140 310,160 325,135" fill="#4ade80" />
              <polygon points="710,130 650,110 670,135 630,140 690,160 675,135" fill="#4ade80" />
            </g>
          )}

          {/* LETTER 3D THEME: FLOW ARROWS & CHISEL CUTS */}
          {theme === 'letters3d' && isLayerActive('greenpower') && (
            <g
              transform={`translate(${getExplodedX(4)}, ${getExplodedY(4)})`}
              opacity={getLayerOpacity('greenpower')}
              filter="url(#neonGreenGlow)"
            >
              {letters.map((letter, idx) => (
                <g key={`cut-${idx}`}>
                  <polygon
                    points={`${letter.bbox.x + 20},${letter.bbox.y + letter.bbox.height / 2 - 10} ${
                      letter.bbox.x + letter.bbox.width - 20
                    },${letter.bbox.y + letter.bbox.height / 2 + 5} ${
                      letter.bbox.x + letter.bbox.width - 30
                    },${letter.bbox.y + letter.bbox.height / 2 + 20} ${letter.bbox.x + 10},${
                      letter.bbox.y + letter.bbox.height / 2 + 5
                    }`}
                    fill="#22c55e"
                    opacity="0.9"
                  />
                  <polygon
                    points={`${letter.bbox.x + 35},${letter.bbox.y + letter.bbox.height / 2 - 4} ${
                      letter.bbox.x + letter.bbox.width - 35
                    },${letter.bbox.y + letter.bbox.height / 2 + 8} ${
                      letter.bbox.x + letter.bbox.width - 45
                    },${letter.bbox.y + letter.bbox.height / 2 + 15} ${letter.bbox.x + 25},${
                      letter.bbox.y + letter.bbox.height / 2 + 3
                    }`}
                    fill="#86efac"
                  />
                </g>
              ))}
            </g>
          )}

          {/* LAYER 6: MASTER OUTLINE (PRETO CIRÚRGICO) */}
          {isLayerActive('masteroutline') && (
            <g
              transform={`translate(${getExplodedX(5)}, ${getExplodedY(5)})`}
              opacity={getLayerOpacity('masteroutline')}
            >
              {letters.map((letter, idx) => (
                <g key={`outline-${idx}`}>
                  {letter.holes ? (
                    <path
                      d={`M ${letter.frontPoints.map(p => `${p.x} ${p.y}`).join(' L ')} Z ${letter.holes
                        .map(h => `M ${h.map(p => `${p.x} ${p.y}`).join(' L ')} Z`)
                        .join(' ')}`}
                      fillRule="evenodd"
                      fill="none"
                      stroke="#020617"
                      strokeWidth="12"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  ) : (
                    <polygon
                      points={letter.frontPoints.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke="#020617"
                      strokeWidth="12"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              ))}
            </g>
          )}

          {/* LAYER 7: HIGHLIGHTS & BRILHOS BRANCOS */}
          {isLayerActive('highlights') && (
            <g
              transform={`translate(${getExplodedX(6)}, ${getExplodedY(6)})`}
              opacity={getLayerOpacity('highlights')}
            >
              {/* Highlights on Letters */}
              {letters.map((letter, idx) => (
                <g key={`high-${idx}`}>
                  <path
                    d={`M ${letter.frontPoints[0]?.x + 12 || 0} ${letter.frontPoints[0]?.y + 12 || 0} L ${
                      letter.frontPoints[1]?.x - 12 || 0
                    } ${letter.frontPoints[1]?.y + 12 || 0}`}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <g transform={`translate(${letter.bbox.x + 18}, ${letter.bbox.y + 18})`}>
                    <line x1="-9" y1="0" x2="9" y2="0" stroke="#ffffff" strokeWidth="2.5" />
                    <line x1="0" y1="-9" x2="0" y2="9" stroke="#ffffff" strokeWidth="2.5" />
                    <circle cx="0" cy="0" r="2.8" fill="#ffffff" />
                  </g>
                </g>
              ))}

              {/* Dew Drops & Highlights for Nature Theme */}
              {theme === 'nature' && (
                <g>
                  {/* Dew Drop 1 */}
                  <ellipse cx="230" cy="180" rx="6" ry="4" fill="#ffffff" opacity="0.9" />
                  <circle cx="228" cy="178" r="2" fill="#ffffff" />
                  {/* Dew Drop 2 */}
                  <ellipse cx="780" cy="190" rx="7" ry="5" fill="#ffffff" opacity="0.9" />
                  <circle cx="778" cy="188" r="2.2" fill="#ffffff" />
                </g>
              )}

              {/* Specular Glints for Geometric Theme */}
              {theme === 'geometric' && (
                <g>
                  {/* Glint on Sphere 1 */}
                  <g transform="translate(145, 320)">
                    <line x1="-12" y1="0" x2="12" y2="0" stroke="#ffffff" strokeWidth="3" />
                    <line x1="0" y1="-12" x2="0" y2="12" stroke="#ffffff" strokeWidth="3" />
                    <circle cx="0" cy="0" r="4.5" fill="#ffffff" />
                  </g>
                  {/* Glint on Sphere 2 */}
                  <g transform="translate(825, 320)">
                    <line x1="-14" y1="0" x2="14" y2="0" stroke="#ffffff" strokeWidth="3.5" />
                    <line x1="0" y1="-14" x2="0" y2="14" stroke="#ffffff" strokeWidth="3.5" />
                    <circle cx="0" cy="0" r="5" fill="#ffffff" />
                  </g>
                  {/* Prism Corner Glints */}
                  <line x1="120" y1="80" x2="160" y2="250" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />
                  <line x1="860" y1="90" x2="820" y2="270" stroke="#ffffff" strokeWidth="2.5" opacity="0.8" />
                </g>
              )}
            </g>
          )}

          {/* TECHNICAL ANNOTATIONS OVERLAY */}
          {showAnnotations && (
            <g>
              <g transform="translate(500, 70)">
                <rect x="-170" y="-18" width="340" height="24" rx="4" fill="#0f172a" stroke="#22c55e" strokeWidth="1" />
                <text x="0" y="-2" fill="#4ade80" fontSize="10" textAnchor="middle" fontFamily="Space Mono">
                  {theme === 'nature'
                    ? 'ESTILO: BIO-WILDSTYLE COM FOLHAGEM 3D'
                    : theme === 'geometric'
                    ? 'ESTILO: ABSTRATO GEOMÉTRICO (PRISMAS & ESFERAS)'
                    : 'ESTILO: WILDSTYLE BLOCK TIPOGRÁFICO 3D'}
                </text>
              </g>

              <g transform="translate(150, 530)">
                <rect x="-10" y="-18" width="220" height="24" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="1" />
                <text x="100" y="-2" fill="#f87171" fontSize="10" textAnchor="middle" fontFamily="Space Mono">
                  DEGRADÊ: VERMELHO → AZUL
                </text>
              </g>

              <g transform="translate(680, 530)">
                <rect x="-10" y="-18" width="210" height="24" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                <text x="95" y="-2" fill="#38bdf8" fontSize="10" textAnchor="middle" fontFamily="Space Mono">
                  PONTO DE FUGA AJUSTÁVEL
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Floating Quick Controls over SVG */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 pointer-events-auto">
          <div className="flex items-center gap-3 text-xs text-slate-300">
            <span className="font-semibold text-emerald-400">Ponto de Fuga:</span>
            <span>X: {Math.round(vanishingPoint.x)}px</span>
            <span>·</span>
            <span>Y: {Math.round(vanishingPoint.y)}px</span>
            <span className="text-slate-500 hidden sm:inline">(Arraste o círculo azul para mudar o ângulo!)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onVanishingPointChange({ x: 500, y: 530 })}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Resetar P.F.
            </button>
            <button
              onClick={() => onVanishingPointChange({ x: 280, y: 530 })}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Ângulo Esquerdo
            </button>
            <button
              onClick={() => onVanishingPointChange({ x: 720, y: 530 })}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Ângulo Direito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
