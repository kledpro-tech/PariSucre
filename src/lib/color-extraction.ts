import type { ColorExtractionResult } from '@/types/configurator';

// ─── TYPES ───────────────────────────────────────────────

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface Cluster {
  centroid: RGB;
  pixels: RGB[];
}

// ─── CONSTANTS ───────────────────────────────────────────

/** Canvas size for sampling (smaller = faster) */
const SAMPLE_SIZE = 128;

/** Number of k-means iterations */
const MAX_ITERATIONS = 10;

/** Number of clusters to target */
const NUM_CLUSTERS = 8;

/** Top N colors to return */
const TOP_COLORS = 5;

/** Brightness thresholds to ignore near-white and near-black */
const BRIGHTNESS_MIN = 30; // ignore very dark (near-black)
const BRIGHTNESS_MAX = 230; // ignore very light (near-white)

/** Minimum saturation to include — filters out grays */
const SATURATION_MIN = 15;

// ─── HELPERS ─────────────────────────────────────────────

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function brightness({ r, g, b }: RGB): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function saturation({ r, g, b }: RGB): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return ((max - min) / max) * 255;
}

function colorDistance(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

function averageColor(pixels: RGB[]): RGB {
  if (pixels.length === 0) return { r: 0, g: 0, b: 0 };

  const sum = pixels.reduce(
    (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
    { r: 0, g: 0, b: 0 },
  );

  return {
    r: sum.r / pixels.length,
    g: sum.g / pixels.length,
    b: sum.b / pixels.length,
  };
}

/**
 * Load an image from a URL onto a canvas and return the pixel data.
 */
function loadImagePixels(imageUrl: string): Promise<RGB[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = SAMPLE_SIZE;
      canvas.height = SAMPLE_SIZE;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Impossible d\'obtenir le contexte 2D du canvas.'));
        return;
      }

      ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      const imageData = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
      const { data } = imageData;

      const pixels: RGB[] = [];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]!;
        const g = data[i + 1]!;
        const b = data[i + 2]!;
        const a = data[i + 3]!;

        // Skip transparent pixels
        if (a < 128) continue;

        const pixel: RGB = { r, g, b };

        // Filter out near-white, near-black, and very desaturated pixels
        const br = brightness(pixel);
        const sat = saturation(pixel);

        if (br < BRIGHTNESS_MIN || br > BRIGHTNESS_MAX) continue;
        if (sat < SATURATION_MIN) continue;

        pixels.push(pixel);
      }

      resolve(pixels);
    };

    img.onerror = () => {
      reject(new Error('Impossible de charger l\'image pour l\'extraction de couleurs.'));
    };

    img.src = imageUrl;
  });
}

/**
 * Simple k-means clustering on RGB pixels.
 */
function kMeansClustering(pixels: RGB[], k: number, maxIterations: number): Cluster[] {
  if (pixels.length === 0) return [];
  if (pixels.length <= k) {
    return pixels.map((p) => ({ centroid: { ...p }, pixels: [p] }));
  }

  // Initialize centroids using evenly-spaced sampling
  const step = Math.floor(pixels.length / k);
  let clusters: Cluster[] = Array.from({ length: k }, (_, i) => ({
    centroid: { ...pixels[i * step]! },
    pixels: [],
  }));

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Clear pixel assignments
    for (const cluster of clusters) {
      cluster.pixels = [];
    }

    // Assign each pixel to nearest centroid
    for (const pixel of pixels) {
      let minDist = Infinity;
      let nearest = clusters[0]!;

      for (const cluster of clusters) {
        const dist = colorDistance(pixel, cluster.centroid);
        if (dist < minDist) {
          minDist = dist;
          nearest = cluster;
        }
      }

      nearest.pixels.push(pixel);
    }

    // Recompute centroids
    let converged = true;
    for (const cluster of clusters) {
      if (cluster.pixels.length === 0) continue;

      const newCentroid = averageColor(cluster.pixels);
      if (colorDistance(newCentroid, cluster.centroid) > 1) {
        converged = false;
      }
      cluster.centroid = newCentroid;
    }

    if (converged) break;
  }

  // Filter out empty clusters
  clusters = clusters.filter((c) => c.pixels.length > 0);

  return clusters;
}

// ─── PUBLIC API ──────────────────────────────────────────

/**
 * Extract dominant colors from an image.
 *
 * Uses Canvas API to sample pixels and a simple k-means clustering
 * algorithm to find the most prominent colors. Ignores near-white,
 * near-black, and desaturated pixels.
 *
 * @param imageUrl — URL of the image (must be accessible, CORS-friendly)
 * @returns Top 5 dominant colors as hex strings + the single dominant color
 */
export async function extractColors(imageUrl: string): Promise<ColorExtractionResult> {
  const pixels = await loadImagePixels(imageUrl);

  // Fallback if not enough colorful pixels were found
  if (pixels.length < 5) {
    return {
      colors: ['#264188', '#cf1b2e', '#1a2d5c', '#888888', '#f5f5f5'],
      dominantColor: '#264188',
    };
  }

  const clusters = kMeansClustering(pixels, NUM_CLUSTERS, MAX_ITERATIONS);

  // Sort clusters by population (most pixels first = most dominant)
  clusters.sort((a, b) => b.pixels.length - a.pixels.length);

  // Take top N and convert to hex
  const topClusters = clusters.slice(0, TOP_COLORS);
  const colors = topClusters.map((c) => rgbToHex(c.centroid));

  // Ensure we always return exactly TOP_COLORS colors
  const fallbackColors = ['#264188', '#cf1b2e', '#1a2d5c', '#888888', '#f5f5f5'];
  while (colors.length < TOP_COLORS) {
    colors.push(fallbackColors[colors.length]!);
  }

  return {
    colors,
    dominantColor: colors[0]!,
  };
}
