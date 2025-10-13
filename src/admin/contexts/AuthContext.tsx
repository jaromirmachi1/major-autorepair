import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type GoogleAuthProvider,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
  auth as firebaseAuth,
  googleProvider as firebaseGoogleProvider,
  isFirebaseConfigured,
} from "../config/firebase";

// Type assertion to help TypeScript
const auth = firebaseAuth as Auth;
const googleProvider = firebaseGoogleProvider as GoogleAuthProvider;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of admin emails (you can add more)
const ADMIN_EMAILS = [
  "admin@test.com", // Mock email for development
  "your-admin-email@gmail.com", // Replace with your actual admin email
  "admin@yourcompany.com",
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    try {
      if (!isFirebaseConfigured) {
        // Mock sign-in for development
        console.warn("Using mock authentication (Firebase not configured)");
        const mockUser = {
          email: "admin@test.com",
          displayName: "Test Admin",
          uid: "mock-uid",
          photoURL: null,
        } as User;
        setUser(mockUser);
        return;
      }

      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!isFirebaseConfigured) {
        // Mock sign-out for development
        setUser(null);
        return;
      }

      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const isAdmin = user ? ADMIN_EMAILS.includes(user.email || "") : false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
