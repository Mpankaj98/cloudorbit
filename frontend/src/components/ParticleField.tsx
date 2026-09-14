import { useEffect, useRef } from "react";

const LAT_STEPS = 34;
const LON_STEPS = 52;

interface BlobPoint {
  theta: number;
  phi: number;
  radius: number;
  jx: number;
  jy: number;
  jz: number;
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function buildPoints(): BlobPoint[] {
  const points: BlobPoint[] = [];
  let idx = 0;
  for (let i = 0; i <= LAT_STEPS; i++) {
    const theta = (i / LAT_STEPS) * Math.PI;
    for (let j = 0; j < LON_STEPS; j++) {
      const phi = (j / LON_STEPS) * Math.PI * 2;
      const noise =
        Math.sin(theta * 3 + phi * 2) * 0.5 +
        Math.sin(theta * 5 - phi * 3) * 0.28 +
        Math.sin(theta * 2 + phi * 7) * 0.18;
      idx += 1;
      points.push({
        theta,
        phi,
        radius: 1 + noise * 0.22,
        jx: pseudoRandom(idx * 3 + 1) * 2 - 1,
        jy: pseudoRandom(idx * 3 + 2) * 2 - 1,
        jz: pseudoRandom(idx * 3 + 3) * 2 - 1,
      });
    }
  }
  return points;
}

function mixColor(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points = buildPoints();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const purple: [number, number, number] = [124, 58, 237];
    const blue: [number, number, number] = [79, 70, 229];
    const cyan: [number, number, number] = [34, 211, 238];

    let angle = 0;
    let raf = 0;
    let vw = 0;
    let vh = 0;
    let scatterTarget = 0;
    let scatterCurrent = 0;

    function resize() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = vw * dpr;
      canvas!.height = vh * dpr;
      canvas!.style.width = `${vw}px`;
      canvas!.style.height = `${vh}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      if (!vw || !vh) return;
      ctx!.clearRect(0, 0, vw, vh);

      const anchorX = vw * 0.72;
      const anchorY = vh * 0.42;
      const baseRadius = Math.min(vw, vh) * 0.19;
      const spreadRadius = Math.hypot(vw, vh) * 0.55;

      const focal = baseRadius * 3.6;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const tilt = 0.28;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      const projected = points.map((p) => {
        const x = Math.sin(p.theta) * Math.cos(p.phi) * p.radius;
        const y = Math.cos(p.theta) * p.radius;
        const z = Math.sin(p.theta) * Math.sin(p.phi) * p.radius;

        const x1 = x * cosA - z * sinA;
        const z1 = x * sinA + z * cosA;
        const y1 = y * cosT - z1 * sinT;
        const z2 = y * sinT + z1 * cosT;

        const persp = focal / (focal + z2 * baseRadius);

        const norm = Math.sqrt(x1 * x1 + y1 * y1) || 1;
        const nx = x1 / norm;
        const ny = y1 / norm;
        const spread = scatterCurrent * spreadRadius;
        const spreadX = (nx + p.jx * 0.8) * spread;
        const spreadY = (ny + p.jy * 0.8) * spread;

        return {
          sx: anchorX + x1 * baseRadius * persp + spreadX,
          sy: anchorY + y1 * baseRadius * persp + spreadY,
          z: z2,
          persp,
          y: y1,
        };
      });

      projected.sort((a, b) => a.z - b.z);

      const fade = Math.max(0.12, 1 - scatterCurrent * 0.65);

      for (const p of projected) {
        const depthT = Math.min(1, Math.max(0, (p.z + 1.3) / 2.6));
        const heightT = Math.min(1, Math.max(0, (p.y + 1.3) / 2.6));
        const base = mixColor(purple, cyan, heightT);
        const color = mixColor(blue, base, depthT);
        const brightness = (0.32 + depthT * 0.6) * fade;
        const r = Math.max(0.5, 1.5 * p.persp);

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(${color[0] | 0}, ${color[1] | 0}, ${color[2] | 0}, ${brightness})`;
        ctx!.arc(p.sx, p.sy, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    function loop() {
      if (!reduceMotion) angle += 0.0035;
      scatterCurrent += (scatterTarget - scatterCurrent) * 0.08;
      draw();
      raf = requestAnimationFrame(loop);
    }

    function updateScatterTarget() {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      scatterTarget = progress;
    }

    resize();
    updateScatterTarget();
    draw();

    const onResize = () => {
      resize();
      draw();
    };
    const onScroll = () => {
      updateScatterTarget();
      if (reduceMotion) {
        scatterCurrent = scatterTarget;
        draw();
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
  );
}
