import * as Tone from "tone";
import { MusicEvent } from "@/types/types";

export const exportToWave = async (
  events: MusicEvent[],
  synth: Tone.Synth | null,
  duration: number
): Promise<void> => {
  if (!synth) return;

  // creating a recorder
  const recorder = new Tone.Recorder();
  synth.connect(recorder);

  //start recording
  await recorder.start();

  // playing the sequence
  const now = Tone.now();
  events.forEach((event, index) => {
    // Default to index * eighth note duration if time is undefined
    const eventTime = event.time ?? index * Tone.Time("8n").toSeconds();

    if (Array.isArray(event.note)) {
      event.note.forEach((note) => {
        synth.triggerAttackRelease(
          note,
          event.duration,
          now + eventTime,
          event.velocity
        );
      });
    } else {
      synth.triggerAttackRelease(
        event.note,
        event.duration,
        now + eventTime,
        event.velocity
      );
    }
  });

  //waiting for the duration of the sequence
  await new Promise((resolve) => setTimeout(resolve, duration * 1000));

  // stopping the recording
  const recording = await recorder.stop();

  // creating downloadable link
  const url = URL.createObjectURL(recording);
  const link = document.createElement("a");
  link.download = "sequence.wav";
  link.href = url;
  link.click();

  //cleanup after everything
  URL.revokeObjectURL(url);
  recorder.dispose();
};
