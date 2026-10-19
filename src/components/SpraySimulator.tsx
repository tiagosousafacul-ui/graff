import React, { useRef, useState, useEffect, useCallback } from 'react';
import { SPRAY_CANS, SPRAY_CAPS, FULL_SPRAY_PALETTE } from '../data/graffitiGuideData';
import { SprayCan, SprayCap } from '../types/graffiti';
import {
  Trash2,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCcw,
  Play,
  Activity,
  Sliders,
  Maximize2,
  Minimize2,
  Download,
  RotateCcw,
  RotateCw,
  Shield,
  Layers,
  Droplet,
  Compass,
  Palette,
  Pipette,
  Crosshair,
  Wind,
  Sun,
  Flame,
  Zap,
  Gauge,
  SlidersHorizontal,
  CircleDot
} from 'lucide-react';

interface SpraySimulatorProps {
  customWord?: string;
}

type WallSurfaceType = 'concrete' | 'brick' | 'shutter' | 'dark';

interface ActiveDrip {
  id: number;
  startX: number;
  startY: number;
  prevX: number;
  prevY: number;
  currentX: number;
  currentY: number;
  maxDistance: number;
  speed: number;
  color: string;
  width: number;
  swayFactor: number;
  wobbleFreq: number;
  progress: number;
}

export const SpraySimulator: React.FC<SpraySimulatorProps> = ({ customWord = '3D' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spray and Cap State
  const [selectedCan, setSelectedCan] = useState<SprayCan>(SPRAY_CANS[0]);
  const [selectedCap, setSelectedCap] = useState<SprayCap>(SPRAY_CAPS[0]);
  const [paintOpacity, setPaintOpacity] = useState(1.0);
  const [customHex, setCustomHex] = useState('#ef4444');
  const [recentColors, setRecentColors] = useState<string[]>([
    '#ef4444', '#1d4ed8', '#22c55e', '#ffffff', '#090d16', '#f59e0b', '#06b6d4', '#ec4899'
  ]);
  const [colorFilter, setColorFilter] = useState<'all' | 'warm' | 'cool' | 'neon' | 'special'>('all');

  // --- NEW: TAMANHO DE SPRAY, QUANTIDADE DE TINTA (FLOW RATE) & DRIPS ---
  const [spraySize, setSpraySize] = useState<number>(26); // 6px to 90px
  const [paintFlowRate, setPaintFlowRate] = useState<number>(100); // 15% to 200%
  const [dripMode, setDripMode] = useState<boolean>(true); // Drip toggle
  const [dripSensitivity, setDripSensitivity] = useState<'alta' | 'media' | 'baixa' | 'off'>('alta');
  const [dripLengthMax, setDripLengthMax] = useState<number>(130); // 40px to 250px
  const [dripAccumulation, setDripAccumulation] = useState<number>(0); // 0 to 1 for visual UI meter

  // Physics & Mechanics
  const [sprayDistance, setSprayDistance] = useState(14); // 5cm to 45cm
  const [valvePressure, setValvePressure] = useState(85); // 20% to 100%
  const [chiselAngle, setChiselAngle] = useState(45); // For calligraphy fan cap (0, 45, 90, 135)
  const [isInvertedCan, setIsInvertedCan] = useState(false); // Inverted purge / dust mode

  // Sound Engine
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.85);
  const [isSpraying, setIsSpraying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isTestPlaying, setIsTestPlaying] = useState(false);

  // Tools & Overlays
  const [wallSurface, setWallSurface] = useState<WallSurfaceType>('concrete');
  const [stencilMode, setStencilMode] = useState<'letters' | 'leaves' | 'geo' | 'icons' | 'none'>('letters');
  const [showPerspectiveLaser, setShowPerspectiveLaser] = useState(false);
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Cardboard Shield (Máscara de corte reto)
  const [shieldActive, setShieldActive] = useState(false);
  const [shieldAngle, setShieldAngle] = useState(0);
  const [shieldPos, setShieldPos] = useState({ x: 380, y: 240 });
  const [isDraggingShield, setIsDraggingShield] = useState(false);

  // Undo / Redo History Stacks
  const historyRef = useRef<ImageData[]>([]);
  const redoRef = useRef<ImageData[]>([]);
  const [historyCount, setHistoryCount] = useState(0);
  const [redoCount, setRedoCount] = useState(0);

  // Continuous loop & Drip Physics Refs
  const isSprayingRef = useRef(false);
  const currentPointerRef = useRef<{ x: number; y: number } | null>(null);
  const dwellRef = useRef<{
    x: number;
    y: number;
    startTime: number;
    dripsSpawned: number;
    lastDripTime: number;
  }>({
    x: 0,
    y: 0,
    startTime: 0,
    dripsSpawned: 0,
    lastDripTime: 0
  });
  const activeDripsRef = useRef<ActiveDrip[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Dynamic values in refs for the animation loop
  const selectedCanRef = useRef(selectedCan);
  selectedCanRef.current = selectedCan;
  const selectedCapRef = useRef(selectedCap);
  selectedCapRef.current = selectedCap;
  const spraySizeRef = useRef(spraySize);
  spraySizeRef.current = spraySize;
  const paintFlowRateRef = useRef(paintFlowRate);
  paintFlowRateRef.current = paintFlowRate;
  const paintOpacityRef = useRef(paintOpacity);
  paintOpacityRef.current = paintOpacity;
  const sprayDistanceRef = useRef(sprayDistance);
  sprayDistanceRef.current = sprayDistance;
  const valvePressureRef = useRef(valvePressure);
  valvePressureRef.current = valvePressure;
  const chiselAngleRef = useRef(chiselAngle);
  chiselAngleRef.current = chiselAngle;
  const isInvertedCanRef = useRef(isInvertedCan);
  isInvertedCanRef.current = isInvertedCan;
  const dripModeRef = useRef(dripMode);
  dripModeRef.current = dripMode;
  const dripSensitivityRef = useRef(dripSensitivity);
  dripSensitivityRef.current = dripSensitivity;
  const dripLengthMaxRef = useRef(dripLengthMax);
  dripLengthMaxRef.current = dripLengthMax;
  const shieldActiveRef = useRef(shieldActive);
  shieldActiveRef.current = shieldActive;
  const shieldAngleRef = useRef(shieldAngle);
  shieldAngleRef.current = shieldAngle;
  const shieldPosRef = useRef(shieldPos);
  shieldPosRef.current = shieldPos;

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);

  // Save current canvas frame into history
  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    try {
      if (historyRef.current.length >= 15) {
        historyRef.current.shift();
      }
      historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      redoRef.current = [];
      setHistoryCount(historyRef.current.length);
      setRedoCount(0);
    } catch {
      // ignore
    }
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      redoRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      const previousState = historyRef.current.pop();
      if (previousState) {
        ctx.putImageData(previousState, 0, 0);
      }
      setHistoryCount(historyRef.current.length);
      setRedoCount(redoRef.current.length);
    } catch {
      // ignore
    }
  };

  const handleRedo = () => {
    const canvas = canvasRef.current;
    if (!canvas || redoRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
      const nextState = redoRef.current.pop();
      if (nextState) {
        ctx.putImageData(nextState, 0, 0);
      }
      setHistoryCount(historyRef.current.length);
      setRedoCount(redoRef.current.length);
    } catch {
      // ignore
    }
  };

  // Ensure AudioContext is ready and active on user interaction
  const ensureAudioContext = async () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      try {
        await audioCtxRef.current.resume();
      } catch {
        // user interaction needed
      }
    }
    return audioCtxRef.current;
  };

  // Play marble rattle sound
  const playShakeSound = async () => {
    if (!soundEnabled) return;
    const ctx = await ensureAudioContext();
    if (!ctx) return;

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 650);

    for (let i = 0; i < 4; i++) {
      setTimeout(() => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(680 + Math.random() * 320, ctx.currentTime);
        gain.gain.setValueAtTime(0.24 * volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.045);
      }, i * 95);
    }
  };

  // Wet paint drip sound effect when a drip breaks loose
  const playDripSound = async () => {
    if (!soundEnabled) return;
    const ctx = await ensureAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08 * volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.085);
    } catch {
      // ignore
    }
  };

  // Cap audio resonance
  const getDynamicCapFilterSettings = (capType: string) => {
    let baseFreq = 2800;
    let baseQ = 1.6;
    let baseGain = 1.0;

    switch (capType) {
      case 'fat':
        baseFreq = 1850;
        baseQ = 1.1;
        baseGain = 1.35;
        break;
      case 'skinny':
        baseFreq = 4100;
        baseQ = 2.6;
        baseGain = 0.95;
        break;
      case 'soft':
        baseFreq = 2400;
        baseQ = 1.4;
        baseGain = 0.9;
        break;
      case 'needle':
        baseFreq = 4900;
        baseQ = 3.0;
        baseGain = 1.2;
        break;
      case 'calligraphy':
        baseFreq = 3300;
        baseQ = 2.0;
        baseGain = 1.1;
        break;
      case 'splatter':
        baseFreq = 2100;
        baseQ = 0.9;
        baseGain = 1.25;
        break;
    }

    const distanceFactor = Math.max(0.65, 1.2 - sprayDistance / 55);
    const pressureFactor = (valvePressure / 100) * (paintFlowRate / 100);

    return {
      freq: baseFreq * distanceFactor * (isInvertedCan ? 1.4 : 1.0),
      q: baseQ,
      gainBoost: baseGain * pressureFactor * (isInvertedCan ? 0.6 : 1.0)
    };
  };

  // Start continuous realistic spray hiss sound
  const startSpraySound = async () => {
    if (!soundEnabled) return;
    const ctx = await ensureAudioContext();
    if (!ctx) return;

    stopSpraySound();

    // Valve puncture click
    const puffBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.025), ctx.sampleRate);
    const puffData = puffBuffer.getChannelData(0);
    for (let i = 0; i < puffData.length; i++) {
      puffData[i] = (Math.random() * 2 - 1) * (1 - i / puffData.length);
    }
    const puffSource = ctx.createBufferSource();
    puffSource.buffer = puffBuffer;
    const puffGain = ctx.createGain();
    puffGain.gain.setValueAtTime(0.12 * volume * (valvePressure / 100), ctx.currentTime);
    puffSource.connect(puffGain);
    puffGain.connect(ctx.destination);
    puffSource.start();

    // Continuous noise buffer
    const bufferDuration = 2.0;
    const bufferSize = Math.floor(ctx.sampleRate * bufferDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const outputData = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      outputData[i] = (b0 + b1 + b2 + white * 0.5362) * 0.45;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const { freq, q, gainBoost } = getDynamicCapFilterSettings(selectedCap.iconType);
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(freq, ctx.currentTime);
    bandpass.Q.setValueAtTime(q, ctx.currentTime);
    filterNodeRef.current = bandpass;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(800, ctx.currentTime);

    const gainNode = ctx.createGain();
    const targetVolume = 0.16 * volume * gainBoost;
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + 0.03);

    noiseSource.connect(highpass);
    highpass.connect(bandpass);
    bandpass.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();

    noiseSourceRef.current = noiseSource;
    gainNodeRef.current = gainNode;
  };

  const stopSpraySound = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const gain = gainNodeRef.current;
      const source = noiseSourceRef.current;

      try {
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

        setTimeout(() => {
          try {
            if (source) {
              source.stop();
              source.disconnect();
            }
          } catch {
            // ignore
          }
        }, 60);
      } catch {
        // ignore
      }
    }
    noiseSourceRef.current = null;
    gainNodeRef.current = null;
    filterNodeRef.current = null;
  };

  const handleTestBurst = async () => {
    if (isTestPlaying) return;
    setIsTestPlaying(true);
    await startSpraySound();
    setTimeout(() => {
      stopSpraySound();
      setIsTestPlaying(false);
    }, 1100);
  };

  // Cardboard shield hit-test
  const isBlockedByShield = (px: number, py: number) => {
    if (!shieldActiveRef.current) return false;
    const rad = (shieldAngleRef.current * Math.PI) / 180;
    const dx = px - shieldPosRef.current.x;
    const dy = py - shieldPosRef.current.y;
    const rx = dx * Math.cos(-rad) - dy * Math.sin(-rad);
    const ry = dx * Math.sin(-rad) + dy * Math.cos(-rad);
    return rx >= -170 && rx <= 170 && ry >= -90 && ry <= 90;
  };

  // Color selection helper
  const handleSelectColor = (can: SprayCan) => {
    setSelectedCan(can);
    setCustomHex(can.hex);
    if (!recentColors.includes(can.hex)) {
      setRecentColors([can.hex, ...recentColors.slice(0, 9)]);
    }
  };

  const handleCustomColorChange = (hex: string) => {
    setCustomHex(hex);
    setSelectedCan({
      id: `custom-${hex}`,
      name: `Custom Spray ${hex.toUpperCase()}`,
      colorName: `Cor Custom ${hex.toUpperCase()}`,
      hex: hex,
      tone: 'gold',
      roleInDesign: 'Tinta personalizada escolhida pelo usuário',
      recommendedCap: selectedCap.name,
      pressureType: 'Pressão Variável'
    });
    if (!recentColors.includes(hex)) {
      setRecentColors([hex, ...recentColors.slice(0, 9)]);
    }
  };

  // Spawn an active realistic paint drip that runs down the wall
  const spawnDrip = (startX: number, startY: number, color: string, tier: number = 1) => {
    playDripSound();
    const maxLen = (dripLengthMaxRef.current * (0.6 + Math.random() * 0.6)) * (paintFlowRateRef.current / 100);
    const baseWidth = Math.max(1.8, (spraySizeRef.current / 12) * (paintFlowRateRef.current / 90));
    const width = tier === 1 ? baseWidth : baseWidth * (0.65 + Math.random() * 0.3);

    const newDrip: ActiveDrip = {
      id: Date.now() + Math.random(),
      startX,
      startY,
      prevX: startX,
      prevY: startY,
      currentX: startX,
      currentY: startY,
      maxDistance: Math.min(320, maxLen),
      speed: (1.8 + Math.random() * 1.8) * Math.max(0.6, paintFlowRateRef.current / 85),
      color,
      width,
      swayFactor: (Math.random() - 0.5) * 7,
      wobbleFreq: 0.04 + Math.random() * 0.04,
      progress: 0
    };

    activeDripsRef.current.push(newDrip);
  };

  // Spray particle engine with Cap Geometry, Distance, Spray Size and Flow Rate
  const sprayParticles = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const capType = selectedCapRef.current.iconType;

    // Radius calculation based on user spraySize setting + cap modifier + distance
    let capMultiplier = 1.0;
    let baseDensity = 28;

    if (capType === 'fat') {
      capMultiplier = 1.5;
      baseDensity = 46;
    } else if (capType === 'skinny') {
      capMultiplier = 0.55;
      baseDensity = 24;
    } else if (capType === 'soft') {
      capMultiplier = 1.1;
      baseDensity = 32;
    } else if (capType === 'needle') {
      capMultiplier = 0.35;
      baseDensity = 18;
    } else if (capType === 'calligraphy') {
      capMultiplier = 1.0;
      baseDensity = 36;
    } else if (capType === 'splatter') {
      capMultiplier = 1.8;
      baseDensity = 30;
    }

    const distanceScale = sprayDistanceRef.current / 15;
    const radius = Math.max(4, (spraySizeRef.current * 0.9) * capMultiplier * distanceScale);

    // Quantity of paint (Flow Rate) combined with valve pressure
    const flowScale = paintFlowRateRef.current / 100;
    const pressureScale = valvePressureRef.current / 100;
    const density = Math.floor(baseDensity * pressureScale * flowScale * (1 / Math.sqrt(distanceScale)));

    ctx.fillStyle = selectedCanRef.current.hex;
    const pigmentStrength = isInvertedCanRef.current ? 0.15 : paintOpacityRef.current;

    for (let i = 0; i < density; i++) {
      let px = x;
      let py = y;

      if (capType === 'calligraphy') {
        const rad = (chiselAngleRef.current * Math.PI) / 180;
        const u = (Math.random() - 0.5) * radius * 2.2;
        const v = (Math.random() - 0.5) * (radius * 0.35);
        px = x + u * Math.cos(rad) - v * Math.sin(rad);
        py = y + u * Math.sin(rad) + v * Math.cos(rad);
      } else if (capType === 'splatter') {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 0.6) * radius * 1.4;
        px = x + Math.cos(angle) * dist;
        py = y + Math.sin(angle) * dist;
      } else {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 1.5) * radius;
        px = x + Math.cos(angle) * dist;
        py = y + Math.sin(angle) * dist;
      }

      if (isBlockedByShield(px, py)) continue;

      let particleRadius = Math.random() * 1.5 + 0.4;
      if (capType === 'splatter' && Math.random() < 0.22) {
        particleRadius = Math.random() * 3.6 + 1.2;
      }

      const distFromCenter = Math.hypot(px - x, py - y);
      const falloff = Math.max(0.08, 1 - distFromCenter / (radius * 1.2));
      ctx.globalAlpha = falloff * pressureScale * pigmentStrength * flowScale * 0.55;

      ctx.beginPath();
      ctx.arc(px, py, particleRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Continuous animation frame loop: runs spraying and animates running drips
  useEffect(() => {
    const loop = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const now = performance.now();

          // 1. If currently spraying, emit continuous particles and check dwell in place
          if (isSprayingRef.current && currentPointerRef.current) {
            const { x, y } = currentPointerRef.current;
            sprayParticles(x, y);

            // Drip on linger detection
            if (dripModeRef.current && dripSensitivityRef.current !== 'off' && !isInvertedCanRef.current) {
              const dwell = dwellRef.current;
              const distFromOrigin = Math.hypot(x - dwell.x, y - dwell.y);

              // Staying within 16px radius = holding in the same spot!
              if (distFromOrigin < 16) {
                const dwellDuration = now - dwell.startTime;

                // Threshold calculation based on sensitivity & flow rate
                let baseThreshold = 520;
                if (dripSensitivityRef.current === 'alta') baseThreshold = 280;
                else if (dripSensitivityRef.current === 'media') baseThreshold = 540;
                else if (dripSensitivityRef.current === 'baixa') baseThreshold = 950;

                const flowMod = Math.max(0.35, 1.35 - (paintFlowRateRef.current / 160));
                const dripThreshold = baseThreshold * flowMod;

                const progress = Math.min(1, dwellDuration / dripThreshold);
                setDripAccumulation(progress);

                // Heavy wet paint pooling in the center
                if (dwellDuration > 100) {
                  ctx.save();
                  ctx.fillStyle = selectedCanRef.current.hex;
                  ctx.globalAlpha = Math.min(0.85, (dwellDuration / dripThreshold) * 0.35);
                  ctx.beginPath();
                  ctx.arc(dwell.x, dwell.y, Math.min(22, 4 + dwellDuration * 0.016), 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();
                }

                // Trigger 1st main drip
                if (dwellDuration >= dripThreshold && dwell.dripsSpawned === 0) {
                  spawnDrip(dwell.x, dwell.y + 4, selectedCanRef.current.hex, 1);
                  dwell.dripsSpawned = 1;
                  dwell.lastDripTime = now;
                }
                // Trigger 2nd branching drip if held longer
                else if (dwellDuration >= dripThreshold * 1.8 && dwell.dripsSpawned === 1) {
                  const offsetX = (Math.random() - 0.5) * 14;
                  spawnDrip(dwell.x + offsetX, dwell.y + 6, selectedCanRef.current.hex, 2);
                  dwell.dripsSpawned = 2;
                  dwell.lastDripTime = now;
                }
                // Trigger 3rd tertiary drip if kept pressing
                else if (dwellDuration >= dripThreshold * 2.8 && dwell.dripsSpawned === 2) {
                  const offsetX = (Math.random() - 0.5) * 20;
                  spawnDrip(dwell.x + offsetX, dwell.y + 8, selectedCanRef.current.hex, 3);
                  dwell.dripsSpawned = 3;
                  dwell.lastDripTime = now;
                }
              } else {
                // Moved hand to another spot, reset dwell origin
                dwellRef.current = {
                  x,
                  y,
                  startTime: now,
                  dripsSpawned: 0,
                  lastDripTime: now
                };
                setDripAccumulation(0);
              }
            }
          } else {
            setDripAccumulation(0);
          }

          // 2. Advance all running drips down the wall
          if (activeDripsRef.current.length > 0) {
            const nextDrips: ActiveDrip[] = [];

            activeDripsRef.current.forEach((drip) => {
              drip.prevX = drip.currentX;
              drip.prevY = drip.currentY;

              drip.currentY += drip.speed;
              const totalY = drip.currentY - drip.startY;
              drip.currentX = drip.startX + Math.sin(totalY * drip.wobbleFreq) * drip.swayFactor;

              const distanceTraveled = drip.currentY - drip.startY;
              drip.progress = distanceTraveled / drip.maxDistance;

              // Draw drip segment
              ctx.save();
              ctx.strokeStyle = drip.color;
              const currentLineWidth = Math.max(1.2, drip.width * (1 - drip.progress * 0.45));
              ctx.lineWidth = currentLineWidth;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              ctx.globalAlpha = 0.94;

              ctx.beginPath();
              ctx.moveTo(drip.prevX, drip.prevY);
              ctx.lineTo(drip.currentX, drip.currentY);
              ctx.stroke();

              // Specular 3D wet gloss highlight line along drip
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
              ctx.lineWidth = Math.max(0.6, currentLineWidth * 0.3);
              ctx.beginPath();
              ctx.moveTo(drip.prevX - 0.6, drip.prevY);
              ctx.lineTo(drip.currentX - 0.6, drip.currentY);
              ctx.stroke();

              ctx.restore();

              if (distanceTraveled < drip.maxDistance) {
                nextDrips.push(drip);
              } else {
                // Final droplet teardrop bead at bottom tip
                ctx.save();
                ctx.fillStyle = drip.color;
                ctx.globalAlpha = 0.96;
                ctx.beginPath();
                ctx.arc(drip.currentX, drip.currentY, currentLineWidth * 1.3, 0, Math.PI * 2);
                ctx.fill();

                // Specular highlight dot
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.beginPath();
                ctx.arc(drip.currentX - 0.7, drip.currentY - 0.7, currentLineWidth * 0.4, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
              }
            });

            activeDripsRef.current = nextDrips;
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // One-click manual drip
  const triggerManualDrip = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveState();
    const cx = canvas.width / 2 + (Math.random() * 280 - 140);
    const cy = canvas.height / 2 + (Math.random() * 120 - 60);
    spawnDrip(cx, cy, selectedCan.hex, 1);
    spawnDrip(cx + 18, cy - 8, selectedCan.hex, 2);
    spawnDrip(cx - 24, cy + 12, selectedCan.hex, 3);
  };

  // Pro Technique: 3D Flare Starburst
  const triggerFlareBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveState();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2 + (Math.random() * 180 - 90);
    const cy = canvas.height / 2 + (Math.random() * 100 - 50);

    startSpraySound();
    setTimeout(stopSpraySound, 350);

    const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 75);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.2, selectedCan.hex);
    grad.addColorStop(0.7, selectedCan.hex + '33');
    grad.addColorStop(1, 'transparent');

    ctx.globalAlpha = 0.85;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 75, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy);
    ctx.lineTo(cx + 50, cy);
    ctx.moveTo(cx, cy - 50);
    ctx.lineTo(cx, cy + 50);
    ctx.stroke();

    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy - 30);
    ctx.lineTo(cx + 30, cy + 30);
    ctx.moveTo(cx + 30, cy - 30);
    ctx.lineTo(cx - 30, cy + 30);
    ctx.stroke();
  };

  // Instant Splatter Splash across wall
  const triggerInstantSplatter = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveState();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.5) * 220;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const sz = Math.random() * 3.5 + 0.8;

      ctx.fillStyle = selectedCan.hex;
      ctx.globalAlpha = Math.random() * 0.7 + 0.25;
      ctx.beginPath();
      ctx.arc(px, py, sz, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (eyedropperActive) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
        if (pixel[3] > 0) {
          const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
          handleCustomColorChange(hex);
        }
      }
      setEyedropperActive(false);
      return;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    saveState();
    setIsSpraying(true);
    isSprayingRef.current = true;
    currentPointerRef.current = { x, y };
    dwellRef.current = {
      x,
      y,
      startTime: performance.now(),
      dripsSpawned: 0,
      lastDripTime: performance.now()
    };

    startSpraySound();
    sprayParticles(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isSprayingRef.current || eyedropperActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = canvasRef.current ? canvasRef.current.width / rect.width : 1;
    const scaleY = canvasRef.current ? canvasRef.current.height / rect.height : 1;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    currentPointerRef.current = { x, y };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsSpraying(false);
    isSprayingRef.current = false;
    currentPointerRef.current = null;
    setDripAccumulation(0);
    stopSpraySound();
  };

  const clearCanvas = () => {
    saveState();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    activeDripsRef.current = [];
  };

  const handleExportPainting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `graffiti-mural-${customWord.toLowerCase()}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 1100;
    canvas.height = 620;
  }, []);

  const displayedCans = colorFilter === 'all'
    ? FULL_SPRAY_PALETTE
    : FULL_SPRAY_PALETTE.filter((can) => {
        if (colorFilter === 'warm') return ['red', 'orange', 'yellow', 'pink'].includes(can.tone);
        if (colorFilter === 'cool') return ['blue', 'cyan'].includes(can.tone);
        if (colorFilter === 'neon') return ['green', 'yellow', 'pink', 'cyan'].includes(can.tone);
        if (colorFilter === 'special') return ['purple', 'gold', 'grey', 'black', 'white'].includes(can.tone);
        return true;
      });

  const getWallBackground = () => {
    switch (wallSurface) {
      case 'brick':
        return `url('/src/assets/images/urban_brick_wall_texture_1792428860458.jpg')`;
      case 'shutter':
        return `url('/src/assets/images/urban_metal_shutter_1792428872682.jpg')`;
      case 'dark':
        return 'none';
      case 'concrete':
      default:
        return `url('/src/assets/images/graffiti_urban_wall_texture_1792340786407.jpg')`;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`w-full bg-[#0a0d14] rounded-3xl border-2 border-slate-800 p-6 shadow-2xl flex flex-col gap-6 relative overflow-hidden transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 p-6 bg-black rounded-none overflow-y-auto' : ''
      }`}
    >
      {/* Urban Hazard Top Accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-hazard-stripes opacity-70 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="font-tag text-sm tracking-normal">Oficina Pro do Grafiteiro</span>
            <span className="text-slate-500">/</span>
            <span className="text-emerald-400 font-bold">Simulador 3D com Áudio & Escorrido Real</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display flex items-center gap-2">
            <span>Mural Urbano: Estúdio Completo de Spray</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              Física de Gotas & Hiss
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Ajuste o tamanho do spray, vazão de tinta e segure o bico parado em um ponto para criar escorridos (drips) autênticos de tinta fresca descendo pelo muro!
          </p>
        </div>

        {/* Master Toolset Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            onClick={handleUndo}
            disabled={historyCount === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              historyCount > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
            }`}
            title="Desfazer (Ctrl+Z)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Desfazer</span>
          </button>

          <button
            onClick={handleRedo}
            disabled={redoCount === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              redoCount > 0
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
                : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
            }`}
            title="Refazer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refazer</span>
          </button>

          <button
            onClick={() => setEyedropperActive(!eyedropperActive)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              eyedropperActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md font-bold animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Capturar cor do muro (Pipeta)"
          >
            <Pipette className="w-3.5 h-3.5" />
            <span>{eyedropperActive ? 'Clique no Muro...' : 'Pipeta'}</span>
          </button>

          <button
            onClick={handleTestBurst}
            disabled={!soundEnabled || isTestPlaying}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isTestPlaying
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md animate-pulse font-bold'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-emerald-400'
            }`}
            title="Ouvir amostra do som de spray para o bico ativo"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isTestPlaying ? 'Hissing...' : 'Testar Som'}</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-900 border-slate-700 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}
            title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Áudio de Spray'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={playShakeSound}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer ${
              isShaking ? 'animate-bounce text-amber-400 border-amber-400' : ''
            }`}
            title="Chacoalhar lata com a bolinha metálica interna"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${isShaking ? 'animate-spin' : ''}`} />
            <span>Chacoalhar</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title={isFullscreen ? 'Sair de Tela Cheia' : 'Tela Cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExportPainting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
            title="Salvar pintura em PNG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Salvar Arte</span>
          </button>

          <button
            onClick={clearCanvas}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/60 text-xs font-semibold text-rose-300 transition-colors cursor-pointer"
            title="Limpar Parede"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* --- NEW CONTROLS: TAMANHO DO SPRAY, VAZÃO DE TINTA & DRIPS ESPECÍFICOS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-slate-950 via-[#0d131f] to-slate-950 p-4 rounded-2xl border-2 border-amber-500/30 shadow-lg">
        {/* 1. Tamanho do Spray (Spray Size) */}
        <div className="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <CircleDot className="w-4 h-4 text-amber-400" />
              <span>Tamanho do Spray:</span>
            </span>
            <span className="font-mono text-amber-400 font-bold text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {spraySize}px
            </span>
          </div>

          {/* Quick Size Presets */}
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: 'Fino', size: 10 },
              { label: 'Médio', size: 26 },
              { label: 'Largo', size: 48 },
              { label: 'Jumbo', size: 80 }
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setSpraySize(preset.size)}
                className={`py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                  spraySize === preset.size
                    ? 'bg-amber-400 text-black border-amber-300 font-bold shadow'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Continuous Size Slider */}
          <input
            type="range"
            min="6"
            max="90"
            value={spraySize}
            onChange={(e) => setSpraySize(parseInt(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 flex justify-between">
            <span>6px (Detalhe Cirúrgico)</span>
            <span>90px (Mega Bombing)</span>
          </span>
        </div>

        {/* 2. Quantidade que sai de tinta (Paint Flow Rate / Vazão) */}
        <div className="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Quantidade de Tinta (Vazão):</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              {paintFlowRate}%
            </span>
          </div>

          {/* Flow Rate Presets */}
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: 'Névoa', rate: 30 },
              { label: 'Normal', rate: 100 },
              { label: 'Alta', rate: 150 },
              { label: 'Pancada', rate: 200 }
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setPaintFlowRate(preset.rate)}
                className={`py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                  paintFlowRate === preset.rate
                    ? 'bg-emerald-400 text-black border-emerald-300 font-bold shadow'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Continuous Flow Slider */}
          <input
            type="range"
            min="15"
            max="200"
            step="5"
            value={paintFlowRate}
            onChange={(e) => setPaintFlowRate(parseInt(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 flex justify-between">
            <span>15% (Econômico / Sem escorrer)</span>
            <span>200% (Tinta Pesada / Escorre Rápido)</span>
          </span>
        </div>

        {/* 3. Efeito de Gota (Drips Realistas ao Segurar Parado) */}
        <div className="flex flex-col gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <span>Efeito de Gota (Drips):</span>
            </span>
            <button
              onClick={() => setDripMode(!dripMode)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                dripMode
                  ? 'bg-cyan-500 text-black border-cyan-300'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              {dripMode ? 'ATIVO' : 'DESLIGADO'}
            </button>
          </div>

          {/* Drip Sensitivity Buttons */}
          <div className="grid grid-cols-3 gap-1">
            {(['alta', 'media', 'baixa'] as const).map((sens) => (
              <button
                key={sens}
                disabled={!dripMode}
                onClick={() => setDripSensitivity(sens)}
                className={`py-1 rounded text-[11px] font-semibold border transition-all cursor-pointer ${
                  dripMode && dripSensitivity === sens
                    ? 'bg-cyan-400 text-black border-cyan-300 font-bold shadow'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {sens === 'alta' ? 'Sens. Alta' : sens === 'media' ? 'Sens. Média' : 'Sens. Baixa'}
              </button>
            ))}
          </div>

          {/* Drip instructions info badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span className="text-cyan-300 font-semibold">Segure no mesmo ponto:</span>
            <span className="text-[10px] text-slate-400 font-mono">Escorre após {dripSensitivity === 'alta' ? '0.3s' : dripSensitivity === 'media' ? '0.6s' : '1.0s'}</span>
          </div>

          {/* Accumulation meter progress */}
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-75"
              style={{ width: `${Math.round(dripAccumulation * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Surface, Street Tricks & Shield Deck */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/90 p-4 rounded-2xl border border-slate-800/90">
        {/* Surface Switcher */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Superfície do Muro:</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setWallSurface('concrete')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer truncate ${
                wallSurface === 'concrete'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Concreto Cru
            </button>
            <button
              onClick={() => setWallSurface('brick')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer truncate ${
                wallSurface === 'brick'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Tijolo Antigo
            </button>
            <button
              onClick={() => setWallSurface('shutter')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer truncate ${
                wallSurface === 'shutter'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Portão de Aço
            </button>
            <button
              onClick={() => setWallSurface('dark')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer truncate ${
                wallSurface === 'dark'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              Asfalto Noite
            </button>
          </div>
        </div>

        {/* Quick Pro Street Effects */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Golpes Rápidos de Spray:</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={triggerManualDrip}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-semibold cursor-pointer"
              title="Escorrer gotas autênticas de tinta"
            >
              <Droplet className="w-3 h-3 text-cyan-400" />
              <span>Gotas (Manual)</span>
            </button>
            <button
              onClick={triggerFlareBurst}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 text-xs font-semibold cursor-pointer"
              title="Disparar flare brilhante estelar"
            >
              <Sun className="w-3 h-3 text-emerald-400" />
              <span>Burst Flare 3D</span>
            </button>
            <button
              onClick={triggerInstantSplatter}
              className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs font-semibold cursor-pointer"
              title="Explosão de respingos de asfalto"
            >
              <Wind className="w-3 h-3 text-amber-400" />
              <span>Splash / Respingo</span>
            </button>
            <button
              onClick={() => setIsInvertedCan(!isInvertedCan)}
              className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isInvertedCan
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Lata invertida: pulveriza apenas gás com pouca tinta (efeito névoa)"
            >
              <span>{isInvertedCan ? 'Lata Invertida ATIVA' : 'Lata Invertida'}</span>
            </button>
          </div>
        </div>

        {/* Cardboard Shield Straight-Edge Mask */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Máscara de Papelão:</span>
            </span>
            <button
              onClick={() => setShieldActive(!shieldActive)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-colors ${
                shieldActive
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {shieldActive ? 'Ligada' : 'Desligada'}
            </button>
          </div>
          {shieldActive ? (
            <div className="flex items-center gap-1 pt-0.5">
              {[0, 30, 45, 60, 90].map((ang) => (
                <button
                  key={ang}
                  onClick={() => setShieldAngle(ang)}
                  className={`flex-1 py-1 rounded text-[10px] font-mono border transition-colors cursor-pointer text-center ${
                    shieldAngle === ang
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {ang}°
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Coloque a lâmina de papelão na parede para pintar arestas 3D retas e cortes laser perfeitos.
            </p>
          )}
        </div>

        {/* Guides & Stencils */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Molde / Stencil:</span>
            </span>
            <button
              onClick={() => setShowPerspectiveLaser(!showPerspectiveLaser)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border cursor-pointer transition-colors ${
                showPerspectiveLaser
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title="Projetar linhas guia de fuga 3D na parede"
            >
              Guia Laser 3D
            </button>
          </div>
          <div className="grid grid-cols-5 gap-1">
            <button
              onClick={() => setStencilMode('letters')}
              className={`py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer truncate text-center ${
                stencilMode === 'letters' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Tag
            </button>
            <button
              onClick={() => setStencilMode('leaves')}
              className={`py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer truncate text-center ${
                stencilMode === 'leaves' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Folhas
            </button>
            <button
              onClick={() => setStencilMode('geo')}
              className={`py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer truncate text-center ${
                stencilMode === 'geo' ? 'bg-cyan-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Prismas
            </button>
            <button
              onClick={() => setStencilMode('icons')}
              className={`py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer truncate text-center ${
                stencilMode === 'icons' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              Ícones
            </button>
            <button
              onClick={() => setStencilMode('none')}
              className={`py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer truncate text-center ${
                stencilMode === 'none' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-500'
              }`}
            >
              Livre
            </button>
          </div>
        </div>
      </div>

      {/* Physics Sliders: Distance, Pressure & Opacity */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Distância da Parede:</span>
            </span>
            <span className="font-mono text-cyan-400 font-bold">{sprayDistance} cm</span>
          </div>
          <input
            type="range"
            min="5"
            max="45"
            value={sprayDistance}
            onChange={(e) => setSprayDistance(parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 flex justify-between">
            <span>5cm (Corte Fino)</span>
            <span>20cm (Fill Normal)</span>
            <span>45cm (Névoa)</span>
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pressão da Válvula:</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">{valvePressure}%</span>
          </div>
          <input
            type="range"
            min="25"
            max="100"
            step="5"
            value={valvePressure}
            onChange={(e) => setValvePressure(parseInt(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 flex justify-between">
            <span>25% (Cirúrgica)</span>
            <span>60% (Média)</span>
            <span>100% (Alta Pressão)</span>
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-amber-400" />
              <span>Opacidade / Cobertura:</span>
            </span>
            <span className="font-mono text-amber-400 font-bold">{Math.round(paintOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.15"
            max="1.0"
            step="0.05"
            value={paintOpacity}
            onChange={(e) => setPaintOpacity(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <span className="text-[10px] text-slate-500 flex justify-between">
            <span>15% (Glaze / Veladura)</span>
            <span>50% (Transição)</span>
            <span>100% (Opaco Puro)</span>
          </span>
        </div>
      </div>

      {/* Spray Cap Selector (6 Caps with specs) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bicos de Dispersão (Caps Profissionais):</span>
          </span>
          {selectedCap.iconType === 'calligraphy' && (
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
              <span>Ângulo do Leque:</span>
              {[0, 45, 90, 135].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setChiselAngle(deg)}
                  className={`px-1.5 py-0.5 rounded text-[10px] border cursor-pointer ${
                    chiselAngle === deg
                      ? 'bg-amber-400 text-black border-amber-300 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SPRAY_CAPS.map((cap) => {
            const isSelected = selectedCap.id === cap.id;
            return (
              <button
                key={cap.id}
                onClick={() => setSelectedCap(cap)}
                className={`flex flex-col gap-1 p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-400 text-white shadow-lg ring-2 ring-emerald-500/20'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-display text-white truncate">{cap.name}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">{cap.pressure}</span>
                <span className="text-[10px] text-slate-400 line-clamp-1">{cap.bestFor}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ALL Colors Rack & Custom Color Wheel Engine */}
      <div className="flex flex-col gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Todas as Cores de Spray ({FULL_SPRAY_PALETTE.length}+ Lata Original):</span>
            </span>
            <div
              className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: selectedCan.hex }}
            />
            <span className="text-xs font-mono font-bold text-white">{selectedCan.colorName}</span>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              onClick={() => setColorFilter('all')}
              className={`px-2 py-1 rounded-lg cursor-pointer ${colorFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setColorFilter('warm')}
              className={`px-2 py-1 rounded-lg cursor-pointer ${colorFilter === 'warm' ? 'bg-red-950 text-red-300 font-bold border border-red-800' : 'text-slate-400 hover:text-white'}`}
            >
              Quentes
            </button>
            <button
              onClick={() => setColorFilter('cool')}
              className={`px-2 py-1 rounded-lg cursor-pointer ${colorFilter === 'cool' ? 'bg-blue-950 text-blue-300 font-bold border border-blue-800' : 'text-slate-400 hover:text-white'}`}
            >
              Frias
            </button>
            <button
              onClick={() => setColorFilter('neon')}
              className={`px-2 py-1 rounded-lg cursor-pointer ${colorFilter === 'neon' ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800' : 'text-slate-400 hover:text-white'}`}
            >
              Neons
            </button>
            <button
              onClick={() => setColorFilter('special')}
              className={`px-2 py-1 rounded-lg cursor-pointer ${colorFilter === 'special' ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800' : 'text-slate-400 hover:text-white'}`}
            >
              Metais/Especiais
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Criar Cor Própria:</span>
            <input
              type="color"
              value={customHex}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="w-8 h-8 rounded-lg border border-slate-700 bg-transparent cursor-pointer p-0.5"
              title="Seletor de cor livre"
            />
            <input
              type="text"
              value={customHex}
              onChange={(e) => handleCustomColorChange(e.target.value)}
              className="w-20 px-2 py-1 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white"
              placeholder="#HEX"
            />
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] text-slate-500 font-mono">Recentes:</span>
            {recentColors.map((hex, idx) => (
              <button
                key={idx}
                onClick={() => handleCustomColorChange(hex)}
                className={`w-5 h-5 rounded-full border transition-transform hover:scale-125 cursor-pointer ${
                  selectedCan.hex.toLowerCase() === hex.toLowerCase() ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-black/50'
                }`}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[170px] overflow-y-auto pr-1">
          {displayedCans.map((can) => {
            const isSelected = selectedCan.hex.toLowerCase() === can.hex.toLowerCase();
            return (
              <button
                key={can.id}
                onClick={() => handleSelectColor(can)}
                className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                }`}
                title={`${can.name} (${can.colorName})`}
              >
                <div
                  className="w-4 h-6 rounded shrink-0 border border-black/50 shadow-inner flex flex-col justify-between p-0.5"
                  style={{ backgroundColor: can.hex }}
                >
                  <div className="w-1.5 h-0.5 bg-white/60 rounded-sm mx-auto" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold text-slate-100 block truncate">
                    {can.colorName.split(' ')[0]}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block truncate">
                    {can.hex.toUpperCase()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* The Wall Canvas Painting Area */}
      <div className="relative w-full aspect-[16/9] min-h-[420px] max-h-[660px] rounded-2xl overflow-hidden border-2 border-slate-800 bg-[#070a0f] shadow-2xl select-none">
        {/* Wall Surface Background Texture */}
        <div
          className="absolute inset-0 opacity-50 bg-cover bg-center pointer-events-none transition-all duration-300"
          style={{ backgroundImage: getWallBackground() }}
        />

        {/* Perspective Laser Guideline Overlay */}
        {showPerspectiveLaser && (
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg viewBox="0 0 1100 620" className="w-full h-full">
              {[...Array(15)].map((_, i) => {
                const angle = (i / 14) * Math.PI;
                const x2 = 550 + Math.cos(angle) * 900;
                const y2 = 580 - Math.sin(angle) * 700;
                return (
                  <line
                    key={i}
                    x1="550"
                    y1="580"
                    x2={x2}
                    y2={y2}
                    stroke="#06b6d4"
                    strokeWidth="1.2"
                    strokeDasharray="5 5"
                  />
                );
              })}
              <circle cx="550" cy="580" r="6" fill="#06b6d4" />
              <text x="550" y="605" fill="#06b6d4" fontSize="12" textAnchor="middle" fontFamily="monospace">
                PONTO DE FUGA 3D (VANISHING POINT)
              </text>
            </svg>
          </div>
        )}

        {/* Stencil 1: Custom Word Stencil */}
        {stencilMode === 'letters' && (
          <div className="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
            <svg viewBox="0 0 1100 620" className="w-full h-full">
              <text
                x="550"
                y="360"
                fontSize="220"
                textAnchor="middle"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeDasharray="9 9"
                fontFamily="Impact, sans-serif"
                letterSpacing="14"
              >
                {customWord || '3D'}
              </text>
            </svg>
          </div>
        )}

        {/* Stencil 2: Stylized Tropical Leaves */}
        {stencilMode === 'leaves' && (
          <div className="absolute inset-0 pointer-events-none opacity-35 flex items-center justify-center">
            <svg viewBox="0 0 1100 620" className="w-full h-full">
              <path
                d="M 160 360 C 220 180 380 200 460 310 C 380 420 280 460 160 360 Z"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray="7 7"
              />
              <path
                d="M 940 360 C 880 180 720 200 640 310 C 720 420 820 460 940 360 Z"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray="7 7"
              />
              <path d="M 160 360 Q 300 280 460 310" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 940 360 Q 800 280 640 310" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>
        )}

        {/* Stencil 3: 3D Geometric Prisms */}
        {stencilMode === 'geo' && (
          <div className="absolute inset-0 pointer-events-none opacity-35 flex items-center justify-center">
            <svg viewBox="0 0 1100 620" className="w-full h-full">
              <polygon points="550,110 770,470 330,470" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="8 8" />
              <circle cx="220" cy="290" r="85" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="8 8" />
              <circle cx="880" cy="290" r="85" fill="none" stroke="#06b6d4" strokeWidth="3" strokeDasharray="8 8" />
            </svg>
          </div>
        )}

        {/* Stencil 4: Hip-Hop Street Icons (Crown, Star, Wildstyle Arrow) */}
        {stencilMode === 'icons' && (
          <div className="absolute inset-0 pointer-events-none opacity-35 flex items-center justify-center">
            <svg viewBox="0 0 1100 620" className="w-full h-full">
              <path
                d="M 220 240 L 250 160 L 300 210 L 350 150 L 400 210 L 450 160 L 480 240 Z"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeDasharray="7 7"
              />
              <polygon
                points="850,150 870,210 930,210 880,245 900,305 850,265 800,305 820,245 770,210 830,210"
                fill="none"
                stroke="#ec4899"
                strokeWidth="3.5"
                strokeDasharray="7 7"
              />
              <path
                d="M 460 480 L 640 480 L 610 440 L 670 500 L 610 560 L 640 520 L 460 520 Z"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeDasharray="7 7"
              />
            </svg>
          </div>
        )}

        {/* Cardboard Shield Overlay */}
        {shieldActive && (
          <div
            style={{
              left: `${shieldPos.x}px`,
              top: `${shieldPos.y}px`,
              transform: `translate(-50%, -50%) rotate(${shieldAngle}deg)`,
              width: '340px',
              height: '180px'
            }}
            onMouseDown={() => setIsDraggingShield(true)}
            className="absolute z-20 bg-amber-950/70 border-2 border-amber-400 rounded-lg shadow-2xl cursor-move flex items-center justify-center select-none backdrop-blur-xs"
          >
            <div className="flex flex-col items-center pointer-events-none text-amber-200 text-xs font-mono">
              <Shield className="w-6 h-6 mb-1 text-amber-400" />
              <span className="font-bold">MÁSCARA DE PAPELÃO</span>
              <span className="text-[10px] text-amber-300">Arraste para posicionar aresta reta</span>
            </div>
          </div>
        )}

        {/* The Painting HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={(e) => {
            if (isDraggingShield) {
              const rect = e.currentTarget.getBoundingClientRect();
              setShieldPos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
              });
            } else {
              handlePointerMove(e);
            }
          }}
          onPointerUp={(e) => {
            if (isDraggingShield) setIsDraggingShield(false);
            else handlePointerUp(e);
          }}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`relative w-full h-full touch-none ${
            eyedropperActive ? 'cursor-pointer' : 'cursor-crosshair'
          }`}
        />

        {/* Visual Pulse for Paint Accumulation & Drip Trigger */}
        {isSpraying && dripMode && dripAccumulation > 0.15 && currentPointerRef.current && (
          <div
            style={{
              left: `${currentPointerRef.current.x * (canvasRef.current ? canvasRef.current.clientWidth / 1100 : 1)}px`,
              top: `${currentPointerRef.current.y * (canvasRef.current ? canvasRef.current.clientHeight / 620 : 1)}px`
            }}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <div
              style={{
                width: `${spraySize * 1.6 * (1 + dripAccumulation * 0.5)}px`,
                height: `${spraySize * 1.6 * (1 + dripAccumulation * 0.5)}px`,
                borderColor: selectedCan.hex
              }}
              className="rounded-full border-2 border-dashed animate-ping opacity-60"
            />
          </div>
        )}

        {/* Active Spraying Sound Visualizer Overlay */}
        {(isSpraying || isTestPlaying) && soundEnabled && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/50 backdrop-blur-md shadow-lg pointer-events-none animate-pulse">
            <Activity className="w-4 h-4 text-emerald-400" />
            <div className="flex items-center gap-1">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
            <span className="text-xs font-mono font-bold text-emerald-300">
              Pshhhhh! ({selectedCap.name} · {spraySize}px · {paintFlowRate}%)
            </span>
          </div>
        )}

        {/* Live Canvas Status Badge */}
        <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 pointer-events-none font-mono flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedCan.hex }} />
            <span>{selectedCan.colorName.split(' ')[0]}</span>
          </span>
          <span>·</span>
          <span>Tamanho: {spraySize}px</span>
          <span>·</span>
          <span>Vazão: {paintFlowRate}%</span>
          <span>·</span>
          <span className="text-cyan-400 flex items-center gap-1">
            <Droplet className="w-3 h-3 inline" />
            <span>Drips: {dripMode ? dripSensitivity.toUpperCase() : 'OFF'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
