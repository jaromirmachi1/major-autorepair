// Mock Firebase for development/testing
// TODO: Replace with real Firebase config when ready

export const auth = {
  currentUser: null,
  signInWithPopup: async () => {
    // Mock successful login
    return {
      user: {
        email: "admin@test.com",
        displayName: "Test Admin",
        uid: "mock-uid",
      },
    };
  },
  signOut: async () => {
    return Promise.resolve();
  },
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock auth state change
    setTimeout(() => {
      callback({
        email: "admin@test.com",
        displayName: "Test Admin",
        uid: "mock-uid",
      });
    }, 1000);

    // Return unsubscribe function
    return () => {};
  },
};

export const db = {
  collection: (name: string) => ({
    add: async (data: any) => ({ id: "mock-id" }),
    get: async () => ({ docs: [] }),
    doc: (id: string) => ({
      update: async (data: any) => Promise.resolve(),
      delete: async () => Promise.resolve(),
    }),
  }),
};

export const storage = {
  ref: (path: string) => ({
    put: async (file: File) => ({
      ref: { getDownloadURL: async () => "mock-url" },
    }),
  }),
};

export default {};
