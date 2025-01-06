import * as Tone from "tone";
import { EffectType, EffectInstance, EffectSettings } from "@/types/effects";

export class EffectsManager {
  private effects: Map<EffectType, EffectInstance>;
  private isInitialized: boolean;

  constructor() {
    this.effects = new Map();
    this.isInitialized = false;
  }

  initialize() {
    if (this.isInitialized) return;

    // Initialize and connect effects
    const reverb = new Tone.Reverb();
    const delay = new Tone.FeedbackDelay();
    const distortion = new Tone.Distortion();
    const chorus = new Tone.Chorus();
    const tremolo = new Tone.Tremolo();

    // Set default values
    reverb.set({
      decay: 1.5,
      preDelay: 0.01,
      wet: 0.5,
    });

    delay.set({
      delayTime: 0.25,
      feedback: 0.5,
      wet: 0.5,
    });

    distortion.set({
      distortion: 0.4,
      wet: 0.5,
    });

    chorus.set({
      frequency: 4,
      depth: 0.5,
      wet: 0.5,
    });

    tremolo.set({
      frequency: 10,
      depth: 0.5,
      wet: 0.5,
    });

    // Start effects that need it
    chorus.start();
    tremolo.start();

    this.effects.set("reverb", reverb);
    this.effects.set("delay", delay);
    this.effects.set("distortion", distortion);
    this.effects.set("chorus", chorus);
    this.effects.set("tremolo", tremolo);

    this.isInitialized = true;
  }

  getEffect(type: EffectType): EffectInstance | undefined {
    return this.effects.get(type);
  }

  updateEffect(type: EffectType, parameters: { [key: string]: number }) {
    const effect = this.getEffect(type);
    if (!effect) return;

    effect.set(parameters);
  }

  connectSource(source: Tone.ToneAudioNode, effectTypes: EffectType[]) {
    source.disconnect();

    if (effectTypes.length === 0) {
      source.toDestination();
      return;
    }

    let currentNode: Tone.ToneAudioNode = source;

    effectTypes.forEach((type) => {
      const effect = this.effects.get(type);
      if (effect) {
        currentNode.connect(effect);
        currentNode = effect;
      }
    });

    if (currentNode !== source) {
      currentNode.toDestination();
    }
  }

  getCurrentSettings(): EffectSettings[] {
    const settings: EffectSettings[] = [];

    this.effects.forEach((effect, type) => {
      const params = effect.get();
      settings.push({
        type,
        enabled: true,
        parameters: params,
      } as EffectSettings);
    });

    return settings;
  }

  dispose() {
    this.effects.forEach((effect) => effect.dispose());
    this.effects.clear();
    this.isInitialized = false;
  }
}
