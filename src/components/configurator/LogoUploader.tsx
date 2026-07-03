'use client';

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react';
import { Upload, FileImage, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileQuality } from '@/types/configurator';

interface LogoUploaderProps {
  onFileSelected: (file: File) => void;
  currentFile: File | null;
  currentPreviewUrl: string | null;
  qualityResult?: FileQuality | null;
}

const ACCEPT = '.svg,.pdf,.png,.jpg,.jpeg,.webp';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const QUALITY_CONFIG: Record<FileQuality, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  excellent: { label: 'Excellente qualité', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  good: { label: 'Bonne qualité', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle2 },
  warning: { label: 'Qualité moyenne', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle },
  poor: { label: 'Qualité insuffisante', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function LogoUploader({
  onFileSelected,
  currentFile,
  currentPreviewUrl,
  qualityResult,
}: LogoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((file: File): boolean => {
    if (file.size > MAX_SIZE) {
      setError(`Le fichier dépasse 10 Mo (${formatSize(file.size)})`);
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (validate(file)) onFileSelected(file);
    },
    [validate, onFileSelected],
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    },
    [handleFile],
  );

  const hasFile = currentFile && currentPreviewUrl;

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          'dropzone rounded-2xl cursor-pointer text-center transition-all duration-300',
          dragActive && 'active',
          hasFile ? 'p-3' : 'p-4 lg:p-5',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          className="hidden"
          onChange={handleChange}
        />

        {hasFile ? (
          /* ── File preview ── */
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail */}
            <div className="shrink-0 w-16 h-16 rounded-xl bg-bg-subtle border border-border-light flex items-center justify-center overflow-hidden">
              {currentPreviewUrl.endsWith('.pdf') ? (
                <FileImage className="h-8 w-8 text-text-muted" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentPreviewUrl}
                  alt="Aperçu du logo"
                  className="w-full h-full object-contain p-1.5"
                />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold text-text truncate">{currentFile.name}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{formatSize(currentFile.size)}</p>

              {/* Quality badge */}
              {qualityResult && (
                <div className="mt-1.5">
                  {(() => {
                    const cfg = QUALITY_CONFIG[qualityResult];
                    const Icon = cfg.icon;
                    return (
                      <span className={cn('inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border', cfg.color)}>
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Replace button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="shrink-0 btn-secondary text-[11px] h-8 px-3 py-1 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Remplacer
            </button>
          </div>
        ) : (
          /* ── Empty state ── */
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                <Upload className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm font-semibold text-text text-left">
                Glissez votre logo ici ou <span className="text-primary font-medium underline underline-offset-2">parcourez</span>
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-text-muted">
              <Info className="h-3.5 w-3.5 text-accent-light shrink-0" />
              <span>SVG, PDF, PNG, JPG, WebP — max 10 Mo</span>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-red-600 flex items-center gap-1.5">
          <XCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
