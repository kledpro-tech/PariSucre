'use client';

import type { TemplateProps } from './types';
import { W, H, TAB, TOP, BOT, FACE_Y, FACE_H, CX, PictoVerre, PictoRecyclage, PictoPoubelle, EyeMarks } from './shared';

/**
 * TemplateClassique — Bir Dilim Baklava / Tabac de la Gare style
 * 
 * Top: "Sucre..." centered
 * Middle: Logo (Left) + Text (Right)
 * Bottom: Pictos (Left/Right)
 */
export const TemplateClassique: React.FC<TemplateProps> = ({
  logoUrl,
  colors = [],
  establishmentName,
  slogan,
  weightGrams = '4',
  className,
}) => {
  const primary = colors[0] || '#906d3b'; // Default gold for classic

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
      <text
        x={CX} y={TOP / 2 + 5}
        textAnchor="middle"
        fontFamily="'Century Gothic', 'Helvetica Neue', sans-serif"
        fontSize="12" fill={primary} letterSpacing="0.5"
      >
        {`Sucre - Sugar - Suiker - Zucker - ${weightGrams} gr`}
      </text>

      {/* ═══ FACE PRINCIPALE ═══ */}
      {logoUrl ? (
        <>
          <image
            href={logoUrl}
            x={TAB + 70}
            y={FACE_Y + 15}
            width="130"
            height="80"
            preserveAspectRatio="xMidYMid meet"
          />
          <text
            x={409} y={FACE_Y + FACE_H / 2 + 2}
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="18" fontWeight="700" letterSpacing="1"
            fill={primary}
          >
            {(establishmentName || 'VOTRE ÉTABLISSEMENT').toUpperCase()}
          </text>
          {slogan && (
            <text
              x={409} y={FACE_Y + FACE_H / 2 + 18}
              textAnchor="middle"
              fontFamily="'Brush Script MT', cursive, serif"
              fontSize="16" fill={primary}
            >
              {slogan}
            </text>
          )}
        </>
      ) : (
        <>
          <text
            x={CX} y={FACE_Y + FACE_H / 2 + 6}
            textAnchor="middle"
            fontFamily="'Playfair Display', serif"
            fontSize="24" fontWeight="700" letterSpacing="2"
            fill={primary}
          >
            {(establishmentName || 'VOTRE ÉTABLISSEMENT').toUpperCase()}
          </text>
          {slogan && (
            <text
              x={CX} y={FACE_Y + FACE_H / 2 + 22}
              textAnchor="middle"
              fontFamily="'Brush Script MT', cursive, serif"
              fontSize="18" fill={primary}
            >
              {slogan}
            </text>
          )}
        </>
      )}

      {/* ═══ BANDE INFÉRIEURE ═══ */}
      <line x1={TAB} y1={H - BOT} x2={W - TAB} y2={H - BOT} stroke="#666" strokeWidth="0.5" />

      {/* Pictos */}
      <PictoVerre x={TAB + 25} y={H - BOT + 14} color={primary} />
      
      <g transform={`translate(${W - TAB - 95}, ${H - BOT + 16})`}>
        <PictoRecyclage x={0} y={0} color={primary} />
        <PictoPoubelle x={35} y={0} color={primary} />
      </g>
    </svg>
  );
};
