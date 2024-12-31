export interface Composition {
  id: number;
  userId: string;
  name: string;
  mood: string;
  tempo: number;
  instrument: string;
  melody: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  sessionId: string;
  createdAt: Date;
}

export interface ApiError extends Error {
  statusCode?: number;
}

export interface SaveCompositionDto {
  name: string;
  mood: string;
  tempo: number;
  instrument: string;
  melody: string;
}
