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
        case "reverb":
          parameters.decay = (effect as Tone.Reverb).decay.value;
          parameters.preDelay = (effect as Tone.Reverb).preDelay.value;
          parameters.wet = effect.wet.value;
          break;
        case "delay":
          parameters.delayTime = (effect as Tone.FeedbackDelay).delayTime.value;
          parameters.feedback = (effect as Tone.FeedbackDelay).feedback.value;
          parameters.wet = effect.wet.value;
          break;
        case "distortion":
          parameters.distortion = (effect as Tone.Distortion).distortion;
          parameters.wet = effect.wet.value;
          break;
        case "chorus":
          parameters.frequency = (effect as Tone.Chorus).frequency.value;
          parameters.depth = (effect as Tone.Chorus).depth.value;
          parameters.wet = effect.wet.value;
          break;
        case "tremolo":
          parameters.frequency = (effect as Tone.Tremolo).frequency.value;
          parameters.depth = (effect as Tone.Tremolo).depth.value;
          parameters.wet = effect.wet.value;
          break;
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
