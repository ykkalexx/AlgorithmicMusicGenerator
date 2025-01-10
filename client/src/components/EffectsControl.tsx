import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { EffectType, EffectSettings } from "@/types/effects";
import { deletePreset, getUserPresets, savePreset } from "@/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import PresetsDialog from "./PresetsDialog";

interface EffectControlProps {
  effects: EffectSettings[];
  onEffectToggle: (type: EffectType) => void;
  onParameterChange: (type: EffectType, key: string, value: number) => void;
  onLoadPreset: (effects: EffectSettings[]) => void;
}

const parameterLabels: Record<string, string> = {
  decay: "Decay",
  preDelay: "Pre-Delay",
  wet: "Mix",
  delayTime: "Time",
  feedback: "Feedback",
  distortion: "Amount",
  frequency: "Rate",
  depth: "Depth",
};

const EffectsControl: React.FC<EffectControlProps> = ({
  effects,
  onEffectToggle,
  onParameterChange,
  onLoadPreset,
}) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presets, setPresets] = useState<
    Array<{ id: number; name: string; effects: EffectSettings[] }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      const userPresets = await getUserPresets();
      setPresets(userPresets);
    } catch (error) {
      console.error("Failed to fetch user presets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreset = async (name: string) => {
    await savePreset(name, effects);
    loadPresets();
  };

  const handleDeletePreset = async (id: number) => {
    try {
      await deletePreset(id);
      loadPresets;
    } catch (error) {
      console.error("Failed to delete preset:", error);
    }
  };

  const handleLoadPreset = async (presetId: number) => {
    try {
      const preset = presets.find((p) => p.id === presetId);
      if (preset && onLoadPreset) {
        onLoadPreset(preset.effects);
      }
    } catch (error) {
      console.error("Failed to load preset:", error);
    }
  };
  if (!effects || effects.length === 0) return null;

  const getParameterRange = (parameter: string) => {
    const ranges = {
      decay: { min: 0.1, max: 10, step: 0.1 },
      preDelay: { min: 0, max: 0.1, step: 0.001 },
      wet: { min: 0, max: 1, step: 0.01 },
      delayTime: { min: 0, max: 1, step: 0.01 },
      feedback: { min: 0, max: 0.95, step: 0.01 },
      distortion: { min: 0, max: 1, step: 0.01 },
      frequency: { min: 0.1, max: 20, step: 0.1 },
      depth: { min: 0, max: 1, step: 0.01 },
    };
    return (
      ranges[parameter as keyof typeof ranges] || { min: 0, max: 1, step: 0.01 }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Select onValueChange={(value) => handleLoadPreset(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Load preset" />
            </SelectTrigger>
            <SelectContent>
              {presets.map((preset) => (
                <div className="flex flex-row items-start gap-4">
                  <SelectItem key={preset.id} value={preset.id.toString()}>
                    {preset.name}
                  </SelectItem>
                  <Button onClick={() => handleDeletePreset(preset.id)}>
                    Delete Preset
                  </Button>
                </div>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowSaveDialog(true)}>Save Preset</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 ">
        {effects.map((effect) => (
          <Card
            key={effect.type}
            className="w-[300px] flex-shrink-0 border border-gray-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between pb-2 mb-6 border-b">
                <Label className="text-lg font-semibold capitalize">
                  {effect.type}
                </Label>
                <Switch
                  checked={effect.enabled}
                  onCheckedChange={() => onEffectToggle(effect.type)}
                />
              </div>
              <div className="space-y-6">
                {Object.entries(effect.parameters).map(([param, value]) => {
                  const range = getParameterRange(param);
                  const numValue =
                    typeof value === "number" ? value : Number(value);
                  return (
                    <div key={param}>
                      <div className="flex justify-between mb-2">
                        <Label className="text-sm">
                          {parameterLabels[param]}
                        </Label>
                        <span className="text-sm text-gray-500">
                          {!isNaN(numValue) ? numValue.toFixed(2) : "0.00"}
                        </span>
                      </div>
                      <Slider
                        value={[!isNaN(numValue) ? numValue : 0]}
                        onValueChange={([newValue]) =>
                          onParameterChange(effect.type, param, newValue)
                        }
                        min={range.min}
                        max={range.max}
                        step={range.step}
                        disabled={!effect.enabled}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PresetsDialog
        isOpen={showSaveDialog}
        onClose={() => setShowSaveDialog(false)}
        onSave={handleSavePreset}
      />
    </div>
  );
};

export default EffectsControl;
