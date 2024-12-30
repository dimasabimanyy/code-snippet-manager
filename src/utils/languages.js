// src/utils/languages.js
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';

export const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: javascript },
  { id: 'html', name: 'HTML', extension: html },
  { id: 'css', name: 'CSS', extension: css },
  { id: 'python', name: 'Python', extension: python },
  { id: 'java', name: 'Java', extension: java },
  { id: 'sql', name: 'SQL', extension: sql },
];

export const getLanguageExtension = (languageId) => {
  const language = LANGUAGES.find(lang => lang.id === languageId);
  return language ? language.extension() : javascript();
};