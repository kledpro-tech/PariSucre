export interface TemplateProps {
  /** URL of the uploaded logo */
  logoUrl?: string;
  /** Extracted or selected colors */
  colors?: string[];
  /** Name of the establishment */
  establishmentName?: string;
  /** Slogan (optional) */
  slogan?: string;
  /** Legal mentions (optional) */
  legalMentions?: string;
  /** Weight in grams (default: 5g) */
  weightGrams?: string;
  /** Address to display (client or PariSucre) */
  address?: string;
  /** Type of sugar (e.g. Sucre pur canne) */
  sugarType?: string;
  /** If true, renders the template ready for export (no UI wrapper) */
  isExport?: boolean;
  /** Additional class names */
  className?: string;
}

export interface ConfiguratorState extends TemplateProps {
  templateSlug: string;
}

export type FileQuality = 'excellent' | 'good' | 'warning' | 'poor';

export interface FileValidationResult {
  isValid: boolean;
  quality: FileQuality;
  message: string;
  isVector: boolean;
  fileType: string;
  fileSizeBytes: number;
  width?: number;
  height?: number;
}

export interface ColorExtractionResult {
  colors: string[];
  dominantColor: string;
}
