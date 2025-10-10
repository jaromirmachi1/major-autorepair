# Firebase Setup Guide

## Why the Admin Panel Shows Error

The admin panel is currently disabled because Firebase isn't configured. The error "Failed to sign in. Please try again." occurs because the Firebase configuration is using placeholder values.

## Quick Setup (5 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Enter project name: `major-web-admin`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click **Google** provider
3. Toggle **Enable**
4. Add your email as **Project support email**
5. Click **Save**

### Step 3: Enable Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode**
4. Select location (choose closest to you)
5. Click **Done**

### Step 4: Enable Storage

1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Select same location as Firestore
5. Click **Done**

### Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register app name: `major-web`
5. **Copy the config object** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "major-web-admin.firebaseapp.com",
  projectId: "major-web-admin",
  storageBucket: "major-web-admin.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef...",
};
```

### Step 6: Update Your Code

**1. Update Firebase Config:**
Edit `src/admin/config/firebase.ts`:

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

**2. Add Your Admin Email:**
Edit `src/admin/contexts/AuthContext.tsx`:

```typescript
const ADMIN_EMAILS = [
  "your-email@gmail.com", // Add your actual email here
];
```

**3. Enable Admin Panel:**
Edit `src/App.tsx`:

```typescript
// Uncomment these lines:
import AdminApp from "./admin/AdminApp";
<Route path="/admin/*" element={<AdminApp />} />;
```

### Step 7: Test

1. Run `npm run dev`
2. Go to `http://localhost:5174/admin`
3. Click "Sign in with Google"
4. Use your authorized email to sign in
5. You should see the admin dashboard!

## Security Rules (Important!)

After setup, update these security rules:

**Firestore Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cars/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cars/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

**"Failed to sign in" error:**

- Check Firebase config is correct
- Ensure Google sign-in is enabled
- Verify your email is in ADMIN_EMAILS array

**"Access Denied" error:**

- Add your email to ADMIN_EMAILS in AuthContext.tsx

**Build errors:**

- Make sure all Firebase imports are correct
- Check that admin panel is enabled in App.tsx

## Next Steps

Once Firebase is configured:

1. Test login functionality
2. Add your first car through the admin panel
3. Customize the admin interface as needed
4. Set up proper security rules for production

The admin panel will be fully functional once Firebase is properly configured! 🚀
