"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

export type SceneId = "intro" | "openai" | "anthropic" | "gemini" | "grok" | "codexa" | "unified";

interface InteractiveParticleCanvasProps {
  activeScene: SceneId;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  baseRadius: number;
  currentRadius: number;
  alpha: number;
  baseAlpha: number;
  colorType: "core" | "starlight" | "icy" | "highlight" | "amber" | "violet" | "blue" | "crimson";
  spiralArm: number;
  spiralRadius: number;
  spiralAngleOffset: number;
  inXShape: boolean;
  depth: number; // 0 (far) to 1 (near)
}

export function InteractiveParticleCanvas({
  activeScene,
  className = "",
}: InteractiveParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isReduced = useReducedMotion();

  const mouseRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    vx: number;
    vy: number;
    isInside: boolean;
  }>({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    isInside: false,
  });

  const isVisibleRef = useRef<boolean>(true);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef<number>(0);
  const sceneTransitionRef = useRef<{ current: SceneId; target: SceneId; progress: number }>({
    current: activeScene,
    target: activeScene,
    progress: 1,
  });

  // Track activeScene changes for smooth transition
  useEffect(() => {
    if (sceneTransitionRef.current.target !== activeScene) {
      sceneTransitionRef.current.current = sceneTransitionRef.current.target;
      sceneTransitionRef.current.target = activeScene;
      sceneTransitionRef.current.progress = 0;
    }
  }, [activeScene]);

  // Generate target coordinates for the genuine CodeXa X emblem silhouette
  const generateCodeXaXTargets = useCallback((width: number, height: number, count: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const S = Math.min(width, height) * 0.22;
    const targets: { x: number; y: number }[] = [];

    for (let i = 0; i < count; i++) {
      let tx = cx;
      let ty = cy;
      const bucket = i % 7;

      if (bucket === 0) {
        // Arm 1: Top-Left to Center
        const t = Math.random();
        tx = (cx - S * 0.95) + t * (S * 0.95);
        ty = (cy - S * 0.95) + t * (S * 0.95);
      } else if (bucket === 1) {
        // Arm 1: Center to Bottom-Right
        const t = Math.random();
        tx = cx + t * (S * 0.95);
        ty = cy + t * (S * 0.95);
      } else if (bucket === 2) {
        // Arm 2: Top-Right to Center
        const t = Math.random();
        tx = (cx + S * 0.95) - t * (S * 0.95);
        ty = (cy - S * 0.95) + t * (S * 0.95);
      } else if (bucket === 3) {
        // Arm 2: Center to Bottom-Left
        const t = Math.random();
        tx = cx - t * (S * 0.95);
        ty = cy + t * (S * 0.95);
      } else if (bucket === 4) {
        // Left angled precision chevron <
        const t = (Math.random() - 0.5) * 2;
        tx = cx - S * 0.55 + Math.abs(t) * S * 0.35;
        ty = cy + t * S * 0.75;
      } else if (bucket === 5) {
        // Right angled precision chevron >
        const t = (Math.random() - 0.5) * 2;
        tx = cx + S * 0.55 - Math.abs(t) * S * 0.35;
        ty = cy + t * S * 0.75;
      } else {
        // Central starlight core concentration
        const angle = Math.random() * Math.PI * 2;
        const rad = Math.pow(Math.random(), 2) * S * 0.28;
        tx = cx + Math.cos(angle) * rad;
        ty = cy + Math.sin(angle) * rad;
      }

      targets.push({ x: tx, y: ty });
    }

    return targets;
  }, []);

  // Initialize Particles
  const initParticles = useCallback(
    (width: number, height: number) => {
      const isMobile = width < 768;
      // High density for organic spiral without DOM overhead
      const count = isMobile ? 420 : 1200;
      const targets = generateCodeXaXTargets(width, height, count);
      const particles: Particle[] = [];
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < count; i++) {
        const depth = Math.random();
        const arm = i % 3;
        // Logarithmic spiral distribution: r = a * exp(b * theta)
        const t = Math.pow(Math.random(), 0.65);
        const spiralRadius = 15 + t * (Math.min(width, height) * 0.48);
        const spiralAngleOffset = (Math.random() - 0.5) * 0.35;

        // Color distribution
        let colorType: Particle["colorType"] = "starlight";
        let baseRadius = 0.8 + depth * 1.2;
        let baseAlpha = 0.25 + depth * 0.55;

        const rand = Math.random();
        if (rand < 0.04) {
          // Rare warm-white highlight stars
          colorType = "highlight";
          baseRadius = 1.8 + Math.random() * 1.2;
          baseAlpha = 0.95;
        } else if (rand < 0.22) {
          // Subtle icy blue
          colorType = "icy";
          baseRadius = 1.1 + depth * 0.9;
          baseAlpha = 0.4 + depth * 0.4;
        } else if (rand < 0.45) {
          // Core silver
          colorType = "core";
          baseRadius = 0.9 + depth * 0.8;
          baseAlpha = 0.3 + depth * 0.4;
        } else {
          // Starlight cool white
          colorType = "starlight";
          baseRadius = 0.7 + depth * 0.7;
          baseAlpha = 0.2 + depth * 0.5;
        }

        const startAngle = (arm * Math.PI * 2) / 3 + t * Math.PI * 3.8;
        const ox = cx + Math.cos(startAngle) * spiralRadius;
        const oy = cy + Math.sin(startAngle) * spiralRadius;

        particles.push({
          x: ox,
          y: oy,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          targetX: targets[i]?.x || cx,
          targetY: targets[i]?.y || cy,
          baseRadius,
          currentRadius: baseRadius,
          alpha: baseAlpha,
          baseAlpha,
          colorType,
          spiralArm: arm,
          spiralRadius,
          spiralAngleOffset,
          inXShape: i % 3 === 0, // 33% of particles form the CodeXa X emblem
          depth,
        });
      }

      particlesRef.current = particles;
    },
    [generateCodeXaXTargets]
  );

  // Resize Handler with DPR Scaling
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    initParticles(rect.width, rect.height);
  }, [initParticles]);

  // Pointer Movement Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const nx = e.clientX - rect.left;
    const ny = e.clientY - rect.top;

    const mouse = mouseRef.current;
    mouse.vx = nx - (mouse.x === -9999 ? nx : mouse.x);
    mouse.vy = ny - (mouse.y === -9999 ? ny : mouse.y);
    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = nx;
    mouse.y = ny;
    mouse.isInside = true;
  };

  const handleMouseLeave = () => {
    const mouse = mouseRef.current;
    mouse.x = -9999;
    mouse.y = -9999;
    mouse.vx = 0;
    mouse.vy = 0;
    mouse.isInside = false;
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    handleResize();

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animationId: number;

    const render = () => {
      animationId = requestAnimationFrame(render);
      if (!isVisibleRef.current) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width === 0 || height === 0) return;

      timeRef.current += 0.016;
      const time = timeRef.current;
      const mouse = mouseRef.current;
      const particles = particlesRef.current;
      const cx = width / 2;
      const cy = height / 2;

      // Update scene transition progress
      if (sceneTransitionRef.current.progress < 1) {
        sceneTransitionRef.current.progress = Math.min(1, sceneTransitionRef.current.progress + 0.035);
      }
      const active = activeScene;

      // -------------------------------------------------------------
      // 1. BASE BACKGROUND: Deepest Near-Black Space
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, width, height);

      // Deep atmospheric space tint
      ctx.fillStyle = active === "anthropic" ? "#080809" : "#050608";
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 2. SCENE 02 (CLAUDE / ANTHROPIC): GIGANTIC COSMIC PLANETARY HORIZON (V21)
      // -------------------------------------------------------------
      if (active === "anthropic") {
        ctx.save();

        // Parallax offset from mouse
        const parallaxX = mouse.isInside ? (mouse.x - cx) * 0.018 : 0;
        const parallaxY = mouse.isInside ? (mouse.y - cy) * 0.012 : 0;

        // Giant curved planetary geometry
        // The sphere center is far beneath the canvas so the top edge forms a gentle arc
        const planetCenterX = cx + parallaxX;
        const planetCenterY = height * 1.62 + parallaxY;
        const planetRadius = width * 0.96;

        // Sunrise position: slightly left of center along the horizon
        const sunAngle = -Math.PI / 2 - 0.22;
        const sunX = planetCenterX + Math.cos(sunAngle) * planetRadius;
        const sunY = planetCenterY + Math.sin(sunAngle) * planetRadius;

        // Atmospheric Breathing Pulse
        const breath = 1 + Math.sin(time * 0.75) * 0.04;

        // 1. Wide Atmospheric Sky Scattering (Long soft gradient behind horizon)
        const skyGlow = ctx.createRadialGradient(sunX, sunY, 30, sunX, sunY, width * 0.85);
        skyGlow.addColorStop(0, "rgba(255, 245, 223, 0.42)");
        skyGlow.addColorStop(0.12, "rgba(244, 181, 140, 0.28)");
        skyGlow.addColorStop(0.28, "rgba(224, 132, 74, 0.16)");
        skyGlow.addColorStop(0.48, "rgba(116, 88, 200, 0.10)");
        skyGlow.addColorStop(0.72, "rgba(125, 154, 232, 0.04)");
        skyGlow.addColorStop(1, "rgba(8, 8, 9, 0)");
        ctx.fillStyle = skyGlow;
        ctx.fillRect(0, 0, width, height);

        // 2. The Dark Planetary Body (Beneath the curved horizon)
        ctx.beginPath();
        ctx.arc(planetCenterX, planetCenterY, planetRadius, 0, Math.PI * 2);
        const planetGrad = ctx.createRadialGradient(
          sunX,
          sunY + 40,
          20,
          planetCenterX,
          planetCenterY,
          planetRadius
        );
        planetGrad.addColorStop(0, "rgba(18, 14, 22, 0.98)");
        planetGrad.addColorStop(0.2, "rgba(8, 7, 10, 0.99)");
        planetGrad.addColorStop(1, "rgba(3, 3, 5, 1)");
        ctx.fillStyle = planetGrad;
        ctx.fill();

        // 3. Multi-Layer Atmospheric Horizon Rim Glow (Warm amber -> Peach -> White -> Violet -> Blue)
        const rimArcStart = -Math.PI / 2 - 0.52;
        const rimArcEnd = -Math.PI / 2 + 0.52;

        // Outer Violet/Blue Atmospheric Diffusion Band
        ctx.beginPath();
        ctx.arc(planetCenterX, planetCenterY, planetRadius + 8 * breath, rimArcStart, rimArcEnd);
        ctx.strokeStyle = "rgba(116, 88, 200, 0.25)";
        ctx.lineWidth = 14 * breath;
        ctx.stroke();

        // Secondary Soft Peach/Amber Atmospheric Line
        ctx.beginPath();
        ctx.arc(planetCenterX, planetCenterY, planetRadius + 3 * breath, rimArcStart, rimArcEnd);
        ctx.strokeStyle = "rgba(244, 181, 140, 0.45)";
        ctx.lineWidth = 6 * breath;
        ctx.stroke();

        // Crisp Brilliant Luminous Rim (White-hot core near sunrise, thinning away)
        const rimGrad = ctx.createLinearGradient(sunX - 300, sunY, sunX + 500, sunY + 60);
        rimGrad.addColorStop(0, "rgba(244, 181, 140, 0.2)");
        rimGrad.addColorStop(0.25, "rgba(255, 245, 223, 0.95)"); // Sunrise core
        rimGrad.addColorStop(0.45, "rgba(244, 181, 140, 0.85)");
        rimGrad.addColorStop(0.7, "rgba(116, 88, 200, 0.65)");  // Violet
        rimGrad.addColorStop(0.9, "rgba(125, 154, 232, 0.35)");  // Blue
        rimGrad.addColorStop(1, "rgba(8, 8, 9, 0)");

        ctx.beginPath();
        ctx.arc(planetCenterX, planetCenterY, planetRadius, rimArcStart, rimArcEnd);
        ctx.strokeStyle = rimGrad;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // 4. Brilliant Sunrise Core (Intense focused illumination slightly left of center)
        const sunCore = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 130 * breath);
        sunCore.addColorStop(0, "rgba(255, 255, 255, 1)");
        sunCore.addColorStop(0.18, "rgba(255, 245, 223, 0.92)");
        sunCore.addColorStop(0.42, "rgba(244, 181, 140, 0.65)");
        sunCore.addColorStop(0.7, "rgba(224, 132, 74, 0.25)");
        sunCore.addColorStop(1, "rgba(116, 88, 200, 0)");
        ctx.fillStyle = sunCore;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 130 * breath, 0, Math.PI * 2);
        ctx.fill();

        // 5. Delicate Anamorphic Light Flare across the Horizon
        const flareWidth = Math.min(width * 0.7, 650);
        const flareGrad = ctx.createLinearGradient(sunX - flareWidth / 2, sunY, sunX + flareWidth / 2, sunY);
        flareGrad.addColorStop(0, "rgba(244, 181, 140, 0)");
        flareGrad.addColorStop(0.35, "rgba(255, 245, 223, 0.45)");
        flareGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.85)");
        flareGrad.addColorStop(0.65, "rgba(244, 181, 140, 0.45)");
        flareGrad.addColorStop(1, "rgba(116, 88, 200, 0)");

        ctx.beginPath();
        ctx.ellipse(sunX, sunY, flareWidth / 2, 2.4, 0.05, 0, Math.PI * 2);
        ctx.fillStyle = flareGrad;
        ctx.fill();

        // 6. Floating Ambient Cosmic Stardust Particles (drifting in the upper sky)
        particles.slice(0, 160).forEach((p, idx) => {
          // Keep particles above the planet rim
          const px = p.x;
          let py = p.y % (height * 0.65);
          py += Math.sin(time * 0.4 + idx) * 4;

          const pDist = Math.hypot(px - sunX, py - sunY);
          const illum = Math.max(0.2, 1 - pDist / (width * 0.6));

          ctx.beginPath();
          ctx.arc(px, py, p.baseRadius * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(244, 235, 225, ${p.baseAlpha * illum * 0.7})`;
          ctx.fill();
        });

        ctx.restore();
        return; // Claude horizon scene renders its dedicated custom atmosphere
      }

      // -------------------------------------------------------------
      // 3. SCENE 01 (OPENAI): ASTRA SPIRAL GALAXY & CODEXA X (V20)
      // -------------------------------------------------------------
      if (active === "openai") {
        ctx.save();

        // Luminous galaxy core glow (Cool white with subtle silver starlight)
        const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.38);
        coreGlow.addColorStop(0, "rgba(255, 255, 255, 0.28)");
        coreGlow.addColorStop(0.18, "rgba(215, 230, 250, 0.14)");
        coreGlow.addColorStop(0.45, "rgba(180, 210, 245, 0.06)");
        coreGlow.addColorStop(1, "rgba(5, 6, 8, 0)");
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.min(width, height) * 0.38, 0, Math.PI * 2);
        ctx.fill();

        // Faint cosmic stardust spiral lanes (very subtle architectural backdrop)
        const spiralSpeed = 0.045;
        const currentRot = time * spiralSpeed;

        ctx.translate(cx, cy);
        ctx.rotate(currentRot);

        for (let arm = 0; arm < 3; arm++) {
          const armAngle = (arm * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.strokeStyle = "rgba(200, 220, 245, 0.045)";
          ctx.lineWidth = 2.0;

          for (let step = 0; step < 50; step++) {
            const st = step / 50;
            const theta = armAngle + st * Math.PI * 3.6;
            const r = 24 + Math.pow(st, 0.72) * Math.min(width, height) * 0.44;
            const sx = Math.cos(theta) * r;
            const sy = Math.sin(theta) * r;
            if (step === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }

        ctx.restore();
      }

      // -------------------------------------------------------------
      // 4. SCENE 03 (GEMINI): FLUID CYAN/BLUE GRADIENTS
      // -------------------------------------------------------------
      if (active === "gemini") {
        const gradX = cx + Math.sin(time * 0.5) * 80;
        const gradY = cy + Math.cos(time * 0.4) * 60;
        const fluidGrad = ctx.createRadialGradient(gradX, gradY, 20, cx, cy, width * 0.55);
        fluidGrad.addColorStop(0, "rgba(56, 189, 248, 0.18)");
        fluidGrad.addColorStop(0.35, "rgba(59, 130, 246, 0.12)");
        fluidGrad.addColorStop(0.7, "rgba(139, 92, 246, 0.06)");
        fluidGrad.addColorStop(1, "rgba(5, 6, 8, 0)");
        ctx.fillStyle = fluidGrad;
        ctx.fillRect(0, 0, width, height);

        // Clean orbital paths
        const orbitAngles = [0.3, -0.6, 1.1];
        orbitAngles.forEach((rot, idx) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(rot + Math.sin(time * 0.2 + idx) * 0.08);
          ctx.beginPath();
          ctx.ellipse(0, 0, 160 + idx * 35, 65 + idx * 15, 0, 0, Math.PI * 2);
          ctx.strokeStyle = idx === 0 ? "rgba(56, 189, 248, 0.22)" : "rgba(139, 92, 246, 0.2)";
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.restore();
        });
      }

      // -------------------------------------------------------------
      // 5. SCENE 04 (GROK): KINETIC MONOCHROME ELECTRIC STREAKS
      // -------------------------------------------------------------
      if (active === "grok") {
        for (let l = 0; l < 6; l++) {
          const ly = cy - 100 + l * 40;
          const speed = (l + 1) * 0.4;
          const sweepX = ((time * speed * 150) % (width + 300)) - 150;

          ctx.beginPath();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
          ctx.lineWidth = 1;
          ctx.moveTo(width * 0.1, ly);
          ctx.lineTo(width * 0.9, ly);
          ctx.stroke();

          const sweepGrad = ctx.createLinearGradient(sweepX - 80, ly, sweepX + 80, ly);
          sweepGrad.addColorStop(0, "rgba(0, 240, 255, 0)");
          sweepGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.7)");
          sweepGrad.addColorStop(1, "rgba(0, 240, 255, 0)");

          ctx.beginPath();
          ctx.strokeStyle = sweepGrad;
          ctx.lineWidth = 1.5;
          ctx.moveTo(Math.max(width * 0.1, sweepX - 80), ly);
          ctx.lineTo(Math.min(width * 0.9, sweepX + 80), ly);
          ctx.stroke();
        }
      }

      // -------------------------------------------------------------
      // 6. SCENE 05 (CODEXA NATIVE): CLEAN CRIMSON / SILVER FORMATION
      // -------------------------------------------------------------
      if (active === "codexa") {
        const pulse = (Math.sin(time * 2.0) + 1) * 0.5;
        const glow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
        glow.addColorStop(0, `rgba(225, 29, 72, ${0.2 + pulse * 0.15})`);
        glow.addColorStop(1, "rgba(5, 6, 8, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // -------------------------------------------------------------
      // 7. PARTICLE PHYSICS: SPIRAL TRANSFORMATION & CURSOR DYNAMICS
      // -------------------------------------------------------------
      const rotSpeed = 0.055;

      particles.forEach((p, idx) => {
        let destX: number;
        let destY: number;

        if (active === "openai") {
          // When in OpenAI mode:
          // A subset of particles (p.inXShape) forms the CodeXa X emblem silhouette
          // The rest rotate continuously along the Astra logarithmic spiral arms
          if (p.inXShape) {
            destX = p.targetX;
            destY = p.targetY;
          } else {
            const currentAngle =
              (p.spiralArm * Math.PI * 2) / 3 +
              (idx / particles.length) * Math.PI * 4.2 +
              p.spiralAngleOffset +
              time * rotSpeed * (0.8 + p.depth * 0.4);
            destX = cx + Math.cos(currentAngle) * p.spiralRadius;
            destY = cy + Math.sin(currentAngle) * p.spiralRadius;
          }
        } else if (active === "codexa" || active === "intro") {
          // In CodeXa Native mode, all particles converge into the emblem
          destX = p.targetX;
          destY = p.targetY;
        } else {
          // Ambient gentle field in other scenes
          const angle = (idx / particles.length) * Math.PI * 2 + time * 0.08;
          destX = cx + Math.cos(angle) * p.spiralRadius;
          destY = cy + Math.sin(angle) * p.spiralRadius;
        }

        // Spring acceleration toward destination
        const dx = destX - p.x;
        const dy = destY - p.y;
        p.vx += dx * 0.032;
        p.vy += dy * 0.032;

        // Ambient micro-drift
        p.vx += Math.sin(time * 1.8 + idx) * 0.06;
        p.vy += Math.cos(time * 1.8 + idx) * 0.06;

        // REAL POINTER / CURSOR PHYSICS:
        // Particles gently bend away and flow around cursor with inertia
        if (mouse.isInside) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist = Math.hypot(mdx, mdy);
          const repelRadius = 135;

          if (dist < repelRadius && dist > 0) {
            // Radial push
            const force = Math.pow(1 - dist / repelRadius, 2) * 3.8;
            const normX = mdx / dist;
            const normY = mdy / dist;

            // Tangential flow around cursor
            const tangX = -normY * 1.4;
            const tangY = normX * 1.4;

            p.vx += (normX * force + tangX) * 0.7;
            p.vy += (normY * force + tangY) * 0.7;
          }
        }

        // Position integration with smooth damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.88;
        p.vy *= 0.88;

        // Render Particle
        let fillStyle = "rgba(240, 245, 255, ";
        let rad = p.baseRadius;

        if (p.colorType === "highlight") {
          fillStyle = "rgba(255, 250, 240, ";
          rad = p.baseRadius * 1.1;
        } else if (p.colorType === "icy") {
          fillStyle = "rgba(180, 215, 255, ";
        } else if (p.colorType === "core") {
          fillStyle = "rgba(215, 225, 245, ";
        }

        if (active === "codexa") {
          fillStyle = p.inXShape ? "rgba(244, 63, 94, " : "rgba(255, 255, 255, ";
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `${fillStyle}${p.alpha})`;
        ctx.fill();

        // Subtle soft halo for highlight stars
        if (p.colorType === "highlight") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, rad * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 250, 240, ${p.alpha * 0.18})`;
          ctx.fill();
        }
      });
    };

    if (!isReduced) {
      animationId = requestAnimationFrame(render);
    } else {
      // Reduced motion fallback: Clean static constellation
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#050608";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(240, 245, 255, 0.4)";
        particlesRef.current.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.targetX, p.targetY, p.baseRadius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [activeScene, handleResize, isReduced]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none block"
      />
    </div>
  );
}