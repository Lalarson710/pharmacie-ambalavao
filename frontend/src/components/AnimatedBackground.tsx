import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  isCross: boolean;
  phase: number;
};

type AnimatedBackgroundProps = {
  /** Couleur des particules et des liens. */
  color?: string;
  /** Couleur des « croix » (symboles de pharmacie). */
  crossColor?: string;
  /** Nombre de particules. */
  density?: number;
  /** Distance maximale entre deux particules reliées. */
  linkDistance?: number;
  /** Opacité globale de la couche (0 à 1). */
  opacity?: number;
  className?: string;
};

/**
 * Fond animé type « constellation » rendu sur canvas.
 * Aucun framework externe : uniquement React + Canvas 2D.
 * Respecte `prefers-reduced-motion`.
 */
export function AnimatedBackground({
  color = 'rgba(255, 255, 255, 0.55)',
  crossColor = 'rgba(255, 255, 255, 0.42)',
  density = 46,
  linkDistance = 132,
  opacity = 1,
  className,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;

    const hexToRgb = (value: string) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return { r: 255, g: 255, b: 255 };
      const [r, g, b] = match[1].split(',').map((part) => Number(part.trim()));
      return { r: r || 255, g: g || 255, b: b || 255 };
    };

    const rgb = hexToRgb(color);
    const rgbCross = hexToRgb(crossColor);

    const buildParticles = () => {
      const count = Math.max(16, Math.round((width * height) / 26000) * (density / 46));
      particles = Array.from({ length: Math.min(count, 120) }, () => {
        const isCross = Math.random() < 0.22;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: isCross ? 3.4 + Math.random() * 2.4 : 1.1 + Math.random() * 1.9,
          isCross,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const drawCross = (x: number, y: number, size: number, alpha: number) => {
      const bar = Math.max(1.1, size * 0.38);
      ctx.fillStyle = `rgba(${rgbCross.r}, ${rgbCross.g}, ${rgbCross.b}, ${alpha})`;
      ctx.fillRect(x - size / 2, y - bar / 2, size, bar);
      ctx.fillRect(x - bar / 2, y - size / 2, bar, size);
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Liens entre particules proches
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > linkDistance) continue;
          const alpha = (1 - dist / linkDistance) * 0.28;
          ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Particules
      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        const twinkle = reduceMotion ? 1 : 0.65 + Math.sin(time / 900 + p.phase) * 0.35;

        if (p.isCross) {
          drawCross(p.x, p.y, p.r * 3.1, twinkle);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.55 * twinkle})`;
          ctx.fill();
        }
      }

      if (!reduceMotion) raf = requestAnimationFrame(render);
    };

    resize();
    render(0);

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    if (!reduceMotion) raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [color, crossColor, density, linkDistance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ opacity, pointerEvents: 'none' }}
    />
  );
}
