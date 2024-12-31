import * as Tone from "tone";
import { MoodKey, MusicEvent } from "../types/types";
import { CHORD_PROGRESSIONS, RHYTHM_PATTERNS } from "@/constants/constants";

export const generateChordProgression = (
  scale: string[],
  mood: MoodKey
): string[][] => {
  return CHORD_PROGRESSIONS[mood].map((degree: number) => {
    const chordRoot = scale[degree];
    const third = scale[(degree + 2) % scale.length];
    const fifth = scale[(degree + 4) % scale.length];
    return [chordRoot, third, fifth];
  });
};

export const generateMelody = (
  scale: string[],
  mood: MoodKey
): MusicEvent[] => {
  const chordProgression = generateChordProgression(scale, mood);
  const rhythmPattern = RHYTHM_PATTERNS[mood];
  const melody: MusicEvent[] = [];
  let currentBeat = 0;

  chordProgression.forEach((chord) => {
    // Add chord
    melody.push({
      time: currentBeat,
      note: chord,
      duration: "2n",
      velocity: 0.7,
    });

    // Add melodic pattern
    const numNotes = 4;
    for (let j = 0; j < numNotes; j++) {
      const randomNote = scale[Math.floor(Math.random() * scale.length)];
      const noteTime =
        currentBeat + j * (Tone.Time("2n").toSeconds() / numNotes);

      melody.push({
        time: noteTime,
        note: randomNote,
        duration: rhythmPattern[j % rhythmPattern.length],
        velocity: Math.random() * 0.5 + 0.5,
      });
    }

    currentBeat += Tone.Time("2n").toSeconds();
  });

  return melody;
};
