'use client';

import type { TemplateProps } from './types';
import { W, H, TAB, TOP, BOT, FACE_Y, FACE_H, CX, PictoVerre, PictoRecyclage, PictoPoubelle, EyeMarks } from './shared';

/**
 * TemplateMinimaliste — Péra style
 * 
 * Top: Picto Verre (left), "Sucre..." (center left), Picto Poubelle (right)
 * Middle: Logo (left), Contact info (right)
 * Bottom: Address (centered)
 */
export const TemplateMinimaliste: React.FC<TemplateProps> = ({
  logoUrl,
  colors = [],
  establishmentName,
  slogan,
  weightGrams = '4',
  address,
  className,
}) => {
  const primary = colors[0] || '#991b1b';

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <rect width={W} height={H} fill="#FFFFFF" />
      <rect x={TAB} y="0" width={W - TAB * 2} height={H} fill="none" stroke="#666" strokeWidth="0.5" />

      {/* Tabs / Eyemarks */}
      <rect x="0" y="0" width={TAB} height={H} fill="#FFFFFF" />
      <line x1={TAB} y1="0" x2={TAB} y2={H} stroke="#666" strokeWidth="0.5" />
      <EyeMarks colors={[primary]} />

      {/* ═══ BANDE SUPÉRIEURE ═══ */}
      <line x1={TAB} y1={TOP} x2={W - TAB} y2={TOP} stroke="#666" strokeWidth="0.5" />
      
      <PictoVerre x={TAB + 25} y={14} color={primary} />
      
      <text
        x={CX - 50} y={TOP / 2 + 5}
        textAnchor="middle"
        fontFamily="'Century Gothic', 'Helvetica Neue', sans-serif"
        fontSize="12" fill={primary} letterSpacing="0.5"
      >
        {`Sucre - Sugar - Suiker - Zucker - ${weightGrams} gr`}
      </text>

      <g transform={`translate(${W - TAB - 95}, 14)`}>
        <PictoRecyclage x={0} y={0} color={primary} />
        <PictoPoubelle x={35} y={0} color={primary} />
      </g>

      {/* ═══ FACE PRINCIPALE ═══ */}
      {logoUrl ? (
        <image
          href={logoUrl}
          x={61}
          y={FACE_Y + 20}
          width="180"
          height="80"
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <text
          x={151} y={FACE_Y + FACE_H / 2 + 6}
          textAnchor="middle"
          fontFamily="'Playfair Display', serif"
          fontSize="26" fontWeight="400" letterSpacing="1"
          fill={primary}
        >
          {establishmentName || 'Péra'}
        </text>
      )}

      {/* Contact Info (Right Side) */}
      <g transform={`translate(${409}, ${FACE_Y + FACE_H / 2 - 10})`}>
        {/* Phone icon approx */}
        <circle cx="-50" cy="-4" r="5" fill="none" stroke={primary} strokeWidth="1" />
        <text
          x="-40" y="0"
          textAnchor="start"
          fontFamily="'Century Gothic', 'Helvetica Neue', sans-serif"
          fontSize="12" fill={primary}
        >
          01 43 77 16 89
        </text>
        <line x1="-55" y1="5" x2="60" y2="5" stroke={primary} strokeWidth="1" />
        <text
          x="-40" y="18"
          textAnchor="start"
          fontFamily="'Century Gothic', 'Helvetica Neue', sans-serif"
          fontSize="10" fill={primary}
        >
          {slogan || 'Café-Restaurant-Event'}
        </text>
      </g>


      {/* ═══ BANDE INFÉRIEURE ═══ */}
      <line x1={TAB} y1={H - BOT} x2={W - TAB} y2={H - BOT} stroke="#666" strokeWidth="0.5" />
      
      <text
        x={CX} y={H - BOT + 28}
        textAnchor="middle"
        fontFamily="'Century Gothic', 'Helvetica Neue', sans-serif"
        fontSize="12" fill={primary} letterSpacing="0.5"
      >
        {address || '2 rue de la Basse Quinte - 94000 Créteil'}
      </text>
    </svg>
  );
};
