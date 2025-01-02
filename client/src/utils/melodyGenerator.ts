import * as Tone from "tone";
import { MOODS, SCALES, generateNoteInScale } from "./musicTheory";
import { MoodKey, MusicEvent } from "@/types/types";

export class MelodyGenerator {
  private mood: MoodKey;
  private octave: number;
  private rootNote: string;

  constructor(mood: MoodKey, octave = 4, rootNote = "C") {
    this.mood = mood;
    this.octave = octave;
    this.rootNote = rootNote;
  }

  private getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getScaleNotes(): string[] {
    const moodConfig = MOODS[this.mood];
    const scale = SCALES[moodConfig.scale as keyof typeof SCALES];
    return generateNoteInScale(this.rootNote, scale, this.octave);
  }

  private generateChord(degree: number, scale: string[]): string[] {
    const root = scale[(degree - 1) % scale.length];
    const third = scale[(degree + 1) % scale.length];
    const fifth = scale[(degree + 3) % scale.length];
    return [root, third, fifth];
  }

  private createMelodyPattern(scale: string[], length: number): string[] {
    const pattern: string[] = [];
    const moodConfig = MOODS[this.mood];

    for (let i = 0; i < length; i++) {
      if (Math.random() < 0.3) {
        const chordTones = this.generateChord(1, scale);
        pattern.push(this.getRandomFromArray(chordTones));
      } else {
        pattern.push(this.getRandomFromArray(scale));
      }
    }

    return pattern;
  }

  generateMelody(): MusicEvent[] {
    const moodConfig = MOODS[this.mood];
    const scale = this.getScaleNotes();
    const melody: MusicEvent[] = [];
    let currentTime = 0;

    const chordProgression = this.getRandomFromArray(
      moodConfig.chordProgressions
    );
    const rhythmPattern = this.getRandomFromArray(moodConfig.rhythmPatterns);

    chordProgression.forEach((degree) => {
      const chord = this.generateChord(degree, scale);
      melody.push({
        note: chord,
        duration: "2n",
        time: currentTime,
        velocity: this.getRandomFromArray([0.7, 0.75, 0.8]),
      });

      const melodyPattern = this.createMelodyPattern(scale, 4);
      melodyPattern.forEach((note, index) => {
        const rhythmValue = rhythmPattern[index % rhythmPattern.length];
        const noteTime = currentTime + index * Tone.Time("8n").toSeconds();

        melody.push({
          note,
          duration: rhythmValue,
          time: noteTime,
          velocity:
            Math.random() *
              (moodConfig.velocity.max - moodConfig.velocity.min) +
            moodConfig.velocity.min,
        });
      });

      currentTime += Tone.Time("2n").toSeconds();
    });

    return melody;
  }

  addVariation(originalMelody: MusicEvent[]): MusicEvent[] {
    return originalMelody.map((note) => {
      if (Math.random() < 0.3) {
        const scale = this.getScaleNotes();
        return {
          ...note,
          note: Array.isArray(note.note)
            ? this.generateChord(1, scale)
            : this.getRandomFromArray(scale),
          velocity: Math.random() * 0.3 + 0.5,
        };
      }
      return note;
    });
  }
}
