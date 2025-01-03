// src/components/Sidebar/index.jsx
import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderPlus,
  File,
} from "lucide-react";

const CategoryItem = ({
  category,
  snippets,
  onSelectSnippet,
  selectedSnippetId,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const categorySnippets = snippets.filter(
    (s) => s.category_id === category.id
  );

  return (
    <div className="space-y-1">
      <div
        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        <Folder size={16} className="text-blue-500" />
        <span className="text-sm">{category.name}</span>{" "}
        {/* Just display category.name */}
      </div>

      {isOpen && (
        <div className="ml-6 space-y-1">
          {categorySnippets.map((snippet) => (
            <div
              key={snippet.id}
              onClick={() => onSelectSnippet(snippet)}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                selectedSnippetId === snippet.id
                  ? "bg-blue-50 dark:bg-blue-900/50"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <File size={16} />
              <span className="text-sm truncate">{snippet.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({
  categories,
  snippets,
  onSelectSnippet,
  selectedSnippetId,
  onAddCategory,
}) => {
  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Snippets</h2>
          <button
            onClick={onAddCategory}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <FolderPlus size={20} />
          </button>
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              snippets={snippets}
              onSelectSnippet={onSelectSnippet}
              selectedSnippetId={selectedSnippetId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
