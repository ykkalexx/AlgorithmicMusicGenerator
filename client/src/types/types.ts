import * as Tone from "tone";

export type SynthType =
  | Tone.Synth
  | Tone.Sampler
  | Tone.FMSynth
  | Tone.MonoSynth;

export type MoodKey = "happy" | "sad" | "energetic" | "calm" | "mysterious";

export interface Mood {
  value: MoodKey;
  label: string;
  scale: string[];
}

export interface InstrumentConfig {
  name: string;
  create: () => SynthType;
}

export interface InstrumentsDict {
  [key: string]: InstrumentConfig;
}

export interface MusicEvent {
  note: string | string[];
  duration: string;
  time?: number;
  velocity?: number;
}

export interface ChordProgressions {
  [key: string]: number[];
}

export interface RhythmPatterns {
  [key: string]: string[];
}

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
