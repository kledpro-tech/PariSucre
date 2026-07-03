'use client';

import { useState, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  extractedColors: string[];
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
}

const BRAND_SUGGESTIONS = [
  { hex: '#264188', label: 'PariSucre Bleu' },
  { hex: '#cf1b2e', label: 'PariSucre Rouge' },
];

const MAX_COLORS = 5;

function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

export default function ColorPicker({
  extractedColors,
  selectedColors,
  onColorsChange,
}: ColorPickerProps) {
  const [manualHex, setManualHex] = useState('#');

  const toggle = useCallback(
    (hex: string) => {
      const normalised = hex.toLowerCase();
      if (selectedColors.includes(normalised)) {
        onColorsChange(selectedColors.filter((c) => c !== normalised));
      } else if (selectedColors.length < MAX_COLORS) {
        onColorsChange([...selectedColors, normalised]);
      }
    },
    [selectedColors, onColorsChange],
  );

  const addManual = useCallback(() => {
    const hex = manualHex.trim().toLowerCase();
    if (!isValidHex(hex)) return;
    if (selectedColors.includes(hex)) return;
    if (selectedColors.length >= MAX_COLORS) return;
    onColorsChange([...selectedColors, hex]);
    setManualHex('#');
  }, [manualHex, selectedColors, onColorsChange]);

  const remove = useCallback(
    (hex: string) => {
      onColorsChange(selectedColors.filter((c) => c !== hex));
    },
    [selectedColors, onColorsChange],
  );

  return (
    <div className="space-y-8">
      {/* ── Extracted colors ── */}
      {extractedColors.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text mb-3">Couleurs détectées</h4>
          <div className="flex flex-wrap gap-3">
            {extractedColors.map((hex) => {
              const selected = selectedColors.includes(hex.toLowerCase());
              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => toggle(hex)}
                  title={hex}
                  className={cn(
                    'group relative w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110',
                    selected
                      ? 'ring-2 ring-primary ring-offset-2 border-primary shadow-md'
                      : 'border-border hover:border-text-muted',
                  )}
                  style={{ backgroundColor: hex }}
                >
                  {selected && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-white/90 shadow" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Brand suggestions ── */}
      <div>
        <h4 className="text-sm font-semibold text-text mb-3">Couleurs de la marque</h4>
        <div className="flex flex-wrap gap-3">
          {BRAND_SUGGESTIONS.map(({ hex, label }) => {
            const selected = selectedColors.includes(hex.toLowerCase());
            return (
              <button
                key={hex}
                type="button"
                onClick={() => toggle(hex)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-4 py-2.5 border transition-all duration-200',
                  selected
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-text-muted bg-white',
                )}
              >
                <span
                  className={cn(
                    'w-6 h-6 rounded-full border shrink-0',
                    selected ? 'ring-2 ring-primary ring-offset-1 border-primary' : 'border-border',
                  )}
                  style={{ backgroundColor: hex }}
                />
                <div className="text-left">
                  <p className="text-xs font-semibold text-text">{label}</p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider">{hex}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Manual add ── */}
      <div>
        <h4 className="text-sm font-semibold text-text mb-3">Ajouter une couleur</h4>
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-[200px]">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded border border-border"
              style={{ backgroundColor: isValidHex(manualHex) ? manualHex : '#ffffff' }}
            />
            <input
              type="text"
              value={manualHex}
              onChange={(e) => setManualHex(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addManual()}
              placeholder="#000000"
              maxLength={7}
              className="w-full pl-10 pr-3 py-2.5 text-sm rounded-xl border border-border bg-white
                         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                         font-mono tracking-wide transition-all"
            />
          </div>
          <button
            type="button"
            onClick={addManual}
            disabled={!isValidHex(manualHex) || selectedColors.length >= MAX_COLORS}
            className="btn-primary text-sm px-4 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-text-muted mt-2">
          {selectedColors.length}/{MAX_COLORS} couleurs sélectionnées
        </p>
      </div>

      {/* ── Selected list ── */}
      {selectedColors.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-text mb-3">Vos couleurs</h4>
          <div className="flex flex-wrap gap-2">
            {selectedColors.map((hex) => (
              <span
                key={hex}
                className="inline-flex items-center gap-2 bg-bg-subtle border border-border rounded-full pl-2 pr-1 py-1"
              >
                <span className="w-5 h-5 rounded-full border border-border shrink-0" style={{ backgroundColor: hex }} />
                <span className="text-xs font-mono text-text-muted uppercase">{hex}</span>
                <button
                  type="button"
                  onClick={() => remove(hex)}
                  className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
