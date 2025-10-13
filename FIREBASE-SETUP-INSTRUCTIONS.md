# Firebase Setup Instructions

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Google** sign-in provider
3. Add your authorized domain (e.g., `localhost` for development)

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we'll use security rules)
4. Select your preferred location
5. Click **Enable**

## Step 4: Deploy Security Rules

1. Copy the contents of `firestore.rules` file
2. Go to **Firestore Database** > **Rules** tab
3. Paste the security rules
4. Click **Publish**

Or use Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`) to create a web app
4. Register your app with a nickname (e.g., "Car Services Web App")
5. Copy the `firebaseConfig` object values

## Step 6: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase credentials in `.env.local`:

   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

## Step 7: Update Admin Emails

1. Open `firestore.rules`
2. Replace the admin emails in the `isAdmin()` function with your actual admin email(s):

   ```javascript
   function isAdmin() {
     return (
       isAuthenticated() &&
       request.auth.token.email in
         [
           "your-email@gmail.com", // <- Add your email here
           "admin@yourcompany.com",
         ]
     );
   }
   ```

3. Deploy the updated rules to Firebase

4. Also update `src/admin/contexts/AuthContext.tsx`:
   ```typescript
   const ADMIN_EMAILS = [
     "your-email@gmail.com", // <- Add your email here
     "admin@yourcompany.com",
   ];
   ```

## Step 8: Test the Setup

1. Go to `/admin` in your app
2. Sign in with Google using your admin email
3. Try adding a car in the admin dashboard
4. Check Firestore Console to see if the data is saved

## Security Rules Explanation

The current rules allow:

- ✅ **Anyone** can read cars (public display)
- ✅ **Authenticated admins** can create cars
- ✅ **Admins or car creators** can update/delete their cars
- ❌ All other operations are denied

## Troubleshooting

### Firebase not configured error

- Make sure `.env.local` exists with valid credentials
- Restart your dev server after creating `.env.local`

### Permission denied errors

- Check that your email is in the admin list
- Verify security rules are deployed
- Check Firebase Console > Authentication to see if user is signed in

### CORS errors

- Add your domain to authorized domains in Firebase Console > Authentication > Settings

## Production Deployment

Before deploying to production:

1. Update authorized domains in Firebase Console
2. Update admin emails in security rules
3. Consider implementing role-based access with custom claims
4. Enable Firebase App Check for additional security
5. Monitor usage in Firebase Console

## Next Steps

- [ ] Set up Firebase Storage for car images
- [ ] Implement real-time listeners with `onSnapshot()`
- [ ] Add pagination for large car collections
- [ ] Implement search and filtering
- [ ] Add user roles and permissions
