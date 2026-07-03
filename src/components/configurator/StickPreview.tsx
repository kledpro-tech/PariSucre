'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { templateRegistry } from '@/templates';
import type { TemplateProps } from '@/templates';

interface StickPreviewProps extends TemplateProps {
  templateSlug: string;
}

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.2;

export function StickPreview({
  templateSlug,
  logoUrl,
  colors,
  establishmentName,
  slogan,
  legalMentions,
  weightGrams,
  address,
  sugarType,
  isExport,
  className,
}: StickPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const entry = useMemo(
    () => templateRegistry.find((t) => t.slug === templateSlug),
    [templateSlug],
  );

  const TemplateComponent = entry?.component;

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen((f) => !f);
  }, [isFullscreen]);

  const templateProps: TemplateProps = {
    logoUrl,
    colors,
    establishmentName,
    slogan,
    legalMentions,
    weightGrams,
    address,
    sugarType,
    isExport,
  };

  if (!TemplateComponent) {
    return (
      <div className={`rounded-xl border border-red-200 bg-red-50 p-6 text-center ${className ?? ''}`}>
        <p className="text-sm text-red-600 font-medium">
          Template « {templateSlug} » introuvable.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`
        flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm
        ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}
        ${className ?? ''}
      `}
    >
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <h3 className="text-sm font-semibold text-gray-700">Aperçu de la bûchette</h3>
          <span className="text-xs text-gray-400">— {entry?.name}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomOut}
            disabled={zoom <= ZOOM_MIN}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom arrière"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>

          <span className="min-w-[3rem] text-center text-xs font-medium text-gray-500 tabular-nums">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= ZOOM_MAX}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Zoom avant"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1.5 h-4 w-px bg-gray-200" />

          <button
            onClick={toggleFullscreen}
            className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label={isFullscreen ? 'Quitter le plein écran' : 'Voir en plein écran'}
          >
            {isFullscreen ? (
              <><Minimize2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Quitter</span></>
            ) : (
              <><Maximize2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Plein écran</span></>
            )}
          </button>
        </div>
      </div>

      {/* ── Preview area — damier gris (fond neutre pour la transparence) ── */}
      <div
        className={`
          relative flex flex-1 items-center justify-center overflow-auto
          bg-[repeating-conic-gradient(#f0f0f0_0%_25%,#fafafa_0%_50%)] bg-[length:16px_16px]
          ${isFullscreen ? 'p-8' : 'p-6'}
        `}
      >
        {/* Ratio réel bûchette dépliée : 560 / 224 */}
        <div
          className="relative w-full transition-all duration-200 ease-out drop-shadow-md"
          style={{
            maxWidth: `${560 * zoom}px`,
            aspectRatio: '560 / 224',
          }}
        >
          <TemplateComponent {...templateProps} className="h-full w-full" />
        </div>
      </div>

      {/* ── Footer info ── */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-2">
        <p className="text-[10px] text-gray-400">
          120 mm × 52 mm — Vue dépliée (bande supérieure + face + bande inférieure)
        </p>
        <p className="text-[10px] text-gray-400">
          Onglets de collage inclus
        </p>
      </div>
    </div>
  );
}

export default StickPreview;
