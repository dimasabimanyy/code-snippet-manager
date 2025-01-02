import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white py-8">
      <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
        <p className="text-center text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Code Snippet Manager. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;