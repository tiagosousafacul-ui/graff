import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, Eye, Sparkles } from 'lucide-react';
import { DesignTheme, CustomPalette } from '../types/graffiti';

interface GraffitiCanvas3DProps {
  explodedSpread: number; // 0 to 1
  wireframe: boolean;
  lightingAngle: number; // degrees
  rotationSpeed: number; // 0 to 1
  theme: DesignTheme;
  customWord: string;
  palette: CustomPalette;
}

export const GraffitiCanvas3D: React.FC<GraffitiCanvas3DProps> = ({
  explodedSpread,
  wireframe,
  lightingAngle,
  rotationSpeed,
  theme,
  customWord,
  palette
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const layersGroupRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationTargetRef = useRef({ x: 0.15, y: -0.2 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0e17);
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(5, 10, 12);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Red Rim Light (Left)
    const redLight = new THREE.PointLight(0xef4444, 3, 25);
    redLight.position.set(-8, 4, 6);
    scene.add(redLight);

    // Blue Fill Light (Right)
    const blueLight = new THREE.PointLight(0x1d4ed8, 3.5, 25);
    blueLight.position.set(8, -4, 6);
    scene.add(blueLight);

    // Green Neon Accent Light (Center Bottom)
    const greenLight = new THREE.PointLight(0x22c55e, 2.5, 20);
    greenLight.position.set(0, -6, 4);
    scene.add(greenLight);

    // 5. Parent group for layers
    const layersGroup = new THREE.Group();
    layersGroup.rotation.x = rotationTargetRef.current.x;
    layersGroup.rotation.y = rotationTargetRef.current.y;
    scene.add(layersGroup);
    layersGroupRef.current = layersGroup;

    // Helper: Create 2D Shape for "3"
    const shape3 = new THREE.Shape();
    shape3.moveTo(-5.5, 3.5);
    shape3.lineTo(-1.5, 3.5);
    shape3.lineTo(-0.8, 2.2);
    shape3.lineTo(-2.2, 1.0);
    shape3.lineTo(-0.8, -0.2);
    shape3.lineTo(-1.5, -2.5);
    shape3.lineTo(-5.2, -2.5);
    shape3.lineTo(-4.4, -1.2);
    shape3.lineTo(-2.8, -1.2);
    shape3.lineTo(-3.8, 0.4);
    shape3.lineTo(-2.6, 1.6);
    shape3.lineTo(-4.6, 1.6);
    shape3.closePath();

    // Helper: Create 2D Shape for "D"
    const shapeD = new THREE.Shape();
    shapeD.moveTo(0.5, 3.5);
    shapeD.lineTo(4.2, 3.5);
    shapeD.lineTo(6.2, 1.8);
    shapeD.lineTo(6.2, -0.8);
    shapeD.lineTo(4.2, -2.5);
    shapeD.lineTo(0.5, -2.5);
    shapeD.closePath();

    // D inner hole
    const holeD = new THREE.Path();
    holeD.moveTo(2.2, 2.0);
    holeD.lineTo(3.8, 2.0);
    holeD.lineTo(4.8, 0.6);
    holeD.lineTo(3.8, -1.0);
    holeD.lineTo(2.2, -1.0);
    holeD.closePath();
    shapeD.holes.push(holeD);

    // Layer 0: Concrete Wall Backdrop
    const wallGeo = new THREE.PlaneGeometry(24, 16);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.9,
      metalness: 0.1
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.z = -5;
    wallMesh.receiveShadow = true;
    layersGroup.add(wallMesh);

    // Layer 1: Green Power Halo (Back layer)
    const haloGeo3 = new THREE.ExtrudeGeometry(shape3, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.6,
      bevelThickness: 0.1
    });
    const haloGeoD = new THREE.ExtrudeGeometry(shapeD, {
      depth: 0.1,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.6,
      bevelThickness: 0.1
    });
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x15803d,
      emissiveIntensity: 0.8,
      roughness: 0.3
    });
    const haloMesh3 = new THREE.Mesh(haloGeo3, haloMat);
    const haloMeshD = new THREE.Mesh(haloGeoD, haloMat);
    const haloGroup = new THREE.Group();
    haloGroup.name = 'layer_halo';
    haloGroup.add(haloMesh3, haloMeshD);
    layersGroup.add(haloGroup);

    // Layer 2: 3D Extrusion Block (Deep Cobalt Blue / Black)
    const blockExtrudeSettings = {
      depth: 2.2,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 2,
      bevelSize: 0.15,
      bevelThickness: 0.15
    };
    const blockGeo3 = new THREE.ExtrudeGeometry(shape3, blockExtrudeSettings);
    const blockGeoD = new THREE.ExtrudeGeometry(shapeD, blockExtrudeSettings);
    const blockMat = new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.4,
      metalness: 0.3
    });
    const blockMesh3 = new THREE.Mesh(blockGeo3, blockMat);
    const blockMeshD = new THREE.Mesh(blockGeoD, blockMat);
    blockMesh3.castShadow = true;
    blockMeshD.castShadow = true;
    const blockGroup = new THREE.Group();
    blockGroup.name = 'layer_block3d';
    blockGroup.add(blockMesh3, blockMeshD);
    layersGroup.add(blockGroup);

    // Layer 3: Fill-In Front Faces (Red Flame Gradient)
    const fillSettings = {
      depth: 0.3,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };
    const fillGeo3 = new THREE.ExtrudeGeometry(shape3, fillSettings);
    const fillGeoD = new THREE.ExtrudeGeometry(shapeD, fillSettings);
    const fillMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.25,
      metalness: 0.2
    });
    const fillMesh3 = new THREE.Mesh(fillGeo3, fillMat);
    const fillMeshD = new THREE.Mesh(fillGeoD, fillMat);
    const fillGroup = new THREE.Group();
    fillGroup.name = 'layer_fill';
    fillGroup.add(fillMesh3, fillMeshD);
    layersGroup.add(fillGroup);

    // Layer 4: Neon Green Cuts & Arrow
    const arrowShape = new THREE.Shape();
    arrowShape.moveTo(-3, 0.4);
    arrowShape.lineTo(0.5, 0.5);
    arrowShape.lineTo(2.5, 0.2);
    arrowShape.lineTo(1.8, -0.4);
    arrowShape.lineTo(-3, -0.2);
    arrowShape.closePath();
    const arrowGeo = new THREE.ExtrudeGeometry(arrowShape, { depth: 0.2, bevelEnabled: false });
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      emissive: 0x22c55e,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });
    const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);
    const greenGroup = new THREE.Group();
    greenGroup.name = 'layer_green_cut';
    greenGroup.add(arrowMesh);
    layersGroup.add(greenGroup);

    // Layer 5: Master Outlines (Black Bevel Outline)
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      wireframe: true
    });
    const outlineMesh3 = new THREE.Mesh(fillGeo3, outlineMat);
    const outlineMeshD = new THREE.Mesh(fillGeoD, outlineMat);
    const outlineGroup = new THREE.Group();
    outlineGroup.name = 'layer_outline';
    outlineGroup.add(outlineMesh3, outlineMeshD);
    layersGroup.add(outlineGroup);

    // Layer 6: Highlights (White Specular Spheres / Stars)
    const starGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star1 = new THREE.Mesh(starGeo, starMat);
    star1.position.set(-5.3, 3.3, 0.2);
    const star2 = new THREE.Mesh(starGeo, starMat);
    star2.position.set(0.7, 3.3, 0.2);
    const star3 = new THREE.Mesh(starGeo, starMat);
    star3.position.set(6.0, 1.8, 0.2);
    const starGroup = new THREE.Group();
    starGroup.name = 'layer_highlights';
    starGroup.add(star1, star2, star3);
    layersGroup.add(starGroup);

    // Theme Specific 3D Geometries:
    // 1. Nature Theme (Botanical Monstera Leaves & Vines)
    const natureGroup = new THREE.Group();
    natureGroup.name = 'theme_nature';
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.quadraticCurveTo(1.5, 2.5, 0, 4);
    leafShape.quadraticCurveTo(-1.5, 2.5, 0, 0);
    const leafGeo = new THREE.ExtrudeGeometry(leafShape, { depth: 0.15, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.35, metalness: 0.1 });
    const leafMesh1 = new THREE.Mesh(leafGeo, leafMat);
    leafMesh1.position.set(-6.5, -0.5, 1.2);
    leafMesh1.rotation.z = Math.PI / 4;
    const leafMesh2 = new THREE.Mesh(leafGeo, leafMat);
    leafMesh2.position.set(6.2, 0.5, 1.2);
    leafMesh2.rotation.z = -Math.PI / 3;
    const leafMesh3 = new THREE.Mesh(leafGeo, leafMat);
    leafMesh3.position.set(-0.5, 3.2, 0.9);
    leafMesh3.rotation.z = 0.1;
    natureGroup.add(leafMesh1, leafMesh2, leafMesh3);
    natureGroup.visible = theme === 'nature';
    layersGroup.add(natureGroup);

    // 2. Geometric Theme (Floating Triangular Prisms, Spheres & Cubes)
    const geoGroup = new THREE.Group();
    geoGroup.name = 'theme_geometric';
    // Red 3D Triangular Prisms
    const prismGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.6, 3);
    const prismMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25, metalness: 0.3 });
    const prism1 = new THREE.Mesh(prismGeo, prismMat);
    prism1.position.set(-6.8, 1.8, 1.4);
    prism1.rotation.set(0.4, 0.6, 0.5);
    const prism2 = new THREE.Mesh(prismGeo, prismMat);
    prism2.position.set(6.8, 1.5, 1.4);
    prism2.rotation.set(-0.3, 0.5, -0.4);
    // Cobalt Blue 3D Spheres with high shine
    const sphereGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.15, metalness: 0.5 });
    const sphere1 = new THREE.Mesh(sphereGeo, sphereMat);
    sphere1.position.set(-6.2, -1.8, 1.5);
    const sphere2 = new THREE.Mesh(sphereGeo, sphereMat);
    sphere2.position.set(6.2, -1.8, 1.5);
    // Neon Green Velocity Cubes
    const cubeGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0x4ade80, emissive: 0x22c55e, emissiveIntensity: 0.6 });
    const cube1 = new THREE.Mesh(cubeGeo, cubeMat);
    cube1.position.set(-3.5, 3.2, 1.2);
    cube1.rotation.set(0.5, 0.5, 0);
    const cube2 = new THREE.Mesh(cubeGeo, cubeMat);
    cube2.position.set(4.5, 3.2, 1.2);
    cube2.rotation.set(0.3, 0.7, 0.2);
    geoGroup.add(prism1, prism2, sphere1, sphere2, cube1, cube2);
    geoGroup.visible = theme === 'geometric';
    layersGroup.add(geoGroup);

    // Center adjustment
    layersGroup.position.set(-0.5, 0, 0);

    // Mouse Controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };

      rotationTargetRef.current.y += deltaX * 0.008;
      rotationTargetRef.current.x += deltaY * 0.008;
      rotationTargetRef.current.x = Math.max(-0.8, Math.min(0.8, rotationTargetRef.current.x));
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseRef.current.x;
      const deltaY = e.touches[0].clientY - prevMouseRef.current.y;
      prevMouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      rotationTargetRef.current.y += deltaX * 0.008;
      rotationTargetRef.current.x += deltaY * 0.008;
    };
    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };
    domElement.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // Resize handler
    const onResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Gentle auto-rotation if idle
      if (!isDraggingRef.current && rotationSpeed > 0) {
        rotationTargetRef.current.y += delta * 0.3 * rotationSpeed;
      }

      // Smooth interpolation
      if (layersGroupRef.current) {
        layersGroupRef.current.rotation.x += (rotationTargetRef.current.x - layersGroupRef.current.rotation.x) * 0.1;
        layersGroupRef.current.rotation.y += (rotationTargetRef.current.y - layersGroupRef.current.rotation.y) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // Update exploded spread whenever prop changes
  useEffect(() => {
    if (!layersGroupRef.current) return;
    const group = layersGroupRef.current;

    const halo = group.getObjectByName('layer_halo');
    const block = group.getObjectByName('layer_block3d');
    const fill = group.getObjectByName('layer_fill');
    const green = group.getObjectByName('layer_green_cut');
    const outline = group.getObjectByName('layer_outline');
    const high = group.getObjectByName('layer_highlights');

    // Base positions + exploded offset
    const spread = explodedSpread * 5.0;

    if (halo) halo.position.z = -1.5 - spread * 0.8;
    if (block) block.position.z = -1.0 - spread * 0.4;
    if (fill) fill.position.z = 1.0 + spread * 0.2;
    if (green) green.position.z = 1.6 + spread * 0.6;
    if (outline) outline.position.z = 1.8 + spread * 1.0;
    if (high) high.position.z = 2.1 + spread * 1.4;
  }, [explodedSpread]);

  // Update theme elements visibility
  useEffect(() => {
    if (!layersGroupRef.current) return;
    const group = layersGroupRef.current;
    const nature = group.getObjectByName('theme_nature');
    const geo = group.getObjectByName('theme_geometric');
    if (nature) nature.visible = theme === 'nature';
    if (geo) geo.visible = theme === 'geometric';
  }, [theme]);

  // Update wireframe mode
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => { m.wireframe = wireframe; });
        } else {
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [wireframe]);

  // Update lighting angle
  useEffect(() => {
    if (!dirLightRef.current) return;
    const rad = (lightingAngle * Math.PI) / 180;
    dirLightRef.current.position.set(Math.cos(rad) * 12, Math.sin(rad) * 12, 12);
  }, [lightingAngle]);

  const resetView = () => {
    rotationTargetRef.current = { x: 0.15, y: -0.2 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 18);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col">
      {/* 3D Viewport Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-sky-400" />
          <span className="text-sm font-semibold tracking-wide text-slate-100">
            Visualizador 3D Real (WebGL Orbit & Exploded View)
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            · Arraste para orbitar · Camadas explodidas em tempo real
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetView}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Resetar Câmera</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full aspect-[16/9] min-h-[440px] max-h-[640px] cursor-grab active:cursor-grabbing bg-slate-950 relative"
      />

      {/* 3D Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3 bg-slate-900/80 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-red-500" />
            <span>Vermelho Fogo (Fill)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-600" />
            <span>Azul Cobalto (Extrusão 3D)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            <span>Verde Neon (Power Cut)</span>
          </div>
        </div>

        <div className="text-slate-500 text-[11px]">
          Use o slider de "Explosão de Camadas" abaixo para inspecionar o interior do bloco!
        </div>
      </div>
    </div>
  );
};
