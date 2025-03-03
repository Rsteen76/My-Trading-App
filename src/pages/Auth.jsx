// src/pages/Auth.jsx
import React, { useState, useEffect } from "react";
import { auth } from "../../firebase"; // Import auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider, // Import GoogleAuthProvider
  signInWithPopup, // Import signInWithPopup
} from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Redirect to dashboard if a user is already logged in
        navigate("/");
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [navigate]); // Add navigate to dependency array

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to dashboard after successful sign-up
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to dashboard after successful sign-in
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/auth");
    } catch (error) {
      setError(error.message);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider(); // Create a new GoogleAuthProvider
    try {
      await signInWithPopup(auth, provider); // Sign in with popup
      navigate("/"); // Redirect to dashboard after successful Google sign-in
    } catch (error) {
      setError(error.message); // Display any errors
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-3xl font-bold mb-6">
        {isSignUp ? "Sign Up" : "Sign In"}
      </h1>
      {user && (
        <div className="mb-6">
          <p className="mb-4">You are currently signed in as {user.email}</p>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
      {!user && (
        <form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className="bg-white text-gray-900 max-w-md w-full p-6 rounded shadow"
        >
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <p className="mt-4 text-center">
            {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="mt-4 w-full bg-white text-gray-900 py-2 px-4 rounded border border-gray-300 hover:bg-gray-100 transition"
          >
            Sign In with Google
          </button>
        </form>
      )}
    </div>
  );
}

export default Auth;
