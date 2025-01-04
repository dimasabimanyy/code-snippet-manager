// src/components/SnippetList/index.jsx
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import Search from "../Search";
import CopyButton from "../CopyButton";
import DeleteConfirmation from "../DeleteConfirmation";
import { importSnippets, exportSnippets } from "../../utils/snippetExport";

const SnippetList = ({
  snippets,
  filters,
  onFiltersChange,
  onSelect,
  onCreateNew,
  onDelete,
  selectedId,
  onImport,
  addToast,
}) => {
  const [importing, setImporting] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = React.useState({
    isOpen: false,
    snippetId: null,
  });

  const filteredSnippets = snippets.filter((snippet) => {
    // Filter by search text
    if (
      filters.search &&
      !snippet.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Filter by language
    if (filters.language && snippet.language !== filters.language) {
      return false;
    }

    // Filter by tag
    if (
      filters.tag &&
      !snippet.tags.some((tag) =>
        tag.toLowerCase().includes(filters.tag.toLowerCase())
      )
    ) {
      return false;
    }

    return true;
  });

  const handleFileImport = async (e) => {
    try {
      setImporting(true);
      const file = e.target.files?.[0];
      if (!file) return;
      const snippets = await importSnippets(file);
      await onImport(snippets);
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  const handleDeleteConfirm = async () => {
    await onDelete(deleteConfirm.snippetId);
    setDeleteConfirm({ isOpen: false, snippetId: null });
  };

  return (
    <>
      <div className="h-full">
        <div className="flex justify-between mb-4">
          <div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Snippets
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Latest 10 snippets for quick access
              </p>
            </div>

            <div className="mt-2 flex gap-2">
              <input
                type="file"
                id="import-file"
                className="hidden"
                accept=".json"
                onChange={async (e) => {
                  try {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const snippets = await importSnippets(file);
                    // You'll need to add this prop and handler in App.jsx
                    onImport(snippets);
                  } catch (error) {
                    console.error("Import failed:", error);
                  }
                  e.target.value = "";
                }}
              />{" "}
              <button
                onClick={() => document.getElementById("import-file").click()}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                disabled={importing}
              >
                {importing ? "Importing..." : "Import"}
              </button>
              <button
                onClick={() => exportSnippets(snippets)}
                className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Export
              </button>
            </div>
          </div>
          <button
            onClick={onCreateNew}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            New Snippet
          </button>
        </div>

        <Search filters={filters} onFiltersChange={onFiltersChange} />

        <div className="space-y-2">
          {filteredSnippets.length > 0 ? (
            filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className={`p-4 border dark:border-gray-700 rounded cursor-pointer 
                ${
                  selectedId === snippet.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                } dark:bg-gray-800`}
              >
                <div className="flex justify-between items-start">
                  <div onClick={() => onSelect(snippet)} className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {snippet.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {snippet.language} •{" "}
                      {new Date(snippet.created_at).toLocaleDateString(
                        "en-US",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                    {snippet.tags?.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {snippet.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <CopyButton text={snippet.code} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm({
                          isOpen: true,
                          snippetId: snippet.id,
                        });
                      }}
                      className="text-gray-400 hover:text-red-500 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {snippets.length === 0
                ? "No snippets yet"
                : "No snippets match your filters"}
            </p>
          )}
        </div>
      </div>
      <DeleteConfirmation
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, snippetId: null })}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

export default SnippetList;
