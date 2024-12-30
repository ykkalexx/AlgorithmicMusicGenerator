import { useState, useEffect } from "react";
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
import { moods } from "@/constants/constants";
import * as Tone from "tone";

type SynthType = Tone.Synth | Tone.Sampler | Tone.FMSynth | Tone.MonoSynth;
type SequenceType = Tone.Sequence<string>;

interface InstrumentConfig {
  name: string;
  create: () => SynthType;
}

interface InstrumentsDict {
  [key: string]: InstrumentConfig;
}

const MusicGenerator = () => {
  const [mood, setMood] = useState("happy");
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("synth");
  const [synth, setSynth] = useState<SynthType | null>(null);
  const [sequence, setSequence] = useState<SequenceType | null>(null);

  const instruments: InstrumentsDict = {
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

  // init tonejs and synth
  useEffect(() => {
    const newSynth = instruments[selectedInstrument].create();
    setSynth(newSynth);

    return () => {
      if (synth) {
        synth.dispose();
      }
    };
  }, [selectedInstrument]);

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
  }, [tempo]);

  const generateMusicSequence = (currentMood: string) => {
    const currentScale =
      moods.find((m) => m.value === currentMood)?.scale || [];
    const noteLength = "8n";

    if (sequence && "dispose" in sequence) {
      sequence.dispose();
    }

    const newSequence = new Tone.Sequence<string>(
      (time, note) => {
        if (synth && "triggerAttackRelease" in synth) {
          synth.triggerAttackRelease(note, noteLength, time);
        }
      },
      generateMelody(currentScale),
      noteLength
    );

    setSequence(newSequence);
    return newSequence;
  };

  const generateMelody = (scale: string[]) => {
    const melodyLength = 8;
    const melody = [];

    for (let i = 0; i < melodyLength; i++) {
      const randomIndex = Math.floor(Math.random() * scale.length);
      melody.push(scale[randomIndex]);
    }

    return melody;
  };

  const handlePlay = async () => {
    await Tone.start();

    if (!isPlaying) {
      const newSequence = generateMusicSequence(mood);
      Tone.Transport.start();
      newSequence.start(0);
    } else {
      Tone.Transport.stop();
      if (sequence) {
        sequence.stop();
      }
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
    setMood(value);
  };

  const handleSave = () => {
    // Save functionality which ill implement later
  };

  const handleExport = () => {
    // Export functionality will be implemented later
  };

  return (
    <Card className="w-full max-w-2xl p-6 mx-auto mt-8">
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Mood</label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select mood" />
            </SelectTrigger>
            <SelectContent>
              {moods.map((m) => (
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
              {Object.entries(instruments).map(([value, inst]) => (
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
          <Button onClick={() => {}} className="w-32">
            Save
          </Button>
          <Button onClick={() => {}} className="w-32">
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicGenerator;
