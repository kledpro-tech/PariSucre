'use client';

import type { TemplateProps } from './types';
import { W, H, TAB, TOP, BOT, FACE_Y, FACE_H, CX, PictoVerre, PictoRecyclage, PictoPoubelle, EyeMarks } from './shared';

/**
 * TemplatePrestige — Le Sévigné / Le Celtic style
 * 
 * Full colored background in the printable area. White text.
 * Top: "Sucre..."
 * Middle: Name (large), Slogan in white pill
 * Bottom: Pictos
 */
export const TemplatePrestige: React.FC<TemplateProps> = ({
  logoUrl,
  colors = [],
  establishmentName,
  slogan,
  weightGrams = '4',
  className,
}) => {
  const primary = colors[0] || '#991b1b'; // Default deep red

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      <rect width={W} height={H} fill="#FFFFFF" />
      
      {/* Printable Area Background */}
      <rect x={TAB} y="0" width={W - TAB * 2} height={H} fill={primary} />

      {/* Tabs / Eyemarks */}
      <line x1={TAB} y1="0" x2={TAB} y2={H} stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
      <EyeMarks colors={[primary]} />

      {/* ═══ BANDE SUPÉRIEURE ═══ */}
      <line x1={TAB} y1={TOP} x2={W - TAB} y2={TOP} stroke="#FFFFFF" strokeWidth="0.5" opacity="0.5" />
      <text
        x={CX} y={TOP / 2 + 5}
        textAnchor="middle"
        fontFamily="'Century Gothic', 'Helvetica Neue', sans-serif"
        fontSize="12" fill="#FFFFFF" letterSpacing="0.5"
      >
        {`Sucre - Sugar - Suiker - Zucker - ${weightGrams} gr`}
      </text>

      {/* ═══ FACE PRINCIPALE ═══ */}
      {logoUrl ? (
        <image
          href={logoUrl}
          x={CX - 70}
          y={FACE_Y + 15}
          width="140"
          height="80"
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'brightness(0) invert(1)' }} // Force white logo if possible
        />
      ) : (
        <text
          x={CX} y={FACE_Y + FACE_H / 2 - 2}
          textAnchor="middle"
          fontFamily="'Arial Black', sans-serif"
          fontSize="26" fontWeight="900" letterSpacing="1"
          fill="#FFFFFF"
        >
          {(establishmentName || 'VOTRE ÉTABLISSEMENT').toUpperCase()}
        </text>
      )}

      {/* Slogan Pill */}
      {slogan && (
        <g transform={`translate(${CX}, ${FACE_Y + FACE_H - 15})`}>
          <rect x="-110" y="-12" width="220" height="20" rx="4" fill="#FFFFFF" />
          <text
            x="0" y="3"
            textAnchor="middle"
            fontFamily="'Century Gothic', 'Helvetica Neue', sans-serif"
            fontSize="10" fontWeight="700" letterSpacing="2"
            fill={primary}
          >
            {slogan.toUpperCase()}
          </text>
        </g>
      )}

      {/* ═══ BANDE INFÉRIEURE ═══ */}
      <line x1={TAB} y1={H - BOT} x2={W - TAB} y2={H - BOT} stroke="#FFFFFF" strokeWidth="0.5" opacity="0.5" />

      {/* Pictos (White) */}
      <PictoVerre x={TAB + 25} y={H - BOT + 14} color="#FFFFFF" />
      
      <g transform={`translate(${W - TAB - 95}, ${H - BOT + 16})`}>
        <PictoRecyclage x={0} y={0} color="#FFFFFF" />
        <PictoPoubelle x={35} y={0} color="#FFFFFF" />
      </g>
    </svg>
  );
};
