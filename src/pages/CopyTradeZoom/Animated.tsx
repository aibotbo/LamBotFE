import React, { useRef, useEffect, MutableRefObject } from 'react';
import { TweenLite, Circ } from 'gsap';

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  closest?: Point[];
  active?: number;
  circle?: Circle;
}

class Circle {
  pos: Point;
  radius: number;
  color: string;
  active?: number;

  constructor(pos: Point, rad: number, color: string) {
    this.pos = pos;
    this.radius = rad;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(156,217,249,${this.active})`;
    ctx.fill();
  }
}

interface AnimatedHeaderProps {
  largeHeaderRef: MutableRefObject<HTMLDivElement | null>;
}

const AnimatedHeader: React.FC<AnimatedHeaderProps> = ({ largeHeaderRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const targetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animateHeaderRef = useRef(true);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const rotationSpeed = 0.02;
  const radius = 100;

  useEffect(() => {
    const canvas = canvasRef.current!;
    // const ctx = canvas.getContext('2d')!;
    const largeHeader = largeHeaderRef.current!;

    const updateCanvasSize = () => {
      if (canvas && largeHeader) {
        const rect = largeHeader.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    const initHeader = () => {
      updateCanvasSize();
      targetRef.current = { x: canvas.width / 2, y: canvas.height / 2 };

      const points: Point[] = [];
      for (let x = 0; x < canvas.width; x += canvas.width / 20) {
        for (let y = 0; y < canvas.height; y += canvas.height / 20) {
          const px = x + Math.random() * canvas.width / 20;
          const py = y + Math.random() * canvas.height / 20;
          points.push({ x: px, originX: px, y: py, originY: py });
        }
      }

      points.forEach((p1) => {
        const closest: Point[] = [];
        points.forEach((p2) => {
          if (p1 !== p2) {
            let placed = false;
            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (closest[k] === undefined) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }
            for (let k = 0; k < 5; k++) {
              if (!placed) {
                if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                  closest[k] = p2;
                  placed = true;
                }
              }
            }
          }
        });
        p1.closest = closest;
      });

      points.forEach((p) => {
        p.circle = new Circle(p, 2 + Math.random() * 2, 'rgba(255,255,255,0.3)');
      });
      pointsRef.current = points;
    };

    const addListeners = () => {
      const canvas = canvasRef.current!;
      canvas.addEventListener('mousemove', mouseMove);
      canvas.addEventListener('mouseleave', mouseLeave);
      window.addEventListener('scroll', scrollCheck);
      window.addEventListener('resize', resize);
      resizeObserverRef.current = new ResizeObserver(() => {
        updateCanvasSize();
        initHeader();
      });
      resizeObserverRef.current.observe(largeHeader);
    };

    const mouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const posx = e.clientX - rect.left;
      const posy = e.clientY - rect.top;
      targetRef.current = { x: posx, y: posy };
      console.log('Mouse Position:', targetRef.current);
    };

    const mouseLeave = () => {
      targetRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
    };

    const scrollCheck = () => {
      if (document.body.scrollTop > canvas.height) {
        animateHeaderRef.current = false;
      } else {
        animateHeaderRef.current = true;
      }
    };

    const resize = () => {
      updateCanvasSize();
    };

    const initAnimation = () => {
      animate();
      pointsRef.current.forEach((point) => shiftPoint(point));
    };

    const animate = () => {
      if (animateHeaderRef.current) {
        const ctx = canvasRef.current!.getContext('2d')!;
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        pointsRef.current.forEach((p) => {
          const distance = getDistance(targetRef.current, p);
          if (distance < 4000) {
            p.active = 0.3;
            p.circle!.active = 0.6;
          } else if (distance < 20000) {
            p.active = 0.1;
            p.circle!.active = 0.3;
          } else if (distance < 40000) {
            p.active = 0.02;
            p.circle!.active = 0.1;
          } else {
            p.active = 0;
            p.circle!.active = 0;
          }

          drawLines(p, ctx);
          p.circle!.draw(ctx);
        });
      }
      requestAnimationFrame(animate);
    };

    const shiftPoint = (p: Point) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      TweenLite.to(p, 1 + Math.random(), {
        x: centerX + radius * Math.cos(rotationSpeed * Date.now()),
        y: centerY + radius * Math.sin(rotationSpeed * Date.now()),
        ease: Circ.easeInOut,
        onComplete: () => shiftPoint(p),
      });
    };

    const drawLines = (p: Point, ctx: CanvasRenderingContext2D) => {
      if (!p.active) return;
      p.closest?.forEach((closestPoint) => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(closestPoint.x, closestPoint.y);
        ctx.strokeStyle = `rgba(156,217,249,${p.active})`;
        ctx.stroke();
      });
    };

    const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    };

    initHeader();
    addListeners();
    initAnimation();

    return () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.removeEventListener('mousemove', mouseMove);
        canvas.removeEventListener('mouseleave', mouseLeave);
      }
      window.removeEventListener('scroll', scrollCheck);
      window.removeEventListener('resize', resize);
      if (resizeObserverRef.current) {
        // Ensure largeHeaderRef.current is not null before calling unobserve
        if (largeHeaderRef.current) {
          resizeObserverRef.current.unobserve(largeHeaderRef.current);
        }
      }
    };
  }, [largeHeaderRef]);

  return (
    <div id="large-header" className="large-header">
      <canvas id="demo-canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default AnimatedHeader;
