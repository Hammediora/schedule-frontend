import React, { useContext, useState, useEffect } from "react";
import { auth } from "../services/FirebaseService";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

// Create the Auth Context
const AuthContext = React.createContext();

// Hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(""); // Handle authentication errors
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate(); 

  // Sign-up function
  const signup = async (email, password) => {
    try {
      setAuthError(""); 
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message); // Capture error
      console.error("Signup error: ", error); // Log error for debugging
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setAuthError("");
  
      // Step 1: Authenticate the user using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;  // Get the Firebase user object
  
      // Step 2: Get the Firebase ID token
      const token = await firebaseUser.getIdToken();  // Get the ID token from Firebase
  
      // Step 3: Send the Firebase ID token to the backend for validation
      const response = await loginUser(token);  // Call the loginUser API function from api.js
  
      // Step 4: Store the user's profile from MongoDB (returned by the backend)
      setUserProfile(response.data);  // Save the user profile in state
  
      return firebaseUser;  // Return Firebase user object if needed
  
    } catch (error) {
      setAuthError(error.message);  // Capture error
      console.error("Login error: ", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setAuthError("");
      setUserProfile(null); 
      await signOut(auth);  
      navigate('/');  
    } catch (error) {
      setAuthError(error.message); // Capture error
      console.error("Logout error: ", error);
      throw error;
    }
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return currentUser !== null;  // Return true if there is a logged-in user
  };

  // Fetch user profile from your MongoDB API
  const fetchUserProfile = async (firebaseUid) => {
    try {
      const token = await auth.currentUser.getIdToken();  // Get the current Firebase token
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUserProfile(response.data);  // Store user profile data from MongoDB
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setAuthError("Failed to fetch user profile.");
    }
  };

  // Manage the current user using Firebase's onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserProfile(user.uid);  // Fetch MongoDB profile once authenticated
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe; // Clean up listener on unmount
  }, []);

  // AuthContext value
  const value = {
    currentUser,
    userProfile,  // Add the MongoDB user profile
    signup,
    login,
    logout,
    isAuthenticated,  // Expose the isAuthenticated function
    authError, // Expose error message in case any component needs it
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after checking auth state */}
    </AuthContext.Provider>
  );
};
