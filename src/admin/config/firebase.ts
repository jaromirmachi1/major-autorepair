import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is configured
const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => value && value !== "your-api-key-here" && !value.includes("your-")
);

// Initialize Firebase only if configured
let app: FirebaseApp | undefined;
let auth: Auth;
let db: Firestore;
let googleProvider: GoogleAuthProvider;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();

  console.log("✅ Firebase initialized successfully");
} else {
  console.warn(
    "⚠️ Firebase not configured. Using mock mode. Please create .env.local with your Firebase credentials."
  );

  // Mock implementations for development without Firebase
  auth = {
    currentUser: null,
    signInWithPopup: async () => {
      return {
        user: {
          email: "admin@test.com",
          displayName: "Test Admin",
          uid: "mock-uid",
          photoURL: null,
        },
      };
    },
    signOut: async () => {
      return Promise.resolve();
    },
    onAuthStateChanged: (callback: (user: any) => void) => {
      setTimeout(() => {
        callback({
          email: "admin@test.com",
          displayName: "Test Admin",
          uid: "mock-uid",
          photoURL: null,
        });
      }, 100);
      return () => {};
    },
  } as Auth;

  googleProvider = {} as GoogleAuthProvider;
  db = {} as Firestore;
}

export { auth, db, googleProvider, isFirebaseConfigured };
export default app;
