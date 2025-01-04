// src/hooks/useSnippets.js
import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

const useSnippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [recentSnippets, setRecentSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllSnippets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .order("created_at", { ascending: false }); // Order by created_at DESC

      if (error) throw error;
      setSnippets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSnippet = async (newSnippet) => {
    try {
      const { data, error } = await supabase
        .from('snippets')
        .insert([newSnippet])
        .select();

      if (error) throw error;
      setSnippets([data[0], ...snippets]);
      await fetchRecentSnippets(); // Refresh recent snippets
      return data[0];
    } catch (err) {
      console.error('Error adding snippet:', err);
      return null;
    }
  };

  const updateSnippet = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("snippets")
        .update({
          title: updates.title,
          code: updates.code,
          language: updates.language,
          tags: updates.tags || [],
          shared: updates.shared,
          category_id: updates.category_id, // Add this line
        })
        .eq("id", id)
        .select();

      if (error) throw error;
      setSnippets(snippets.map((s) => (s.id === id ? data[0] : s)));
      return data[0];
    } catch (err) {
      console.error("Error updating snippet:", err);
      return null;
    }
  };

  // src/hooks/useSnippets.js
  const deleteSnippet = async (id) => {
    try {
      const { error } = await supabase.from("snippets").delete().eq("id", id);

      if (error) throw error;

      setSnippets(snippets.filter((s) => s.id !== id));
      return true; // Return true to indicate success
    } catch (err) {
      console.error("Error deleting snippet:", err);
      return false;
    }
  };

  const fetchRecentSnippets = async () => {
    try {
      const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(2);

      if (error) throw error;
      setRecentSnippets(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAllSnippets(), fetchRecentSnippets()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    snippets, // For sidebar
    recentSnippets, // For snippet list
    loading,
    error,
    addSnippet,
    updateSnippet,
    deleteSnippet
  };
};

export default useSnippets;
