import {
  Mood,
  ChordProgressions,
  RhythmPatterns,
  InstrumentsDict,
} from "../types/types";
import * as Tone from "tone";

export const MOODS: Mood[] = [
  {
    value: "happy",
    label: "Happy",
    scale: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
  },
  {
    value: "sad",
    label: "Sad",
    scale: ["A3", "C4", "D4", "E4", "F4", "G4", "A4"],
  },
  {
    value: "energetic",
    label: "Energetic",
    scale: ["E4", "F#4", "G#4", "A4", "B4", "C#5", "D#5", "E5"],
  },
  {
    value: "calm",
    label: "Calm",
    scale: ["G3", "A3", "C4", "D4", "E4", "G4", "A4"],
  },
  {
    value: "mysterious",
    label: "Mysterious",
    scale: ["D4", "Eb4", "F4", "Ab4", "Bb4", "C5", "D5"],
  },
];

export const CHORD_PROGRESSIONS: ChordProgressions = {
  happy: [0, 5, 3, 4], // I-VI-IV-V
  sad: [5, 3, 0, 4], // VI-IV-I-V
  energetic: [0, 4, 5, 3], // I-V-VI-IV
  calm: [0, 3, 4, 0], // I-IV-V-I
  mysterious: [5, 1, 2, 3], // VI-II-III-IV
};

export const RHYTHM_PATTERNS: RhythmPatterns = {
  happy: ["8n", "8n", "4n", "8n", "8n", "4n"],
  sad: ["4n", "4n", "2n"],
  energetic: ["16n", "16n", "8n", "16n", "16n", "8n"],
  calm: ["2n", "2n"],
  mysterious: ["8n", "4n", "8n", "4n"],
};

export const INSTRUMENTS: InstrumentsDict = {
  synth: {
    name: "Synthesizer",
    create: () =>
      new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.1,
          decay: 0.2,
          sustain: 0.3,
          release: 0.8,
        },
      }).toDestination(),
  },
  piano: {
    name: "Piano",
    create: () =>
      new Tone.Sampler({
        urls: {
          C4: "C4.mp3",
        },
        baseUrl: "/piano-samples/",
      }).toDestination(),
  },
  strings: {
    name: "Strings",
    create: () =>
      new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        envelope: {
          attack: 0.2,
          decay: 0.3,
          sustain: 0.4,
          release: 1,
        },
      }).toDestination(),
  },
  bass: {
    name: "Bass",
    create: () =>
      new Tone.MonoSynth({
        oscillator: { type: "square" },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.4,
          release: 0.8,
        },
      }).toDestination(),
  },
};
