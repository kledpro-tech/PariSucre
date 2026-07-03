import type { FileValidationResult, FileQuality } from '@/types/configurator';
import {
  ACCEPTED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  MIN_RESOLUTION_WARNING,
  MIN_RESOLUTION_BLOCKING,
} from '@/lib/constants';

// ─── HELPERS ─────────────────────────────────────────────

function isVectorMime(mimeType: string): boolean {
  return mimeType === 'image/svg+xml' || mimeType === 'application/pdf';
}

function assessQuality(width: number, height: number): FileQuality {
  const minDim = Math.min(width, height);

  if (minDim >= 1000) return 'excellent';
  if (minDim >= 500) return 'good';
  if (minDim >= 300) return 'warning';
  return 'poor';
}

function qualityMessage(quality: FileQuality, width?: number, height?: number): string {
  switch (quality) {
    case 'excellent':
      return `Excellente qualité (${width}×${height} px). Le rendu sera optimal.`;
    case 'good':
      return `Bonne qualité (${width}×${height} px). Le rendu sera correct.`;
    case 'warning':
      return `Résolution faible (${width}×${height} px). Le rendu final pourrait être pixelisé.`;
    case 'poor':
      return `Résolution insuffisante (${width}×${height} px). Veuillez fournir une image de meilleure qualité.`;
  }
}

/**
 * Load an image from a File and return its natural dimensions.
 * Works only in browser environments (uses HTMLImageElement).
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Impossible de charger l\'image pour vérifier ses dimensions.'));
    };

    img.src = url;
  });
}

// ─── PUBLIC API ──────────────────────────────────────────

/**
 * Validate an uploaded file for logo use.
 *
 * Checks:
 * 1. MIME type is in the accepted list
 * 2. File size ≤ 10 MB
 * 3. For raster images: dimensions ≥ 150×150 px (blocking), ≥ 300×300 px (warning)
 * 4. Quality assessment: excellent / good / warning / poor
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
  const mimeType = file.type;
  const fileSizeBytes = file.size;
  const fileType = ACCEPTED_MIME_TYPES[mimeType];

  // 1. Check MIME type
  if (!fileType) {
    const accepted = Object.values(ACCEPTED_MIME_TYPES).join(', ');
    return {
      isValid: false,
      quality: 'poor',
      message: `Format non supporté (${mimeType || 'inconnu'}). Formats acceptés : ${accepted}.`,
      isVector: false,
      fileType: mimeType || 'unknown',
      fileSizeBytes,
    };
  }

  // 2. Check file size
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    const maxMB = MAX_FILE_SIZE_BYTES / (1024 * 1024);
    const fileMB = (fileSizeBytes / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      quality: 'poor',
      message: `Fichier trop volumineux (${fileMB} Mo). Taille maximale : ${maxMB} Mo.`,
      isVector: isVectorMime(mimeType),
      fileType,
      fileSizeBytes,
    };
  }

  // 3. Vector files — no dimension check needed
  if (isVectorMime(mimeType)) {
    return {
      isValid: true,
      quality: 'excellent',
      message: 'Fichier vectoriel détecté — qualité optimale garantie.',
      isVector: true,
      fileType,
      fileSizeBytes,
    };
  }

  // 4. Raster images — check dimensions
  try {
    const { width, height } = await getImageDimensions(file);
    const minDim = Math.min(width, height);

    // Blocking threshold
    if (minDim < MIN_RESOLUTION_BLOCKING) {
      return {
        isValid: false,
        quality: 'poor',
        message:
          `Résolution insuffisante (${width}×${height} px). ` +
          `Minimum requis : ${MIN_RESOLUTION_BLOCKING}×${MIN_RESOLUTION_BLOCKING} px.`,
        width,
        height,
        isVector: false,
        fileType,
        fileSizeBytes,
      };
    }

    const quality = assessQuality(width, height);

    return {
      isValid: true,
      quality,
      message: qualityMessage(quality, width, height),
      width,
      height,
      isVector: false,
      fileType,
      fileSizeBytes,
    };
  } catch {
    // If we can't read dimensions, allow the file but warn
    return {
      isValid: true,
      quality: 'warning',
      message: 'Impossible de vérifier les dimensions de l\'image. Le rendu pourrait être pixelisé.',
      isVector: false,
      fileType,
      fileSizeBytes,
    };
  }
}
