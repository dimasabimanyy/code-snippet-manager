// src/components/CodeEditor/index.jsx
import React, { useState, forwardRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { LANGUAGES, getLanguageExtension } from "../../utils/languages";
import CopyButton from "../CopyButton";
import { foldGutter, indentUnit } from "@codemirror/language";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/view";

const CodeEditor = forwardRef(
  (
    {
      snippet,
      onCodeChange,
      onTitleChange,
      onLanguageChange,
      onTagsChange,
      onShareToggle,
      onCategoryChange,
      categories
    },
    ref
  ) => {
    const [tagInput, setTagInput] = useState("");
    const [shareStatus, setShareStatus] = useState("");
    const [copyStatus, setCopyStatus] = useState(""); // Add state for copy feedback

    const handleTagSubmit = (e) => {
      e.preventDefault();
      if (!tagInput.trim()) return;

      const newTags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag && !snippet.tags.includes(tag));

      if (newTags.length > 0) {
        onTagsChange([...snippet.tags, ...newTags]); // Use prop instead of snippet method
        setTagInput("");
      }
    };

    const removeTag = (tagToRemove) => {
      onTagsChange(snippet.tags.filter((tag) => tag !== tagToRemove));
    };

    return (
      <div className="h-full">
        <div className="mb-4 space-y-2">
          <div className="flex gap-2">
            <input
              ref={ref}
              type="text"
              value={snippet.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Snippet Title"
              className="flex-1 p-2 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <CopyButton text={snippet.code} />
          </div>
          <div className="flex gap-2">
            <select
              value={snippet.language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="flex-1 p-2 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <select
              value={snippet.category_id || ""}
              onChange={(e) => onCategoryChange(e.target.value || null)}
              className="flex-1 p-2 border dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <CodeMirror
          value={snippet.code}
          height="400px"
          theme={oneDark}
          extensions={[
            getLanguageExtension(snippet.language),
            lineNumbers(),
            foldGutter(),
            highlightActiveLineGutter(),
            indentUnit.of("  "),
          ]}
          onChange={onCodeChange}
          className="border rounded"
        />

        <div className="mt-4">
          <form onSubmit={handleTagSubmit} className="space-y-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tags (comma separated)"
              className="w-full p-2 border rounded"
            />
            {snippet.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {snippet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <button
              type="submit"
              className="bg-gray-100 px-3 py-1 rounded text-sm hover:bg-gray-200"
            >
              Add Tags
            </button>
          </form>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  setShareStatus("Updating...");
                  const updated = await onShareToggle(!snippet.shared);
                  if (updated) {
                    setShareStatus("Link ready!");
                    setTimeout(() => setShareStatus(""), 2000);
                  }
                }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {snippet.shared ? "Disable Sharing" : "Share Snippet"}
              </button>
              {shareStatus && (
                <span className="text-sm text-green-500">{shareStatus}</span>
              )}
            </div>

            {snippet.shared && (
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/snippet/${snippet.id}`}
                  className="flex-1 px-3 py-1 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/snippet/${snippet.id}`
                    );
                    setCopyStatus("Copied!");
                    setTimeout(() => setCopyStatus(""), 2000);
                  }}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {copyStatus || "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default CodeEditor;
