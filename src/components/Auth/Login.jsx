// src/components/Auth/Login.jsx
import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const [error, setError] = useState(null)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Code Snippet Manager
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Store and manage your code snippets
        </p>
        
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            className="w-5 h-5 mr-2" 
            alt="Google" 
          />
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default Login