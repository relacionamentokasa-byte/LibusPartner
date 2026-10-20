import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  subLabel?: string;
  onSignatureChange: (base64: string) => void;
  width?: number;
  height?: number;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  subLabel = 'Assine com o dedo, caneta touch ou mouse',
  onSignatureChange,
  width = 500,
  height = 180
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Inicializa o canvas com DPI escalado para alta definição
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0F172A'; // Slate-900 profissional
    ctx.lineWidth = 2.5;
  }, [width, height]);

  // Algoritmo de Autotrim: remove margens vazias e exporta somente o traçado em PNG transparente
  const getCroppedSignature = (canvas: HTMLCanvasElement): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const dpr = window.devicePixelRatio || 1;
    const realWidth = canvas.width;
    const realHeight = canvas.height;

    const imageData = ctx.getImageData(0, 0, realWidth, realHeight);
    const data = imageData.data;

    let minX = realWidth;
    let minY = realHeight;
    let maxX = 0;
    let maxY = 0;
    let hasPixels = false;

    for (let y = 0; y < realHeight; y++) {
      for (let x = 0; x < realWidth; x++) {
        const alpha = data[(y * realWidth + x) * 4 + 3];
        if (alpha > 20) {
          hasPixels = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (!hasPixels) return '';

    const pad = 12 * dpr;
    const cropX = Math.max(0, minX - pad);
    const cropY = Math.max(0, minY - pad);
    const cropW = Math.min(realWidth - cropX, (maxX - minX) + pad * 2);
    const cropH = Math.min(realHeight - cropY, (maxY - minY) + pad * 2);

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropW;
    croppedCanvas.height = cropH;
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return canvas.toDataURL('image/png');

    croppedCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
    return croppedCanvas.toDataURL('image/png');
  };

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {}

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPointerPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      const base64 = getCroppedSignature(canvas);
      if (base64) {
        setHasSignature(true);
        onSignatureChange(base64);
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    setHasSignature(false);
    onSignatureChange('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5">
            <PenTool size={13} className="text-libus-magenta" />
            <span>{label}</span>
          </label>
          <span className="text-[11px] text-slate-500">{subLabel}</span>
        </div>
        {hasSignature && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] font-mono font-bold text-slate-500 hover:text-red-600 transition flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-200"
          >
            <RotateCcw size={12} />
            <span>Limpar Traço</span>
          </button>
        )}
      </div>

      <div className="relative rounded-2xl border-2 border-dashed border-slate-300 bg-white overflow-hidden shadow-inner group hover:border-libus-magenta/60 transition focus-within:border-libus-magenta">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            width: '100%',
            height: `${height}px`,
            touchAction: 'none'
          }}
          className="cursor-crosshair w-full block bg-white"
        />

        {/* Linha guia de assinatura sutil */}
        <div className="pointer-events-none absolute bottom-6 left-8 right-8 border-b border-slate-200/80 flex items-center justify-between text-[10px] text-slate-300 font-mono">
          <span>✕ assine sobre a linha</span>
          <span>área de captura digital</span>
        </div>

        {hasSignature && (
          <div className="pointer-events-none absolute top-2 right-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1">
            <Check size={10} />
            <span>Capturada</span>
          </div>
        )}
      </div>
    </div>
  );
};
