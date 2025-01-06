import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { EffectType, EffectSettings } from "@/types/effects";

interface EffectControlProps {
  effects: EffectSettings[];
  onEffectToggle: (type: EffectType) => void;
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
  effects,
  onEffectToggle,
  onParameterChange,
}) => {
  if (!effects || effects.length === 0) return null;

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
    <div className="mt-4 space-y-4">
      {effects.map((effect) => (
        <Card key={effect.type}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Label>{effect.type}</Label>
              <Switch
                checked={effect.enabled}
                onCheckedChange={() => onEffectToggle(effect.type)}
              />
            </div>
            {Object.entries(effect.parameters || {}).map(([param, value]) => {
              const range = getParameterRange(param);
              return (
                <div key={param} className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{parameterLabels[param]}</Label>
                    <span>{value.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={([newValue]) =>
                      onParameterChange(effect.type, param, newValue)
                    }
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    disabled={!effect.enabled}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EffectsControl;
