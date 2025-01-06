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

import { SynthType, MoodKey, MusicEvent, Composition } from "@/types/types";
import { MOODS, INSTRUMENTS } from "@/constants/constants";
import { MelodyGenerator } from "@/utils/melodyGenerator";
import { saveComposition } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { exportToWave } from "@/utils/export";
import { EffectsManager } from "@/utils/effectsManager";
import { EffectType, EffectSettings } from "@/types/effects";
import EffectsControl from "./EffectsControl";

interface Props {
  loadedComposition: Composition | null;
}

const MusicGenerator: React.FC<Props> = ({ loadedComposition }) => {
  const [mood, setMood] = useState<MoodKey>("happy");
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("synth");
  const [synth, setSynth] = useState<SynthType | null>(null);
  const [sequence, setSequence] = useState<Tone.Part<MusicEvent> | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [compositionName, setCompositionName] = useState("");
  const [exporting, isExporting] = useState(false);
  const [effectsManager] = useState(() => new EffectsManager());
  const [effects, setEffects] = useState<EffectSettings[]>([]);

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

  // Add  to handle loaded composition
  useEffect(() => {
    if (loadedComposition) {
      setMood(loadedComposition.mood as MoodKey);
      setTempo(loadedComposition.tempo);
      setSelectedInstrument(loadedComposition.instrument);
      setCompositionName(loadedComposition.name);

      // Parse melody data and create new sequence
      const melodyData = JSON.parse(loadedComposition.melody);
      const newSequence = generateMusicSequence(
        loadedComposition.mood as MoodKey
      );
      setSequence(newSequence);
    }
  }, [loadedComposition]);

  // Initialize effects
  useEffect(() => {
    effectsManager.initialize();
    setEffects(effectsManager.getCurrentSettings());
  }, []);

  // Connect synth to effects when created
  useEffect(() => {
    if (synth) {
      const enabledEffects = effects
        .filter((e) => e.enabled)
        .map((e) => e.type);
      effectsManager.connectSource(synth, enabledEffects);
    }
  }, [synth, effects]);

  const generateMusicSequence = (
    currentMood: MoodKey
  ): Tone.Part<MusicEvent> => {
    if (sequence) {
      sequence.dispose();
    }

    // Create melody generator instance
    const generator = new MelodyGenerator(currentMood);

    // Generate melody events using the class
    const events = generator.generateMelody();

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

  // Add save handler
  const handleSave = async () => {
    try {
      await saveComposition({
        name: compositionName,
        mood: mood,
        tempo: tempo,
        instrument: selectedInstrument,
        melody: sequence ? JSON.stringify(event) : "",
      });
      setShowSaveDialog(false);
      setCompositionName("");
      // Optional: Show success message
    } catch (error) {
      console.error("Failed to save composition:", error);
      // Optional: Show error message
    }
  };

  const handleExport = async () => {
    isExporting(true);
    try {
      console.log("hit1");
      //@ts-ignore
      const events = sequence?.events?.map((e) => e.event as MusicEvent) || [];
      console.log("hit2");
      exportToWave(events, synth as Tone.Synth, 10);
      console.log("hit3");
    } catch (error) {
      console.error("Failed to export composition:", error);
    } finally {
      isExporting(false);
    }
  };

  const handleEffectToggle = (type: EffectType) => {
    setEffects((prevEffects) =>
      prevEffects.map((effect) =>
        effect.type === type ? { ...effect, enabled: !effect.enabled } : effect
      )
    );
  };

  const handleEffectParameterChange = (
    type: EffectType,
    parameter: string,
    value: number
  ) => {
    effectsManager.updateEffect(type, { [parameter]: value });

    setEffects((prevEffects) =>
      prevEffects.map((effect) =>
        effect.type === type
          ? ({
              ...effect,
              parameters: {
                ...effect.parameters,
                [parameter]: value,
              },
            } as EffectSettings)
          : effect
      )
    );
  };

  return (
    <div className="flex flex-col items-start">
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

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  className="w-32"
                >
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Composition</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Composition name"
                    value={compositionName}
                    //@ts-ignore
                    onChange={(e: string) => setCompositionName(e.target.value)}
                  />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setShowSaveDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save</Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={handleExport} className="w-32">
              {exporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <EffectsControl
        effects={effects}
        onEffectToggle={handleEffectToggle}
        onParameterChange={handleEffectParameterChange}
      />
    </div>
  );
};

export default MusicGenerator;
