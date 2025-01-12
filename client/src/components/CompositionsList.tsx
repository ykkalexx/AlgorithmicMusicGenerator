import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  deleteComposition,
  getComposition,
  getUserCompositions,
} from "@/services/api";
import { Composition } from "@/types/types";
import { fetchVersionHistory } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface Props {
  onLoad: (composition: Composition) => void;
}

const CompositionsList = ({ onLoad }: Props) => {
  const [composition, setComposition] = useState<Composition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComposition, setSelectedComposition] =
    useState<Composition | null>(null);
  const [versions, setVersions] = useState<Composition[]>([]);
  const [showVersions, setShowVersions] = useState(false);

  useEffect(() => {
    loadCompositions();
  }, []);

  const loadCompositions = async () => {
    try {
      const data = await getUserCompositions();
      setComposition(data);
    } catch (error) {
      console.error("Failed to load compositions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteComposition(id);
      setComposition(composition.filter((comp) => comp.id !== id));
    } catch (error) {
      console.error("Failed to delete composition:", error);
    }
  };

  const handleLoad = async (id: number) => {
    try {
      const loadedComposition = await getComposition(id);
      onLoad(loadedComposition);
    } catch (error) {
      console.error("Failed to load composition:", error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  const handleVersionClick = async (compositionId: number) => {
    try {
      const history = await fetchVersionHistory(compositionId);
      setVersions(history.versions);
      //@ts-ignore
      setSelectedComposition(compositionId);
      setShowVersions(true);
    } catch (error) {
      console.error("Failed to fetch versions:", error);
    }
  };

  return (
    <div className="space-y-4 w-[600px]">
      <h2 className="mb-4 text-2xl font-bold">Your Compositions</h2>
      {composition.length === 0 ? (
        <p className="text-center text-gray-500">No compositions saved yet</p>
      ) : (
        composition.map((composition) => (
          <Card
            key={composition.id}
            className="transition-shadow hover:shadow-lg"
          >
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-medium">{composition.name}</h3>
                <p className="text-sm text-gray-500">
                  {composition.mood} - {composition.tempo} BPM -{" "}
                  {composition.instrument}
                </p>
                <p className="text-xs text-gray-400">
                  Created:{" "}
                  {new Date(composition.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleVersionClick(composition.id)}
                  className="w-24"
                >
                  Versions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleLoad(composition.id)}
                  className="w-24"
                >
                  Load
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(composition.id)}
                  className="w-24"
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={showVersions} onOpenChange={setShowVersions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {versions.map((version) => (
              <Card key={version.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3>Version {version.version}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onLoad({
                          ...composition.find(
                            //@ts-ignore
                            (c) => c.id === selectedComposition
                          )!,
                        });
                        setShowVersions(false);
                      }}
                    >
                      Load Version
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompositionsList;
