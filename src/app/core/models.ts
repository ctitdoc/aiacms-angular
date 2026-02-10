export type Feature = 'VIEW' | 'EDIT' | 'XML';

export interface CmsDocument {
  id: string;
  lastModifiedIso: string;
  features: Feature[];
  links: Partial<Record<Feature, string>>;
  kind: string;
}

export interface QueryResult {
  format: 'HTML' | 'XML';
  content: string;
}

export interface ProcessResult {
  id: string;
  title: string;
  links: Array<{ label: string; href: string }>;
  xml?: string;
  html?: string;
}

export interface GenerateCvRequest {
  offerText: string;
  rulesText: string;
}

export interface RestructureRequest {
  rawText: string;
}
