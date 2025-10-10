# Admin Panel Setup Guide

## Overview

This admin panel allows you to manage your car inventory with Google OAuth authentication. Only authorized administrators can access the panel.

## Features

- 🔐 Google OAuth authentication
- 📊 Dashboard with statistics
- 🚗 Complete car management (CRUD operations)
- 📸 Image upload and management
- 🔍 Search and filter functionality
- 📱 Responsive design

## Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication and Firestore Database
4. In Authentication, enable Google sign-in
5. In Firestore, create a collection called `cars`

### 2. Update Firebase Config

Edit `src/admin/config/firebase.ts` and replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id",
};
```

### 3. Set Admin Emails

Edit `src/admin/contexts/AuthContext.tsx` and update the `ADMIN_EMAILS` array with your admin email addresses:

```typescript
const ADMIN_EMAILS = ["your-admin-email@gmail.com", "admin@yourcompany.com"];
```

### 4. Firebase Storage Rules

In Firebase Console, go to Storage and set these rules:

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

### 5. Firestore Security Rules

In Firebase Console, go to Firestore and set these rules:

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

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin` in your browser
2. Click "Sign in with Google"
3. Use your authorized admin email to sign in

### Managing Cars

- **Dashboard**: View statistics and recent cars
- **Add Car**: Upload images, set details, and add features
- **Edit Car**: Update existing car information
- **Delete Car**: Remove cars from inventory

### Car Information

Each car includes:

- Basic info (make, model, year, color)
- Pricing and mileage
- Technical details (fuel type, transmission)
- Description and features
- Multiple images
- Availability status

## File Structure

```
src/admin/
├── AdminApp.tsx              # Main admin app component
├── components/
│   ├── Layout.tsx            # Admin layout with sidebar
│   └── ProtectedRoute.tsx    # Route protection
├── contexts/
│   ├── AuthContext.tsx       # Authentication context
│   └── CarsContext.tsx       # Car management context
├── pages/
│   ├── Login.tsx             # Google OAuth login
│   ├── Dashboard.tsx         # Admin dashboard
│   ├── CarManagement.tsx     # Car listing and management
│   ├── AddCar.tsx            # Add new car form
│   └── EditCar.tsx           # Edit car form
├── types/
│   └── Car.ts                # TypeScript interfaces
└── config/
    └── firebase.ts           # Firebase configuration
```

## Security Features

- **Email-based authorization**: Only specified emails can access admin panel
- **Route protection**: All admin routes are protected
- **Firebase security rules**: Database and storage are secured
- **Authentication state management**: Proper login/logout handling

## Customization

### Adding New Admin Features

1. Create new components in `src/admin/components/`
2. Add new pages in `src/admin/pages/`
3. Update routing in `AdminApp.tsx`
4. Add navigation items in `Layout.tsx`

### Styling

The admin panel uses Tailwind CSS classes. You can customize:

- Colors: Update the red-primary color scheme
- Layout: Modify the sidebar and main content areas
- Components: Customize individual form elements and cards

## Troubleshooting

### Common Issues

1. **Authentication not working**

   - Check Firebase config is correct
   - Verify Google sign-in is enabled in Firebase
   - Ensure admin email is in the ADMIN_EMAILS array

2. **Images not uploading**

   - Check Firebase Storage rules
   - Verify storage bucket is configured
   - Check browser console for errors

3. **Cars not saving**
   - Check Firestore rules
   - Verify collection name is 'cars'
   - Check browser console for errors

### Support

For issues or questions, check the browser console for error messages and ensure all Firebase services are properly configured.
