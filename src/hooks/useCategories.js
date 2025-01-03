// src/hooks/useCategories.js
import { useState, useEffect } from "react";
import { supabase } from "../config/supabase";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name, parentId = null) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([
          {
            name: name, // Just the name string
            parent_id: parentId, // Just the parentId
          },
        ])
        .select();

      if (error) throw error;
      setCategories([...categories, data[0]]);
      return data[0];
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      setCategories(categories.map((c) => (c.id === id ? data[0] : c)));
      return data[0];
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) throw error;
      setCategories(categories.filter((c) => c.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
  };
};

export default useCategories;
