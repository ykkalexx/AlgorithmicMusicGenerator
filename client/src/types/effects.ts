import * as Tone from "tone";

export type EffectType =
  | "reverb"
  | "delay"
  | "distortion"
  | "chorus"
  | "tremolo";

export interface EffectConfig {
  type: EffectType;
  enabled: boolean;
  parameters: {
    [key: string]: number;
  };
}

export interface ReverbConfig extends EffectConfig {
  type: "reverb";
  parameters: {
    decay: number;
    preDelay: number;
    wet: number;
  };
}

export interface DelayConfig extends EffectConfig {
  type: "delay";
  parameters: {
    delayTime: number;
    feedback: number;
    wet: number;
  };
}

export interface DistortionConfig extends EffectConfig {
  type: "distortion";
  parameters: {
    distortion: number;
    wet: number;
  };
}

export interface ChorusConfig extends EffectConfig {
  type: "chorus";
  parameters: {
    frequency: number;
    depth: number;
    wet: number;
  };
}

export interface TremoloConfig extends EffectConfig {
  type: "tremolo";
  parameters: {
    frequency: number;
    depth: number;
    wet: number;
  };
}

export type EffectInstance =
  | Tone.Reverb
  | Tone.FeedbackDelay
  | Tone.Distortion
  | Tone.Chorus
  | Tone.Tremolo;

export type EffectSettings =
  | ReverbConfig
  | DelayConfig
  | DistortionConfig
  | ChorusConfig
  | TremoloConfig;
