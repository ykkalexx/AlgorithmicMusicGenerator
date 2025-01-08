import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PresetsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

const PresetsDialog: React.FC<PresetsDialogProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [presetName, setPresetName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!presetName.trim()) return;

    try {
      setIsSaving(true);
      await onSave(presetName);
      setPresetName("");
      onClose();
    } catch (error) {
      console.error("Failed to save preset:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Effects Preset</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            placeholder="Preset name"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PresetsDialog;
