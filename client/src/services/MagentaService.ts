import * as mm from "@magenta/music";
import * as Tone from "tone";
import { MoodKey, MusicEvent } from "@/types/types";

export class MagentaService {
  private model: mm.MusicVAE;
  private initialized: boolean = false;

  private moodScales = {
    happy: ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"],
    sad: ["A3", "C4", "D4", "E4", "F4", "G4", "A4"],
    energetic: ["C4", "D4", "E4", "F#4", "G4", "A4", "B4", "C5"],
    calm: ["G3", "Bb3", "C4", "D4", "Eb4", "F4", "G4"],
    mysterious: ["D4", "F4", "G4", "Ab4", "C5"],
  };

  constructor() {
    this.model = new mm.MusicVAE(
      "https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/multitrack"
    );
  }

  async initialize(): Promise<void> {
    if (!this.initialized) {
      await this.model.initialize();
      this.initialized = true;
    }
  }

  async generateMelody(mood: MoodKey): Promise<MusicEvent[]> {
    if (!this.initialized) {
      throw new Error("MagentaService not initialized");
    }

    try {
      // Add temperature for more variation (0.5-2.0)
      const temperature = 1.2;
      const samples = await this.model.sample(1, temperature);
      const sequence = samples[0];

      if (!sequence?.notes) return [];

      // Get scale for current mood
      const scale = this.moodScales[mood];

      return sequence.notes
        .filter((note) => typeof note.pitch === "number")
        .map((note) => {
          // Map MIDI pitch to scale note
          const scaleIndex = note.pitch % scale.length;
          const mappedNote = scale[scaleIndex];

          return {
            note: mappedNote,
            duration: "8n",
            time: note.startTime ?? 0,
            velocity:
              (note.velocity ? note.velocity / 127 : 0.8) *
              (mood === "energetic" ? 1.2 : mood === "calm" ? 0.8 : 1),
          };
        });
    } catch (error) {
      console.error("Failed to generate melody:", error);
      return [];
    }
  }

  dispose(): void {
    if (this.initialized) {
      this.model.dispose();
      this.initialized = false;
    }
  }
}
