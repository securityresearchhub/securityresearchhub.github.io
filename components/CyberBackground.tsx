import React, { useEffect, useRef } from 'react';

export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let frameCount = 0;

    // Detect low-end / mobile: reduce work significantly
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
    const nodeCount = isMobile ? 15 : 35;
    const gridSize = isMobile ? 90 : 55;
    const connectionDist = isMobile ? 100 : 140;
    // On mobile throttle to ~30fps by skipping every other frame
    const frameSkip = isMobile ? 2 : 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Cache computed style colors — only read on mount, not every frame
    let accentHex = '#8B5CF6';
    let accentAlpha8 = 'rgba(139,92,246,0.08)';
    let accentAlpha30 = 'rgba(139,92,246,0.30)';

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      const raw = style.getPropertyValue('--accent-primary').trim();
      if (raw) {
        accentHex = raw;
        // Build rgba variants from hex (simple 6-digit hex assumed)
        const r = parseInt(raw.slice(1, 3), 16);
        const g = parseInt(raw.slice(3, 5), 16);
        const b = parseInt(raw.slice(5, 7), 16);
        if (!isNaN(r)) {
          accentAlpha8 = `rgba(${r},${g},${b},0.05)`;
          accentAlpha30 = `rgba(${r},${g},${b},0.25)`;
        }
      }
    };
    readColors();

    // Re-read colors when theme changes (class on <html>)
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    window.addEventListener('resize', resize);
    resize();

    type Node = { x: number; y: number; vx: number; vy: number; radius: number };
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    let pulseX = 0;
    let isVisible = true;

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !animationFrameId) {
        draw();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const draw = () => {
      if (!isVisible) return;
      frameCount++;

      // Frame skip for mobile performance
      if (frameCount % frameSkip !== 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw grid lines (use cached colors)
      ctx.strokeStyle = accentHex + '0D';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw nodes
      ctx.fillStyle = accentAlpha30;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        // O(n²) connections (reduced node count on mobile minimizes cost)
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const alpha = Math.floor((0.08 * (1 - dist / connectionDist)) * 255)
              .toString(16).padStart(2, '0');
            ctx.strokeStyle = accentHex + alpha;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      }

      // Scanning pulse
      pulseX += 4;
      if (pulseX > width + 400) pulseX = -400;

      const gradient = ctx.createLinearGradient(pulseX, 0, pulseX + 250, 0);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, accentAlpha8);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(pulseX, 0, 250, height);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
      themeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40" />;
};
