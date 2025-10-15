import { createClient } from "@supabase/supabase-js";

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "your-supabase-url" &&
  supabaseAnonKey !== "your-supabase-anon-key";

// Initialize Supabase client only if configured
let supabase: any = null;

if (isSupabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("✅ Supabase initialized successfully");
} else {
  console.warn(
    "⚠️ Supabase not configured. Using mock mode. Please create .env.local with your Supabase credentials."
  );

  // Mock implementations for development without Supabase
  supabase = {
    auth: {
      signInWithPassword: async () => {
        return {
          data: {
            user: {
              id: "mock-user-id",
              email: "admin@test.com",
              user_metadata: {
                full_name: "Test Admin",
              },
            },
            session: {
              access_token: "mock-token",
            },
          },
          error: null,
        };
      },
      signOut: async () => {
        return { error: null };
      },
      onAuthStateChange: (callback: (event: string, session: any) => void) => {
        // Simulate successful login
        setTimeout(() => {
          callback("SIGNED_IN", {
            user: {
              id: "mock-user-id",
              email: "admin@test.com",
              user_metadata: {
                full_name: "Test Admin",
              },
            },
          });
        }, 100);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      getSession: async () => {
        return {
          data: {
            session: {
              user: {
                id: "mock-user-id",
                email: "admin@test.com",
                user_metadata: {
                  full_name: "Test Admin",
                },
              },
            },
          },
          error: null,
        };
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: () => ({
            desc: () => ({
              limit: () => Promise.resolve({ data: [], error: null }),
            }),
          }),
        }),
        order: () => ({
          desc: () => Promise.resolve({ data: [], error: null }),
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
        delete: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
    storage: {
      from: () => ({
        upload: () =>
          Promise.resolve({ data: { path: "mock-path" }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "mock-url" } }),
        remove: () => Promise.resolve({ data: null, error: null }),
      }),
    },
  };
}

export { supabase, isSupabaseConfigured };
export default supabase;
