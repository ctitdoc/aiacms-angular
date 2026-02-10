// Features connues (mais on tolère aussi des tokens inconnus vus dans les données)
export type Feature =
  | 'VIEW' | 'EDIT' | 'XML'
  | 'MARKDOWN' | 'RESUME' | 'ARTURIA' | 'SKATELECTRIQUE' | 'TEXTILE' | 'PDF'
  | (string & {}); // fallback pour tokens inattendus

export type ActionKey =
  | 'VIEW' | 'EDIT' | 'XML'
  | 'MARKDOWN'
  | 'RESUME' | 'RESUME/PDF'
  | 'ARTURIA PAGE' | 'SKATELECTRIQUE PAGE'
  | 'TEXTILE' | 'PDF'
  | (string & {}); // fallback

export interface CmsDocument {
  id: string;
  kind: string;
  lastModifiedIso: string;
  features: Feature[];
  actions: Partial<Record<ActionKey, string>>;
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
