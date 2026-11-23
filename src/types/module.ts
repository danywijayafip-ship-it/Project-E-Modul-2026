export type Offering =
  | 'Offering A2A'
  | 'Offering A2B'
  | 'Offering A2C'
  | 'Offering A2D'
  | 'Offering A2E';

export type MediaFormat =
  | 'Heyzine Flipbook'
  | 'Canva Interactive'
  | 'PDF Interaktif'
  | 'HTML5 / Web'
  | 'ZIP Paket Belajar';

export type ReviewStatus =
  | 'Layak Publikasi'
  | 'Dalam Tinjauan'
  | 'Revisi Minor';

export interface EModuleItem {
  id: string;
  title: string;
  description: string;
  learningObjectives: string[];
  chapters: string[];
  authorName: string;
  nim: string;
  offering: Offering;
  topic: string;
  format: MediaFormat;
  targetAudience: string;
  coverColor: string;
  status: ReviewStatus;
  rubricScore: number;
  externalUrl?: string;
  fileName?: string;
  fileSizeLabel?: string;
  fileUrl?: string;
  submittedAt: string;
  likes: number;
}

export interface SubmitModulePayload {
  authorName: string;
  nim: string;
  offering: Offering;
  format: MediaFormat;
  topic: string;
  targetAudience: string;
  title: string;
  description: string;
  externalUrl?: string;
  fileName?: string;
  fileSizeLabel?: string;
  fileContentBase64?: string;
  isOriginal: boolean;
}
