import { Router } from "express";
import { CompositionControllers } from "../controllers/CompositionController";

export const router = Router();
const compositionController = new CompositionControllers();

// Composition routes
router.post("/compositions", compositionController.saveComposition);
router.get("/compositions", compositionController.getUserCompositions);
router.get("/compositions/:id", compositionController.getComposition);
router.delete("/compositions/:id", compositionController.deleteComposition);
