import { Composition, SaveCompositionDto } from "@/types/types";

const API_URL = process.env.BACKEND_SERVER || "http://localhost:3000/api";

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
