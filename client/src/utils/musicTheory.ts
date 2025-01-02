export const SCALES = {
  major: ["C", "D", "E", "F", "G", "A", "B"],
  minor: ["C", "D", "Eb", "F", "G", "Ab", "Bb"],
  pentatonic: ["C", "D", "E", "G", "A"],
  dorian: ["C", "D", "Eb", "F", "G", "A", "Bb"],
  mixolydian: ["C", "D", "E", "F", "G", "A", "Bb"],
};

export const MOODS = {
  happy: {
    scale: "major",
    chordProgressions: [
      [1, 4, 5, 1], // I-IV-V-I
      [1, 6, 4, 5], // I-vi-IV-V
      [1, 5, 6, 4], // I-V-vi-IV
    ],
    rhythmPatterns: [
      ["8n", "8n", "4n", "8n", "8n", "4n"],
      ["4n", "8n", "8n", "4n"],
      ["8n", "8n", "8n", "8n", "4n"],
    ],
    tempo: { min: 120, max: 140 },
    velocity: { min: 0.6, max: 0.8 },
  },
  sad: {
    scale: "minor",
    chordProgressions: [
      [1, 6, 4, 5], // i-vi-iv-v
      [6, 4, 1, 5], // vi-iv-i-v
      [1, 4, 6, 5], // i-iv-vi-v
    ],
    rhythmPatterns: [
      ["2n", "2n"],
      ["2n.", "4n"],
      ["4n", "4n", "2n"],
    ],
    tempo: { min: 60, max: 80 },
    velocity: { min: 0.4, max: 0.6 },
  },
  energetic: {
    scale: "mixolydian",
    chordProgressions: [
      [1, 7, 4, 5],
      [1, 4, 7, 5],
      [1, 5, 7, 4],
    ],
    rhythmPatterns: [
      ["16n", "16n", "8n", "16n", "16n", "8n"],
      ["8n", "8n", "8n", "8n", "16n", "16n", "8n"],
      ["8t", "8t", "8t", "4n"],
    ],
    tempo: { min: 140, max: 180 },
    velocity: { min: 0.7, max: 0.9 },
  },
  calm: {
    scale: "pentatonic",
    chordProgressions: [
      [1, 4, 5, 4],
      [1, 6, 4, 5],
      [4, 1, 5, 4],
    ],
    rhythmPatterns: [
      ["2n", "2n"],
      ["4n", "4n", "2n"],
      ["2n.", "4n"],
    ],
    tempo: { min: 70, max: 90 },
    velocity: { min: 0.3, max: 0.5 },
  },
  mysterious: {
    scale: "dorian",
    chordProgressions: [
      [1, 7, 6, 5],
      [1, 2, 7, 6],
      [2, 7, 1, 6],
    ],
    rhythmPatterns: [
      ["4n", "8n", "4n", "8n"],
      ["8n", "4n.", "4n"],
      ["4n", "8n", "8n", "2n"],
    ],
    tempo: { min: 90, max: 110 },
    velocity: { min: 0.4, max: 0.7 },
  },
};

export const generateNoteInScale = (
  rootNote: string,
  scale: string[],
  octave: number
): string[] => {
  return scale.map((note) => `${note}${octave}`);
};
