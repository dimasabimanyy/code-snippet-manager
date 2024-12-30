// src/components/SnippetList/index.jsx
import React from 'react';
import { Trash2 } from 'lucide-react';

const SnippetList = ({ snippets, onSelect, onCreateNew, onDelete, selectedId }) => {
  return (
    <div className="h-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Snippets</h2>
        <button 
          onClick={onCreateNew}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          New Snippet
        </button>
      </div>
      <div className="space-y-2">
        {snippets?.length > 0 ? (
          snippets.map((snippet) => (
            <div
              key={snippet.id}
              className={`p-4 border dark:border-gray-700 rounded cursor-pointer 
                ${selectedId === snippet.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                } dark:bg-gray-800`}
            >
              <div className="flex justify-between items-start">
                <div onClick={() => onSelect(snippet)} className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{snippet.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {snippet.language} • {new Date(snippet.createdAt).toLocaleDateString()}
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
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(snippet.id);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">No snippets yet</p>
        )}
      </div>
    </div>
  );
};

export default SnippetList;