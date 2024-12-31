import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SynthType, MoodKey, MusicEvent } from "@/types/types";
import { MOODS, INSTRUMENTS } from "@/constants/constants";
import { generateMelody } from "@/musicUtils/musicUtils";

const MusicGenerator: React.FC = () => {
  const [mood, setMood] = useState<MoodKey>("happy");
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("synth");
  const [synth, setSynth] = useState<SynthType | null>(null);
  const [sequence, setSequence] = useState<Tone.Part<MusicEvent> | null>(null);

  // Initialize synth when instrument changes
  useEffect(() => {
    const newSynth = INSTRUMENTS[selectedInstrument].create();
    setSynth(newSynth);

    return () => {
      if (synth) {
        synth.dispose();
      }
    };
  }, [selectedInstrument]);

  // Update tempo
  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  const generateMusicSequence = (
    currentMood: MoodKey
  ): Tone.Part<MusicEvent> => {
    const currentScale =
      MOODS.find((m) => m.value === currentMood)?.scale || [];

    if (sequence) {
      sequence.dispose();
    }

    const events = generateMelody(currentScale, currentMood);
    const melodyPart = new Tone.Part((time: number, event: MusicEvent) => {
      if (!synth?.triggerAttackRelease) return;

      if (Array.isArray(event.note)) {
        event.note.forEach((note) => {
          synth.triggerAttackRelease(
            note,
            event.duration,
            time,
            event.velocity ?? 1
          );
        });
      } else {
        synth.triggerAttackRelease(
          event.note,
          event.duration,
          time,
          event.velocity ?? 1
        );
      }
    }, events).start(0);

    melodyPart.loop = true;
    melodyPart.loopEnd = "2m";

    setSequence(melodyPart);
    return melodyPart;
  };

  const handlePlay = async () => {
    await Tone.start();

    if (!isPlaying) {
      const newSequence = generateMusicSequence(mood);
      Tone.Transport.start();
      newSequence.start(0);
    } else {
      Tone.Transport.stop();
      sequence?.stop();
    }

    setIsPlaying(!isPlaying);
  };

  const handleTempoChange = (value: number[]) => {
    setTempo(value[0]);
  };

  const handleInstrumentChange = (value: string) => {
    if (isPlaying) {
      handlePlay(); // Stop playing before changing instrument
    }
    setSelectedInstrument(value);
  };

  const handleMoodChange = (value: string) => {
    if (isPlaying) {
      handlePlay(); // Stop playing before changing mood
    }
    setMood(value as MoodKey);
  };

  return (
    <Card className="w-full max-w-2xl p-6 mx-auto mt-8">
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mood</label>
          <Select value={mood} onValueChange={handleMoodChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              {MOODS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Instrument</label>
          <Select
            value={selectedInstrument}
            onValueChange={handleInstrumentChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select instrument" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INSTRUMENTS).map(([value, inst]) => (
                <SelectItem key={value} value={value}>
                  {inst.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tempo: {tempo} BPM</label>
          <Slider
            value={[tempo]}
            onValueChange={handleTempoChange}
            min={60}
            max={200}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={handlePlay}
            className={`w-32 ${
              isPlaying
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isPlaying ? "Stop" : "Play"}
          </Button>
          <Button className="w-32">Save</Button>
          <Button className="w-32">Export</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicGenerator;
