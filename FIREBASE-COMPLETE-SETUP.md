# 🔥 Firebase Firestore Backend - Complete Setup

## ✅ What's Been Implemented

### 1. Firebase Configuration

- **File**: `src/admin/config/firebase.ts`
- Real Firebase initialization with environment variables
- Automatic fallback to mock mode if not configured
- Supports Firebase Auth, Firestore, and Google Sign-In

### 2. Authentication (Firebase Auth + Google OAuth)

- **File**: `src/admin/contexts/AuthContext.tsx`
- Google Sign-In authentication
- Admin role checking based on email
- Mock authentication for development without Firebase
- Protected routes for admin panel

### 3. Firestore Database Service

- **File**: `src/services/carsService.ts`
- Complete CRUD operations for cars collection:
  - `addCarToFirestore()` - Add new car with metadata
  - `getCarsFromFirestore()` - Get all cars sorted by creation date
  - `updateCarInFirestore()` - Update existing car
  - `deleteCarFromFirestore()` - Delete car by ID
  - `userOwnsCar()` - Check car ownership

### 4. Smart Data Hook

- **File**: `src/hooks/useCars.ts`
- Automatically uses Firestore when configured
- Falls back to localStorage in development
- No code changes needed when switching environments

### 5. Security Rules

- **File**: `firestore.rules`
- Public read access (for displaying cars)
- Only authenticated admins can create cars
- Only creators or admins can update/delete their cars
- Includes admin email whitelist

## 📋 Firestore Data Structure

### Cars Collection (`/cars`)

```typescript
{
  id: string;                    // Auto-generated document ID
  name: string;                  // "2023 BMW X5"
  brand: string;                 // "BMW"
  year: number;                  // 2023
  price: number;                 // 1200000
  priceFormatted?: string;       // "1 200 000 Kč"
  mileage: number;               // 15000
  fuel: string;                  // "Gasoline" | "Diesel" | "Electric" | "Hybrid"
  transmission: string;          // "Automatic" | "Manual"
  description: string;           // Car description
  imageUrl: string;              // URL to car image
  featured: boolean;             // Show on homepage
  features?: string[];           // ["Panorama", "Leather", "Navigation"]
  createdAt: Timestamp;          // Auto-generated
  createdBy: string;             // User UID who created it
  updatedAt?: Timestamp;         // Auto-updated on edits
}
```

## 🚀 Quick Start Guide

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow setup wizard

### Step 2: Enable Services

#### Enable Authentication:

1. Firebase Console > Authentication > Sign-in method
2. Enable "Google" provider
3. Add authorized domain (localhost for development)

#### Create Firestore Database:

1. Firebase Console > Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose location

### Step 3: Get Configuration

1. Firebase Console > Project Settings (⚙️ icon)
2. Scroll to "Your apps"
3. Click Web icon (`</>`)
4. Register app with a nickname
5. Copy the `firebaseConfig` values

### Step 4: Configure Environment

1. Create `.env.local` file (copy from `.env.local.example`):

```bash
cp .env.local.example .env.local
```

2. Fill in your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

3. Restart dev server:

```bash
npm run dev
```

### Step 5: Deploy Security Rules

#### Using Firebase Console:

1. Go to Firestore Database > Rules tab
2. Copy contents from `firestore.rules`
3. Click "Publish"

#### Using Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### Step 6: Configure Admin Access

1. Update admin emails in `firestore.rules`:

```javascript
function isAdmin() {
  return (
    isAuthenticated() &&
    request.auth.token.email in
      [
        "your-email@gmail.com", // <- Your email
        "admin@yourcompany.com",
      ]
  );
}
```

2. Update admin emails in `src/admin/contexts/AuthContext.tsx`:

```typescript
const ADMIN_EMAILS = [
  "your-email@gmail.com", // <- Your email
  "admin@yourcompany.com",
];
```

3. Deploy rules to Firebase

## 🎯 Usage Examples

### Adding a Car (Dashboard)

```typescript
import { useAuth } from "../contexts/AuthContext";
import { useCars } from "../../hooks/useCars";

function AddCarExample() {
  const { user } = useAuth();
  const { addCar } = useCars();

  const handleAdd = async () => {
    await addCar(
      {
        name: "2023 BMW X5",
        brand: "BMW",
        year: 2023,
        price: 1200000,
        mileage: 15000,
        fuel: "Diesel",
        transmission: "Automatic",
        description: "Luxusní SUV",
        imageUrl: "https://example.com/car.jpg",
        featured: true,
        features: ["Panorama", "Leather"],
      },
      user?.uid
    );
  };
}
```

### Getting Cars

```typescript
import { useCars } from "../hooks/useCars";

function CarsList() {
  const { cars, loading } = useCars();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {cars.map((car) => (
        <div key={car.id}>{car.name}</div>
      ))}
    </div>
  );
}
```

### Updating a Car

```typescript
const { updateCar } = useCars();

await updateCar(carId, {
  price: 1100000,
  featured: false,
});
```

### Deleting a Car

```typescript
const { deleteCar } = useCars();

await deleteCar(carId);
```

## 🔐 Security

### Firebase Security Rules

✅ **Public Read**: Anyone can view cars  
✅ **Admin Create**: Only admins can add cars  
✅ **Owner Update/Delete**: Only creator or admins can modify  
✅ **Email Whitelist**: Specific emails have admin access

### Client-Side Checks

- Admin status checked via `isAdmin` in AuthContext
- User ID passed for ownership tracking
- Protected routes redirect non-admins

## 🏗️ Architecture

### Data Flow

```
User Action (Dashboard)
    ↓
useCars Hook
    ↓
carsService (Firestore operations)
    ↓
Firebase Firestore
    ↓
Security Rules Validation
    ↓
Success/Error Response
```

### Fallback System

```
isFirebaseConfigured?
    ├── YES → Use Firestore
    └── NO  → Use localStorage (mock mode)
```

## 📁 File Structure

```
src/
├── admin/
│   ├── config/
│   │   └── firebase.ts              # Firebase initialization
│   └── contexts/
│       └── AuthContext.tsx          # Auth state management
├── services/
│   └── carsService.ts               # Firestore CRUD operations
├── hooks/
│   └── useCars.ts                   # Smart data hook
└── admin/pages/
    └── ManageCars.tsx               # Admin UI for car management

firestore.rules                      # Security rules
.env.local.example                   # Environment template
.env.local                           # Your credentials (gitignored)
```

## 🧪 Testing

### Development Mode (No Firebase)

- Mock authentication works automatically
- Cars stored in localStorage
- All features functional

### Production Mode (With Firebase)

- Real Google Sign-In
- Data persisted in Firestore
- Security rules enforced

## 🚨 Troubleshooting

### "Firebase not configured" error

- Create `.env.local` with valid credentials
- Restart dev server: `npm run dev`

### "Permission denied" error

- Check admin email in firestore.rules
- Verify rules are deployed
- Check Authentication tab in Firebase Console

### CORS errors

- Add domain to authorized domains:
  Firebase Console > Authentication > Settings > Authorized domains

## 📝 Next Steps

- [ ] Add Firebase Storage for car image uploads
- [ ] Implement real-time updates with `onSnapshot()`
- [ ] Add pagination for large datasets
- [ ] Implement search and filtering
- [ ] Add custom claims for role-based access
- [ ] Enable Firebase App Check for security

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [React Firebase Hooks](https://github.com/CSFrequency/react-firebase-hooks)

---

## ✨ Features Implemented

✅ Firebase Auth with Google Sign-In  
✅ Firestore database integration  
✅ CRUD operations for cars collection  
✅ Security rules with admin access  
✅ Automatic fallback to localStorage  
✅ Czech language admin interface  
✅ Type-safe TypeScript implementation  
✅ Error handling and user feedback  
✅ Real-time data synchronization ready

**Your car services web app is now powered by Firebase!** 🚀
