import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { EffectType, EffectSettings } from "@/types/effects";

interface EffectControlProps {
  effect: EffectSettings;
  onToggle: (type: EffectType) => void;
  onParameterChange: (type: EffectType, key: string, value: number) => void;
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
  effect,
  onToggle,
  onParameterChange,
}) => {
  const getParameterRange = (
    parameter: string
  ): { min: number; max: number; step: number } => {
    switch (parameter) {
      case "decay":
        return { min: 0.1, max: 10, step: 0.1 };
      case "preDelay":
        return { min: 0, max: 0.1, step: 0.001 };
      case "wet":
        return { min: 0, max: 1, step: 0.01 };
      case "delayTime":
        return { min: 0, max: 1, step: 0.01 };
      case "feedback":
        return { min: 0, max: 0.95, step: 0.01 };
      case "distortion":
        return { min: 0, max: 1, step: 0.01 };
      case "frequency":
        return { min: 0.1, max: 20, step: 0.1 };
      case "depth":
        return { min: 0, max: 1, step: 0.01 };
      default:
        return { min: 0, max: 1, step: 0.01 };
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Label className="text-lg font-medium capitalize">
            {effect.type}
          </Label>
          <Switch
            checked={effect.enabled}
            onCheckedChange={() => onToggle(effect.type)}
          />
        </div>

        <div className="space-y-4">
          {Object.entries(effect.parameters).map(([parameter, value]) => (
            <div key={parameter} className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-sm">{parameterLabels[parameter]}</Label>
                <span className="text-sm text-gray-500">
                  {value.toFixed(2)}
                </span>
              </div>
              <Slider
                value={[value]}
                onValueChange={([newValue]) =>
                  onParameterChange(effect.type, parameter, newValue)
                }
                {...getParameterRange(parameter)}
                disabled={!effect.enabled}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EffectsControl;
