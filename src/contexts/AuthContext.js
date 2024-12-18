import React, { useContext, useState, useEffect } from "react";
import { auth } from "../services/FirebaseService";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; 

// Create the Auth Context
const AuthContext = React.createContext();

// Hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);  
  const [userProfile, setUserProfile] = useState(null);  
  const [loading, setLoading] = useState(true);         
  const [authError, setAuthError] = useState("");        
  const navigate = useNavigate();                       

  // Sign-up function
  const signup = async (email, password) => {
    try {
      setAuthError("");
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);  
      console.error("Signup error: ", error);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setAuthError(""); 
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      const response = await loginUser(token);
      setUserProfile(response.data); 
      return firebaseUser;
    } catch (error) {
      setAuthError(error.message); 
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
      navigate("/");         
    } catch (error) {
      setAuthError(error.message);
      console.error("Logout error: ", error);
      throw error;
    }
  };

  // Firebase auth state change listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        if (!userProfile) {
          try {
            const token = await user.getIdToken();
            const response = await loginUser(token);  
            setUserProfile(response.data);  
          } catch (error) {
            setAuthError("Failed to fetch user profile.");
            console.error("Profile fetch error: ", error);
          }
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [userProfile]);
  

  // Helper function to check if the user is authenticated
  const isAuthenticated = () => currentUser !== null;

  // Provide the context value to the rest of the app
  const value = {
    currentUser,       
    userProfile,     
    signup,           
    login,            
    logout,           
    isAuthenticated,   
    authError,         
  };

  // Render children only after loading the auth state
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
