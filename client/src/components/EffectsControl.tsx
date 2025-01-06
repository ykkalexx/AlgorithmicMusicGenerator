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
  );
};

export default EffectsControl;
