import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "~/utils";

interface FlickeringGridProps {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  imageSrc?: string;
  className?: string;
  maxOpacity?: number;
  style?: React.CSSProperties;
}

const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = "rgb(0, 0, 0)",
  width,
  height,
  imageSrc,
  className,
  maxOpacity = 0.3,
  style,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const baseColorsRef = useRef<
    | {
        r: number;
        g: number;
        b: number;
      }[]
    | null
  >(null);
  const [tintColor, setTintColor] = useState<{
    r: number;
    g: number;
    b: number;
  }>({ r: 0, g: 0, b: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    setTintColor({ r: r ?? 0, g: g ?? 0, b: b ?? 0 });
  }, [color]);

  useEffect(() => {
    if (imageSrc) {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc;
      image.onload = () => {
        setImg(image);
      };
    } else {
      setImg(null);
    }
  }, [imageSrc]);

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const cols = Math.floor(width / (squareSize + gridGap));
      const rows = Math.floor(height / (squareSize + gridGap));
      const totalGridWidth = cols * (squareSize + gridGap) - gridGap;
      const totalGridHeight = rows * (squareSize + gridGap) - gridGap;
      const offsetX = (width - totalGridWidth) / 2;
      const offsetY = (height - totalGridHeight) / 2;

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr, offsetX, offsetY };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
      offsetX: number,
      offsetY: number,
    ) => {
      ctx.clearRect(0, 0, width, height);

      const baseColors = baseColorsRef.current;

      if (baseColors) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const val = squares[i * rows + j];
          let fillStyle: string;
          if (baseColors && val) {
            const base = baseColors[i * rows + j];
            const iv = val / maxOpacity;
            const mixR = (base?.r ?? 0) * (1 - iv) + tintColor.r * iv;
            const mixG = (base?.g ?? 0) * (1 - iv) + tintColor.g * iv;
            const mixB = (base?.b ?? 0) * (1 - iv) + tintColor.b * iv;
            fillStyle = `rgb(${Math.floor(mixR)}, ${Math.floor(mixG)}, ${Math.floor(mixB)})`;
          } else {
            fillStyle = `rgba(${tintColor.r}, ${tintColor.g}, ${tintColor.b}, ${val})`;
          }
          ctx.fillStyle = fillStyle;
          ctx.fillRect(
            (offsetX + i * (squareSize + gridGap)) * dpr,
            (offsetY + j * (squareSize + gridGap)) * dpr,
            squareSize * dpr,
            squareSize * dpr,
          );
        }
      }
    },
    [squareSize, gridGap, tintColor, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);

      if (img) {
        const offscreen = document.createElement("canvas");
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
        if (!offCtx) return;
        offCtx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const baseColors: { r: number; g: number; b: number }[] = [];
        for (let i = 0; i < gridParams.cols; i++) {
          for (let j = 0; j < gridParams.rows; j++) {
            const x =
              (gridParams.offsetX + i * (squareSize + gridGap)) *
              gridParams.dpr;
            const y =
              (gridParams.offsetY + j * (squareSize + gridGap)) *
              gridParams.dpr;
            const w = squareSize * gridParams.dpr;
            const h = squareSize * gridParams.dpr;
            const imageData = offCtx.getImageData(x, y, w, h);
            const data = imageData.data;
            let sumR = 0,
              sumG = 0,
              sumB = 0;
            for (let k = 0; k < data.length; k += 4) {
              sumR += data[k] ?? 0;
              sumG += data[k + 1] ?? 0;
              sumB += data[k + 2] ?? 0;
            }
            const count = data.length / 4;
            baseColors[i * gridParams.rows + j] = {
              r: sumR / count,
              g: sumG / count,
              b: sumB / count,
            };
          }
        }
        baseColorsRef.current = baseColors;
      } else {
        baseColorsRef.current = null;
      }
    };

    updateCanvasSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
        gridParams.offsetX,
        gridParams.offsetY,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(canvas);

    if (isInView) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [
    setupCanvas,
    updateSquares,
    drawGrid,
    width,
    height,
    isInView,
    img,
    squareSize,
    gridGap,
  ]);

  return (
    <div
      ref={containerRef}
      className={cn("h-full w-full", className)}
      style={style}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
        }}
      />
    </div>
  );
};

export { FlickeringGrid };
