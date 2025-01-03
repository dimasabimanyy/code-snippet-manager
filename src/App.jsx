// src/App.jsx
import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Login from "./components/Auth/Login"; // Add this import
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import SnippetList from "./components/SnippetList";
import CodeEditor from "./components/CodeEditor";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import useSnippets from "./hooks/useSnippets";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicSnippet from "./components/PublicSnippet";
import Toast from "./components/Toast";
import useCategories from "./hooks/useCategories";
import CategoryModal from "./components/CategoryModal";
import Sidebar from "./components/Sidebar";

function AppContent() {
  const { user, loading } = useAuth();
  const {
    snippets,
    loading: snippetsLoading,
    addSnippet,
    updateSnippet,
    deleteSnippet,
  } = useSnippets();
  // Add state for feedback
  const [saveStatus, setSaveStatus] = React.useState("");

  // Add categories state
  const {
    categories,
    loading: categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // Add modal state
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    editData: null,
  });

  const [selectedSnippet, setSelectedSnippet] = React.useState(null);
  const [filters, setFilters] = React.useState({
    search: "",
    language: null,
    tag: "",
  });
  const titleInputRef = React.useRef(null);

  // Add a reference to track if there are unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);

  // Remove notification state
  // const [notification, setNotification] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((current) => [
      {
        id,
        message,
        type,
      },
      ...current,
    ]);
  };

  // We don't need setTimeout here anymore as it's handled in the ToastMessage component
  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const handleSave = async () => {
    if (selectedSnippet && hasUnsavedChanges) {
      setOperationLoading(true);
      const updated = await updateSnippet(selectedSnippet.id, selectedSnippet);
      setOperationLoading(false);

      if (updated) {
        addToast("Saved successfully");
      } else {
        addToast("Failed to save", "error");
      }
    }
  };

  const handleDeleteSnippet = async (id) => {
    try {
      const success = await deleteSnippet(id);
      if (success) {
        addToast("Snippet deleted successfully");
      } else {
        addToast("Failed to delete snippet", "error");
      }
    } catch (error) {
      addToast("Failed to delete snippet", "error");
    }
  };

  const handleShareToggle = async (shared) => {
    if (selectedSnippet) {
      const updated = await updateSnippet(selectedSnippet.id, {
        ...selectedSnippet,
        shared,
      });
      if (updated) {
        setSelectedSnippet(updated);
        return true;
      }
    }
    return false;
  };

  // In App.jsx
  const handleCreateSnippet = async (categoryId = null) => {
    const newSnippet = {
      title: "New Snippet",
      code: "",
      language: "javascript",
      tags: [],
      category_id: categoryId,
      user_id: user.id,
    };
    const created = await addSnippet(newSnippet);
    if (created) {
      setSelectedSnippet(created);
      setHasUnsavedChanges(false);
    }
  };

  // In App.jsx
  const handleCategoryChange = async (categoryId) => {
    if (selectedSnippet) {
      const updatedSnippet = {
        ...selectedSnippet,
        category_id: categoryId,
      };
      setSelectedSnippet(updatedSnippet);
      setHasUnsavedChanges(true);
      addToast("Category updated");
    }
  };

  // Add auto-save with debounce
  useEffect(() => {
    if (hasUnsavedChanges && selectedSnippet) {
      const timeoutId = setTimeout(async () => {
        await handleSave();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedSnippet, hasUnsavedChanges]);

  useKeyboardShortcuts({
    onNew: handleCreateSnippet,
    onSave: handleSave,
  });

  const handleCodeChange = (value) => {
    if (selectedSnippet) {
      setSelectedSnippet({
        ...selectedSnippet,
        code: value,
      });
      setHasUnsavedChanges(true);
    }
  };

  const handleImport = async (importedSnippets) => {
    for (const snippet of importedSnippets) {
      await addSnippet({
        ...snippet,
        user_id: user.id,
      });
    }
  };

  // Show keyboard shortcuts helper
  const [showShortcuts, setShowShortcuts] = React.useState(false);

  const toggleShortcutsHelper = () => {
    setShowShortcuts(!showShortcuts);
  };
  const handleTitleChange = async (title) => {
    if (selectedSnippet) {
      const updatedSnippet = {
        ...selectedSnippet,
        title,
      };
      setSelectedSnippet(updatedSnippet);
      setHasUnsavedChanges(true);
    }
  };

  const handleTagsChange = async (tags) => {
    if (selectedSnippet) {
      const updatedSnippet = {
        ...selectedSnippet,
        tags,
      };
      setSelectedSnippet(updatedSnippet);
      setHasUnsavedChanges(true);
    }
  };

  const handleLanguageChange = async (language) => {
    if (selectedSnippet) {
      const updatedSnippet = {
        ...selectedSnippet,
        language,
      };
      setSelectedSnippet(updatedSnippet);
      setHasUnsavedChanges(true);
    }
  };
  if (loading || snippetsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />

      {user ? (
        <Layout>
          <div className="h-[calc(100vh-4rem)] flex">
            {/* Sidebar */}
            <Sidebar
              categories={categories}
              snippets={snippets}
              onSelectSnippet={setSelectedSnippet}
              selectedSnippetId={selectedSnippet?.id}
              onAddCategory={() =>
                setCategoryModal({ isOpen: true, editData: null })
              }
              onEditCategory={(category) =>
                setCategoryModal({ isOpen: true, editData: category })
              }
              onDeleteCategory={deleteCategory}
            />

            <div className="relative">
              {saveStatus && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                  {saveStatus}
                </div>
              )}
              {/* Rest of your layout */}
              <div className="flex-1 overflow-auto p-6">
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
                      onImport={handleImport}
                      addToast={addToast}
                    />
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    {selectedSnippet ? (
                      <CodeEditor
                        ref={titleInputRef}
                        snippet={selectedSnippet}
                        onCodeChange={handleCodeChange}
                        onTitleChange={handleTitleChange}
                        onLanguageChange={handleLanguageChange}
                        onTagsChange={handleTagsChange}
                        hasUnsavedChanges={hasUnsavedChanges}
                        onShareToggle={handleShareToggle}
                        onCategoryChange={handleCategoryChange} // Add this
                        categories={categories} // Make sure this is passed
                      />
                    ) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
                        <p>
                          Select a snippet or create a new one to start coding
                        </p>
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
              </div>
            </div>

            <CategoryModal
              isOpen={categoryModal.isOpen}
              onClose={() =>
                setCategoryModal({ isOpen: false, editData: null })
              }
              onSubmit={async (data) => {
                if (categoryModal.editData) {
                  await updateCategory(categoryModal.editData.id, {
                    name: data.name,
                    parent_id: data.parent_id,
                  });
                } else {
                  await addCategory(data.name, data.parent_id); // Just pass name and parent_id
                }
              }}
              initialData={categoryModal.editData}
              categories={categories}
            />
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
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/snippet/:id" element={<PublicSnippet />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
