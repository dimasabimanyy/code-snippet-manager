// src/components/Auth/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

const Login = () => {
  const [error, setError] = useState(null);
  const { signInWithGoogle } = useAuth();
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-8 py-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Logo/Icon Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
              <code className="text-2xl text-white">{`{ }`}</code>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Code Snippet Manager
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Store, organize, and share your code snippets
            </p>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <div className="space-y-3">
              <Feature
                icon="✨"
                text="Organize your code snippets in one place"
              />
              <Feature icon="🔍" text="Quick search and filter by language" />
              <Feature icon="🔄" text="Share snippets with others" />
            </div>
          </div>

          {/* Sign In Section */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 text-red-500 p-3 rounded text-sm">
                {error}
              </div>
            )}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                className="w-5 h-5"
                alt="Google"
              />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            Your snippets are securely stored and private by default
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 dark:text-gray-400">
        <div className="max-w-md mx-auto space-y-2">
          <div className="text-sm">Code Snippet Manager</div>
          <div className="text-xs">
            © {new Date().getFullYear()} All rights reserved
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature component
const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
    <span className="text-xl">{icon}</span>
    <span>{text}</span>
  </div>
);

export default Login;
