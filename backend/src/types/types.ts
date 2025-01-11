import { RowDataPacket, OkPacket } from "mysql2";

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

export interface User extends RowDataPacket {
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

export interface CompositionVersion {
  id: number;
  compositionId: number;
  version: number;
  changes: {
    mood?: string;
    tempo?: number;
    instrument?: string;
    melody?: string;
  };
  createdAt: Date;
  createdBy: string;
}
