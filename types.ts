export interface Breed {
  id: string;
  name: string;
  color: string;
  imageUrl: string;
}

export interface GeneratedImage {
  url: string;
  breed1: Breed;
  breed2: Breed;
}

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';