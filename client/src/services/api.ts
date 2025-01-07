import { EffectSettings } from "@/types/effects";
import { Composition, SaveCompositionDto } from "@/types/types";

const API_URL = "http://localhost:3000/api";

interface EffectPreset {
  id: number;
  name: string;
  effects: EffectSettings[];
  createdAt: string;
  updatedAt: string;
}

export async function saveComposition(
  composition: SaveCompositionDto
): Promise<void> {
  const response = await fetch(`${API_URL}/compositions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(composition),
  });

  if (!response.ok) {
    throw new Error("Failed to save composition");
  }
}

export async function getUserCompositions(): Promise<Composition[]> {
  const response = await fetch(`${API_URL}/compositions`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch compositions");
  }

  const data = await response.json();
  return data.compositions;
}

export async function getComposition(id: number): Promise<Composition> {
  const response = await fetch(`${API_URL}/compositions/${id}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch composition");
  }

  return response.json();
}

export async function deleteComposition(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/compositions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete composition");
  }
}

export async function savePreset(
  name: string,
  effects: EffectSettings[]
): Promise<EffectPreset> {
  const response = await fetch(`${API_URL}/effect-presets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ name, effects }),
  });

  if (!response.ok) {
    throw new Error("Failed to save preset");
  }

  return response.json();
}

export async function getUserPresets(): Promise<EffectPreset[]> {
  const response = await fetch(`${API_URL}/effect-presets`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch presets");
  }

  const data = await response.json();
  return data.presets;
}

export async function deletePreset(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/effect-presets/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete preset");
  }
}
