import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../../config/supabase";

interface User {
  id: string;
  email: string;
  displayName?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Mock mode - simulate logged in user
      setUser({
        id: "mock-user-id",
        email: "admin@test.com",
        displayName: "Test Admin",
        username: "admin",
      });
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            displayName: session.user.user_metadata?.full_name,
            username: session.user.user_metadata?.username,
          });
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || "",
          displayName: session.user.user_metadata?.full_name,
          username: session.user.user_metadata?.username,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock login
      setUser({
        id: "mock-user-id",
        email: "admin@test.com",
        displayName: "Test Admin",
        username: "admin",
      });
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          displayName: data.user.user_metadata?.full_name,
          username: data.user.user_metadata?.username,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      // Mock logout
      setUser(null);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // For now, consider all authenticated users as admins
  // You can implement proper admin role checking later
  const isAdmin = !!user;

  const value: AuthContextType = {
    user,
    loading,
    isAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
