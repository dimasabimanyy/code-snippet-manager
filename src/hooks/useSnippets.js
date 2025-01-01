// src/hooks/useSnippets.js
import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

const useSnippets = () => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .order('created_at', { ascending: false }); // Order by created_at DESC
  
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
      setSnippets(currentSnippets => [data[0], ...currentSnippets]); // Use function update
      return data[0];
    } catch (err) {
      console.error(err);
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
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      // Update local state
      setSnippets(snippets.map((s) => (s.id === id ? data[0] : s)));
      return data[0];
    } catch (err) {
      console.error("Error updating snippet:", err);
      return null;
    }
  };

  const deleteSnippet = async (id) => {
    try {
      const { error } = await supabase.from("snippets").delete().eq("id", id);

      if (error) throw error;
      setSnippets(snippets.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  return {
    snippets,
    loading,
    error,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    refreshSnippets: fetchSnippets,
  };
};

export default useSnippets;
