'use client';

// Shared layout constants for 2D sugar stick templates
// Real unfolded wrapper ≈ 120 mm × 52 mm → viewBox 560 × 224 (ratio 2.5:1)
export const W = 560;
export const H = 224;
export const TAB = 22;
export const TOP = 52;
export const BOT = 52;
export const FACE_Y = TOP;
export const FACE_H = H - TOP - BOT; // 120
export const CX = W / 2;

// Reusable Picto Components

export function PictoVerre({ x, y, color = "#000" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(0.8)`}>
      <path d="M4 2 L4 8 C4 11 7 12 10 12 C13 12 16 11 16 8 L16 2 Z" fill="none" stroke={color} strokeWidth="1.5" />
      <line x1="10" y1="12" x2="10" y2="20" stroke={color} strokeWidth="1.5" />
      <line x1="6" y1="20" x2="14" y2="20" stroke={color} strokeWidth="1.5" />
      <path d="M22 2 L22 10 L26 10 L26 2 Z" fill="none" stroke={color} strokeWidth="1.5" />
      <line x1="24" y1="10" x2="24" y2="20" stroke={color} strokeWidth="1.5" />
      <line x1="22" y1="6" x2="26" y2="6" stroke={color} strokeWidth="1.5" />
    </g>
  );
}

export function PictoRecyclage({ x, y, color = "#000" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(0.8)`}>
      <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M12 6 L10 9 L14 9 Z" fill={color} />
      <path d="M16 16 L13 18 L15 20 Z" fill={color} />
      <path d="M6 14 L8 12 L10 15 Z" fill={color} />
    </g>
  );
}

export function PictoPoubelle({ x, y, color = "#000" }: { x: number; y: number; color?: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(0.8)`}>
      {/* Box */}
      <rect x="0" y="0" width="36" height="18" rx="2" fill="none" stroke={color} strokeWidth="1.2" />
      {/* Stick */}
      <rect x="3" y="4" width="20" height="4" rx="1" transform="rotate(20 13 6)" fill="none" stroke={color} strokeWidth="1" />
      <line x1="6" y1="4" x2="6" y2="8" transform="rotate(20 13 6)" stroke={color} strokeWidth="1" />
      <line x1="20" y1="4" x2="20" y2="8" transform="rotate(20 13 6)" stroke={color} strokeWidth="1" />
      {/* Bin */}
      <rect x="25" y="4" width="8" height="11" rx="1" fill={color} />
      <rect x="24" y="2" width="10" height="1.5" fill={color} />
      <circle cx="29" cy="9" r="2" fill="#fff" />
    </g>
  );
}

// Eye marks (color calibration blocks on the right tab)
export function EyeMarks({ colors }: { colors: string[] }) {
  const primary = colors[0] || '#1A1A1A';
  return (
    <g>
      {colors.map((color, i) => (
        <rect key={i} x={W - 22} y={i * 20} width="22" height="15" fill={color} />
      ))}
      {/* Bottom right mark matches the primary color */}
      <rect x={W - 22} y={H - 25} width="22" height="25" fill={primary} />
    </g>
  );
}
