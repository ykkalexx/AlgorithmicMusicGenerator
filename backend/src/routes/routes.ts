import { Router } from "express";
import { CompositionControllers } from "../controllers/CompositionController";
import { effectPresetsControllers } from "../controllers/EffectsPresetsControllers";

export const router = Router();
const compositionController = new CompositionControllers();
const effectPresetsController = new effectPresetsControllers();

// Composition routes
router.post("/compositions", compositionController.saveComposition);
router.get("/compositions", compositionController.getUserCompositions);
router.get("/compositions/:id", compositionController.getComposition);
router.delete("/compositions/:id", compositionController.deleteComposition);

// Effects presets routes
router.post("/effect-presets", effectPresetsController.savePreset);
router.get("/effect-presets", effectPresetsController.getUserPresets);
router.delete("/effect-presets/:id", effectPresetsController.deletePreset);
