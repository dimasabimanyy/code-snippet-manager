// src/components/PublicSnippet/index.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { getLanguageExtension } from '../../utils/languages';
import { useParams } from 'react-router-dom';
import { Copy, Clock, Code, User } from 'lucide-react';

const PublicSnippet = () => {
  const { id } = useParams();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Snippet Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            This snippet might have been removed or made private.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {snippet.title}
            </h1>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Copy size={16} />
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>By {snippet.profiles?.full_name || 'Anonymous'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>
                {new Date(snippet.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Code size={16} />
              <span className="capitalize">{snippet.language}</span>
            </div>
          </div>

          {snippet.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {snippet.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <CodeMirror
            value={snippet.code}
            theme={oneDark}
            extensions={[getLanguageExtension(snippet.language)]}
            readOnly
            className="min-h-[300px]"
          />
        </div>
      </div>
    </div>
  );
};

export default PublicSnippet;