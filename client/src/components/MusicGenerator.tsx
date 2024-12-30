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

const MusicGenerator = () => {
  const [mood, setMood] = useState("happy");
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState("synth");

  const moods = [
    { value: "happy", label: "Happy" },
    { value: "sad", label: "Sad" },
    { value: "energetic", label: "Energetic" },
    { value: "calm", label: "Calm" },
    { value: "mysterious", label: "Mysterious" },
  ];

  const instruments = [
    { value: "synth", label: "Synthesizer" },
    { value: "piano", label: "Piano" },
    { value: "strings", label: "Strings" },
    { value: "bass", label: "Bass" },
  ];

  const handleTempoChange = (value: number[]) => {
    setTempo(value[0]);
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // Tone.js will be used here
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
            onValueChange={setSelectedInstrument}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select instrument" />
            </SelectTrigger>
            <SelectContent>
              {instruments.map((inst) => (
                <SelectItem key={inst.value} value={inst.value}>
                  {inst.label}
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
          <Button onClick={handleSave} className="w-32">
            Save
          </Button>
          <Button onClick={handleExport} className="w-32">
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicGenerator;
