'use client';

import type { TemplateProps } from './types';
import { W, H, TAB, TOP, BOT, FACE_Y, FACE_H, CX, PictoVerre, PictoRecyclage, PictoPoubelle, EyeMarks } from './shared';

/**
 * TemplateBandeau — Mon Chalet Grill style (with QR)
 * 
 * Top: Picto Verre (left), Pictos (right)
 * Middle: Logo + Name (left), QR Code (right)
 * Bottom: Phone/Social (top line), "Sucre..." (bottom line)
 */
export const TemplateBandeau: React.FC<TemplateProps> = ({
  logoUrl,
  colors = [],
  establishmentName,
  slogan,
  weightGrams = '4',
  className,
}) => {
  const primary = colors[0] || '#c19a5b';

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
      
      <PictoVerre x={TAB + 25} y={14} color="#1A1A1A" />
      
      <g transform={`translate(${W - TAB - 95}, 14)`}>
        <PictoRecyclage x={0} y={0} color="#1A1A1A" />
        <PictoPoubelle x={35} y={0} color="#1A1A1A" />
      </g>

      {/* ═══ FACE PRINCIPALE ═══ */}
      {/* Left side: Logo + Name */}
      <g transform={`translate(${151}, ${FACE_Y + FACE_H / 2})`}>
        {logoUrl ? (
          <image
            href={logoUrl}
            x="-100"
            y="-35"
            width="200"
            height="70"
            preserveAspectRatio="xMidYMid meet"
          />
        ) : (
          <>
            {slogan && (
              <text
                x="0" y="-12"
                textAnchor="middle"
                fontFamily="'Century Gothic', sans-serif"
                fontSize="10" fill="#1A1A1A"
              >
                {slogan}
              </text>
            )}
            <text
              x="0" y="5"
              textAnchor="middle"
              fontFamily="'Playfair Display', serif"
              fontSize="20" fontWeight="700" letterSpacing="1"
              fill="#1A1A1A"
            >
              {(establishmentName || 'MON ÉTABLISSEMENT').toUpperCase()}
            </text>
          </>
        )}
      </g>

      {/* Right side: QR Code Placeholder */}
      <g transform={`translate(${385}, ${FACE_Y + (FACE_H - 48) / 2})`}>
        <rect x="0" y="0" width="48" height="48" fill="#1A1A1A" />
        <rect x="2" y="2" width="44" height="44" fill="#FFFFFF" />
        <rect x="6" y="6" width="10" height="10" fill="#1A1A1A" />
        <rect x="32" y="6" width="10" height="10" fill="#1A1A1A" />
        <rect x="6" y="32" width="10" height="10" fill="#1A1A1A" />
        {/* Some random QR pixels */}
        <rect x="20" y="6" width="4" height="4" fill="#1A1A1A" />
        <rect x="26" y="10" width="4" height="4" fill="#1A1A1A" />
        <rect x="18" y="22" width="12" height="12" fill="#1A1A1A" />
        <rect x="34" y="28" width="4" height="4" fill="#1A1A1A" />
        <rect x="26" y="36" width="4" height="4" fill="#1A1A1A" />
        <rect x="10" y="20" width="4" height="4" fill="#1A1A1A" />
      </g>

      {/* ═══ BANDE INFÉRIEURE ═══ */}
      <line x1={TAB} y1={H - BOT} x2={W - TAB} y2={H - BOT} stroke="#666" strokeWidth="0.5" />
      
      {/* Phone / Instagram line */}
      <g transform={`translate(${CX}, ${H - BOT + 18})`}>
        {/* Phone */}
        <circle cx="-60" cy="-3" r="6" fill={primary} />
        <path d="M-62,-5 L-58,-1" stroke="#fff" strokeWidth="1.5" />
        <text
          x="-50" y="0"
          textAnchor="start"
          fontFamily="'Century Gothic', sans-serif"
          fontSize="10" fontWeight="600" fill="#1A1A1A"
        >
          01 23 45 67 89
        </text>

        {/* Instagram */}
        <circle cx="20" cy="-3" r="6" fill={primary} />
        <rect x="17.5" y="-5.5" width="5" height="5" rx="1" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="20" cy="-3" r="1" fill="#fff" />
        <text
          x="30" y="0"
          textAnchor="start"
          fontFamily="'Century Gothic', sans-serif"
          fontSize="10" fontWeight="600" fill="#1A1A1A"
        >
          @monetablissement
        </text>
      </g>

      {/* "Sucre..." line */}
      <text
        x={CX} y={H - BOT + 40}
        textAnchor="middle"
        fontFamily="'Century Gothic', sans-serif"
        fontSize="11" fill="#1A1A1A" letterSpacing="0.5"
      >
        {`Sucre - Sugar - Suiker - Zucker - ${weightGrams} gr`}
      </text>
    </svg>
  );
};
