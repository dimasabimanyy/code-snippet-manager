// src/components/Layout/index.jsx
import React, { useState } from "react";
import { Sun, Moon, LogOut, Menu } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../UserAvatar";

// src/components/Layout/index.jsx
const Layout = ({ children, sidebar }) => {
  const [theme, setTheme] = useTheme();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-full mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Code Snippet Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <UserAvatar user={user} />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {user?.user_metadata?.full_name || "User"}
                </span>
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button
                onClick={signOut}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex h-[calc(100vh-4rem)]">
        <div
          className={`
            transform transition-all duration-300 ease-in-out
            ${sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"}
          `}
        >
          {sidebarOpen && sidebar} {/* Render sidebar content */}
        </div>

        <div className="flex-1 overflow-hidden">
          {children} {/* Render main content */}
        </div>
      </div>
      {/* <main className="max-w-full">{children}</main> */}
    </div>
  );
};

export default Layout;
