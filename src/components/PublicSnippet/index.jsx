// src/components/PublicSnippet/index.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { getLanguageExtension } from '../../utils/languages';
import { useParams } from 'react-router-dom';

const PublicSnippet = () => {
  const { id } = useParams();

  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippet = async () => {
      const { data, error } = await supabase
        .from('snippets')
        .select('*')
        .eq('id', id)
        .eq('shared', true)
        .single();
      
      if (!error) setSnippet(data);
      setLoading(false);
    };
    fetchSnippet();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!snippet) return <div>Snippet not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl mb-4">{snippet.title}</h1>
      <CodeMirror
        value={snippet.code}
        theme={oneDark}
        extensions={[getLanguageExtension(snippet.language)]}
        readOnly
      />
    </div>
  );
};

export default PublicSnippet;