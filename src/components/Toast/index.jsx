// src/components/Toast/index.jsx
import { useState, useEffect } from 'react';

const ToastMessage = ({ message, type, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Enter animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto remove
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Give time for exit animation before actual removal
      setTimeout(onRemove, 300);
    }, 2700); // 3000 - 300 for exit animation

    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <div
      className={`transform transition-all duration-300 ease-out
        ${isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-2 opacity-0'
        }
        p-4 rounded shadow-lg 
        ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} 
        text-white flex items-center justify-between`}
    >
      <span>{message}</span>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onRemove, 300);
        }} 
        className="ml-4 hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 space-y-2 z-50">
    {toasts.map((toast) => (
      <ToastMessage
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onRemove={() => removeToast(toast.id)}
      />
    ))}
  </div>
);

export default Toast;