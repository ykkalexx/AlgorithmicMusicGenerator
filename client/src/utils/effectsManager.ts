import * as Tone from "tone";
import { EffectType, EffectInstance, EffectSettings } from "@/types/effects";

export class EffectsManager {
  private effects: Map<EffectType, EffectInstance> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.effects = new Map();
    this.isInitialized = false;
  }

  /*
  This function is used for initialising the effects with default settings.
  */
  initialize() {
    if (this.isInitialized) return;

    //creating the effects with default settings
    const reverb = new Tone.Reverb({
      decay: 1.5,
      preDelay: 0.01,
      wet: 0.5,
    }).toDestination();

    const delay = new Tone.FeedbackDelay({
      delayTime: 0.25,
      feedback: 0.5,
      wet: 0.5,
    }).toDestination();

    const distortion = new Tone.Distortion({
      distortion: 0.4,
      wet: 0.5,
    }).toDestination();

    const chorus = new Tone.Chorus({
      frequency: 4,
      depth: 0.5,
      wet: 0.5,
    }).toDestination();

    const tremolo = new Tone.Tremolo({
      frequency: 10,
      depth: 0.5,
      wet: 0.5,
    }).toDestination();

    this.effects.set("reverb", reverb);
    this.effects.set("delay", delay);
    this.effects.set("distortion", distortion);
    this.effects.set("chorus", chorus);
    this.effects.set("tremolo", tremolo);

    this.isInitialized = true;
  }

  // this function is used to fetch the effect instance based on the effect type
  getEffect(type: EffectType): EffectInstance | undefined {
    return this.effects.get(type);
  }

  // this function is used to update the effect parameters
  updateEffect(type: EffectType, parameters: { [key: string]: number }) {
    const effect = this.getEffect(type);
    if (!effect) return;

    Object.entries(parameters).forEach(([key, value]) => {
      if (key in effect) {
        (effect as any)[key].value = value;
      }
    });
  }

  // this function is used to connect the source to the effects chain
  connectSource(source: Tone.ToneAudioNode, effectTypes: EffectType[]) {
    //disconnect any existing connections
    source.disconnect();

    if (effectTypes.length === 0) {
      source.toDestination();
      return;
    }

    //connect effects in chain
    let previousNode: Tone.ToneAudioNode = source;
    effectTypes.forEach((type) => {
      const effect = this.effects.get(type);
      if (effect) {
        previousNode.connect(effect);
        previousNode = effect;
      }
    });

    //connect last effect to destination if its not already
    if (previousNode !== Tone.getDestination()) {
      previousNode.toDestination();
    }
  }

  getCurrentSettings(): EffectSettings[] {
    const settings: EffectSettings[] = [];

    this.effects.forEach((effect, type) => {
      const parameters: { [key: string]: number } = {};

      switch (type) {
        case "reverb": {
          const reverb = effect as Tone.Reverb;
          parameters.decay = Number(reverb.decay);
          parameters.preDelay = Number(reverb.preDelay);
          parameters.wet = reverb.wet.value;
          break;
        }
        case "delay": {
          const delay = effect as Tone.FeedbackDelay;
          parameters.delayTime = Number(delay.delayTime);
          parameters.feedback = Number(delay.feedback);
          parameters.wet = delay.wet.value;
          break;
        }
        case "distortion": {
          const dist = effect as Tone.Distortion;
          parameters.distortion = dist.distortion;
          parameters.wet = dist.wet.value;
          break;
        }
        case "chorus": {
          const chorus = effect as Tone.Chorus;
          parameters.frequency = Number(chorus.frequency);
          parameters.depth = Number(chorus.depth);
          parameters.wet = chorus.wet.value;
          break;
        }
        case "tremolo": {
          const tremolo = effect as Tone.Tremolo;
          parameters.frequency = Number(tremolo.frequency);
          parameters.depth = Number(tremolo.depth);
          parameters.wet = tremolo.wet.value;
          break;
        }
      }

      settings.push({
        type,
        enabled: true,
        parameters,
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
