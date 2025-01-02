import * as Tone from "tone";
import { MOODS, SCALES, generateNoteInScale } from "./musicTheory";

interface MelodyNote {
  note: string | string[];
  duration: string;
  time: number;
  velocity: number;
}

export class MelodyGenerator {
  private mood: string;
  private octave: number;
  private rootNote: string;

  constructor(mood: string, octave = 4, rootNote = "C") {
    this.mood = mood;
    this.octave = octave;
    this.rootNote = rootNote;
  }

  private getRandomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private getScaleNotes(): string[] {
    const moodConfig = MOODS[this.mood as keyof typeof MOODS];
    const scale = SCALES[moodConfig.scale as keyof typeof SCALES];
    return generateNoteInScale(this.rootNote, scale, this.octave);
  }

  private generateChord(degree: number, scale: string[]): string[] {
    // Create triads (1-3-5)
    const root = scale[(degree - 1) % scale.length];
    const third = scale[(degree + 1) % scale.length];
    const fifth = scale[(degree + 3) % scale.length];
    return [root, third, fifth];
  }

  private createMelodyPattern(scale: string[], length: number): string[] {
    const pattern: string[] = [];
    const moodConfig = MOODS[this.mood as keyof typeof MOODS];

    for (let i = 0; i < length; i++) {
      // Use weighted random selection based on mood
      if (Math.random() < 0.3) {
        // Use chord tones more frequently
        const chordTones = this.generateChord(1, scale);
        pattern.push(this.getRandomFromArray(chordTones));
      } else {
        // Use scale tones
        pattern.push(this.getRandomFromArray(scale));
      }
    }

    return pattern;
  }

  generateMelody(): MelodyNote[] {
    const moodConfig = MOODS[this.mood as keyof typeof MOODS];
    const scale = this.getScaleNotes();
    const melody: MelodyNote[] = [];
    let currentTime = 0;

    // Get random chord progression and rhythm pattern for this mood
    const chordProgression = this.getRandomFromArray(
      moodConfig.chordProgressions
    );
    const rhythmPattern = this.getRandomFromArray(moodConfig.rhythmPatterns);

    // Generate for each chord in the progression
    chordProgression.forEach((degree) => {
      // Add the chord
      const chord = this.generateChord(degree, scale);
      melody.push({
        note: chord,
        duration: "2n",
        time: currentTime,
        velocity: this.getRandomFromArray([0.7, 0.75, 0.8]),
      });

      // Add melodic pattern over the chord
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

  // Add variation to an existing melody
  addVariation(originalMelody: MelodyNote[]): MelodyNote[] {
    return originalMelody.map((note) => {
      if (Math.random() < 0.3) {
        // 30% chance of variation
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
