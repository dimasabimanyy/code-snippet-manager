// src/App.jsx
import React from "react";
import Layout from "./components/Layout";
import Login from "./components/Auth/Login"; // Add this import
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import SnippetList from "./components/SnippetList";
import CodeEditor from "./components/CodeEditor";
import { v4 as uuidv4 } from "uuid";
import useLocalStorage from "./hooks/useLocalStorage";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

function AppContent() {
  const { user, loading } = useAuth();

  const [snippets, setSnippets] = useLocalStorage("snippets", []);
  const [selectedSnippet, setSelectedSnippet] = React.useState(null);
  const [filters, setFilters] = React.useState({
    search: "",
    language: null,
    tag: "",
  });

  // Add a reference to track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

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
    setHasUnsavedChanges(false);
  };

  const handleDeleteSnippet = (id) => {
    const isSelected = selectedSnippet?.id === id;
    setSnippets(snippets.filter((s) => s.id !== id));
    if (isSelected) {
      setSelectedSnippet(null);
    }
  };

  const handleSave = () => {
    if (selectedSnippet && hasUnsavedChanges) {
      setSnippets(
        snippets.map((s) => (s.id === selectedSnippet.id ? selectedSnippet : s))
      );
      setHasUnsavedChanges(false);
    }
  };

  // Use keyboard shortcuts
  useKeyboardShortcuts({
    onNew: handleCreateSnippet,
    onSave: handleSave,
    onEscape: () => setSelectedSnippet(null),
    onDelete: () => {
      if (selectedSnippet) {
        handleDeleteSnippet(selectedSnippet.id);
      }
    },
  });

  // Update code change handler to track unsaved changes
  const handleCodeChange = (value) => {
    if (selectedSnippet) {
      setSelectedSnippet({
        ...selectedSnippet,
        code: value,
        updatedAt: Date.now(),
      });
      setHasUnsavedChanges(true);
    }
  };

  // Show keyboard shortcuts helper
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  const toggleShortcutsHelper = () => {
    setShowShortcuts(!showShortcuts);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <Layout>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Keyboard Shortcuts Helper */}
            {showShortcuts && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                  <h2 className="text-xl font-bold mb-4 dark:text-white">
                    Keyboard Shortcuts
                  </h2>
                  <div className="space-y-2 dark:text-gray-200">
                    <p>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        ⌘/Ctrl + N
                      </kbd>{" "}
                      New snippet
                    </p>
                    <p>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        ⌘/Ctrl + S
                      </kbd>{" "}
                      Save changes
                    </p>
                    <p>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        Esc
                      </kbd>{" "}
                      Clear selection
                    </p>
                    <p>
                      <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        Delete
                      </kbd>{" "}
                      Delete snippet
                    </p>
                  </div>
                  <button
                    onClick={toggleShortcutsHelper}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Add Keyboard Shortcuts button to the header */}
            <button
              onClick={toggleShortcutsHelper}
              className="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600"
            >
              ⌘ Shortcuts
            </button>

            {/* Rest of your components */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <SnippetList
                snippets={snippets}
                filters={filters}
                onFiltersChange={setFilters}
                onSelect={setSelectedSnippet}
                onCreateNew={handleCreateSnippet}
                onDelete={handleDeleteSnippet}
                selectedId={selectedSnippet?.id}
              />
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              {selectedSnippet ? (
                <CodeEditor
                  snippet={selectedSnippet}
                  onCodeChange={handleCodeChange}
                  onTitleChange={handleTitleChange}
                  onLanguageChange={handleLanguageChange}
                  hasUnsavedChanges={hasUnsavedChanges}
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                  <p>Select a snippet or create a new one to start coding</p>
                  <p className="text-sm mt-2">
                    Press{" "}
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      ⌘/Ctrl + N
                    </kbd>{" "}
                    to create a new snippet
                  </p>
                </div>
              )}
            </div>
          </div>
        </Layout>
      ) : (
        <Login />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
