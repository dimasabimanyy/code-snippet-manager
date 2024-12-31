// src/hooks/useKeyboardShortcuts.js
import { useEffect } from "react";

export const useKeyboardShortcuts = ({ onNew, onSave, onEscape, onDelete }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if target is input or textarea
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      // Cmd/Ctrl + N: New snippet
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        onNew?.();
      }

      // Cmd/Ctrl + S: Save changes
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        onSave?.();
      }

      // Delete/Backspace: Delete snippet
      if ((e.key === "Delete" || e.key === "Backspace") && onDelete) {
        onDelete();
      }

      // Escape: Clear selection
      if (e.key === "Escape") {
        onEscape?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNew, onSave, onEscape, onDelete]);
};
