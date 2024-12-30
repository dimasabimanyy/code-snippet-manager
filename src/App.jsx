// src/App.jsx
import React from "react";
import Layout from "./components/Layout";
import SnippetList from "./components/SnippetList";
import CodeEditor from "./components/CodeEditor";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [snippets, setSnippets] = useLocalStorage("snippets", []);
  const [selectedSnippet, setSelectedSnippet] = React.useState(null);

  const handleCreateSnippet = () => {
    const newSnippet = {
      id: uuidv4(),
      title: "New Snippet",
      code: "",
      language: "javascript",
      tags: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSnippets([...snippets, newSnippet]);
    setSelectedSnippet(newSnippet);
  };

  const handleDeleteSnippet = (id) => {
    const isSelected = selectedSnippet?.id === id;
    setSnippets(snippets.filter((s) => s.id !== id));
    if (isSelected) {
      setSelectedSnippet(null);
    }
  };

  const handleCodeChange = (value) => {
    if (selectedSnippet) {
      const updatedSnippet = {
        ...selectedSnippet,
        code: value,
        updatedAt: Date.now(),
      };
      setSnippets(
        snippets.map((s) => (s.id === selectedSnippet.id ? updatedSnippet : s))
      );
      setSelectedSnippet(updatedSnippet);
    }
  };

  const handleTitleChange = (title) => {
    if (selectedSnippet) {
      const updatedSnippet = {
        ...selectedSnippet,
        title,
        updatedAt: Date.now(),
      };
      setSnippets(
        snippets.map((s) => (s.id === selectedSnippet.id ? updatedSnippet : s))
      );
      setSelectedSnippet(updatedSnippet);
    }
  };

  const handleTagsChange = (tags) => {
    if (selectedSnippet) {
      const updatedSnippet = {
        ...selectedSnippet,
        tags,
        updatedAt: Date.now(),
      };
      setSnippets(
        snippets.map((s) => (s.id === selectedSnippet.id ? updatedSnippet : s))
      );
      setSelectedSnippet(updatedSnippet);
    }
  };

  const handleLanguageChange = (language) => {
    if (selectedSnippet) {
      const updatedSnippet = {
        ...selectedSnippet,
        language,
        updatedAt: Date.now(),
      };
      setSnippets(
        snippets.map((s) => (s.id === selectedSnippet.id ? updatedSnippet : s))
      );
      setSelectedSnippet(updatedSnippet);
    }
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <SnippetList
            snippets={snippets}
            onSelect={setSelectedSnippet}
            onCreateNew={handleCreateSnippet}
            onDelete={handleDeleteSnippet}
            selectedId={selectedSnippet?.id}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          {selectedSnippet ? (
            <CodeEditor
              snippet={{
                ...selectedSnippet,
                onTagsChange: handleTagsChange,
              }}
              onCodeChange={handleCodeChange}
              onTitleChange={handleTitleChange}
              onLanguageChange={handleLanguageChange}
            />
          ) : (
            <div className="text-center text-gray-500 mt-10">
              <p>Select a snippet or create a new one to start coding</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
