// src/components/CodeEditor/index.jsx
import React, { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

const CodeEditor = ({ snippet, onCodeChange, onTitleChange }) => {
  const [tagInput, setTagInput] = useState('');

  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (!tagInput.trim()) return;

    // Split by comma and clean up tags
    const newTags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !snippet.tags.includes(tag)); // Filter out empty and existing tags

    if (newTags.length > 0) {
      const updatedTags = [...snippet.tags, ...newTags];
      snippet.onTagsChange(updatedTags);
      setTagInput(''); // Clear input after adding
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = snippet.tags.filter(tag => tag !== tagToRemove);
    snippet.onTagsChange(updatedTags);
  };

  return (
    <div className="h-full">
      <div className="mb-4">
        <input
          type="text"
          value={snippet.title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Snippet Title"
          className="w-full p-2 border rounded"
        />
      </div>
      <CodeMirror
        value={snippet.code}
        height="400px"
        theme={oneDark}
        extensions={[javascript()]}
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
      </div>
    </div>
  );
};

export default CodeEditor;