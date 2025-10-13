# Firebase Usage Examples

## How to Use Firebase in Your App

### 1. Adding a Car (from Dashboard)

```typescript
import { useAuth } from "../contexts/AuthContext";
import { useCars } from "../../hooks/useCars";

function ManageCars() {
  const { user } = useAuth(); // Get current user
  const { addCar } = useCars();

  const handleAddCar = async () => {
    try {
      const newCar = await addCar(
        {
          name: "2023 BMW X5",
          brand: "BMW",
          year: 2023,
          price: 1200000,
          priceFormatted: "1 200 000 Kč",
          mileage: 15000,
          fuel: "Diesel",
          transmission: "Automatic",
          description: "Luxusní SUV v perfektním stavu",
          imageUrl: "https://example.com/bmw-x5.jpg",
          featured: true,
          features: ["Panorama", "Kůže", "Navigace"],
        },
        user?.uid // Pass userId for Firestore
      );

      console.log("Car added:", newCar);
    } catch (error) {
      console.error("Error adding car:", error);
    }
  };
}
```

### 2. Getting All Cars

```typescript
import { useCars } from "../hooks/useCars";

function CarsList() {
  const { cars, loading } = useCars();

  if (loading) {
    return <div>Loading cars...</div>;
  }

  return (
    <div>
      {cars.map((car) => (
        <div key={car.id}>
          <h3>{car.name}</h3>
          <p>{car.price.toLocaleString()} Kč</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Updating a Car

```typescript
import { useCars } from "../hooks/useCars";

function EditCar({ carId }: { carId: string }) {
  const { updateCar } = useCars();

  const handleUpdate = async () => {
    try {
      await updateCar(carId, {
        price: 1100000,
        priceFormatted: "1 100 000 Kč",
        featured: false,
      });

      console.log("Car updated");
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };
}
```

### 4. Deleting a Car

```typescript
import { useCars } from "../hooks/useCars";

function DeleteCar({ carId }: { carId: string }) {
  const { deleteCar } = useCars();

  const handleDelete = async () => {
    if (confirm("Are you sure?")) {
      try {
        await deleteCar(carId);
        console.log("Car deleted");
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };
}
```

### 5. Getting Featured Cars Only

```typescript
import { useCars } from "../hooks/useCars";

function FeaturedCars() {
  const { getFeaturedCars } = useCars();

  const featuredCars = getFeaturedCars();

  return (
    <div>
      <h2>Featured Cars</h2>
      {featuredCars.map((car) => (
        <div key={car.id}>
          <h3>{car.name}</h3>
          <span className="badge">Featured</span>
        </div>
      ))}
    </div>
  );
}
```

### 6. Direct Firestore Service Usage

If you need more control, you can use the Firestore service directly:

```typescript
import {
  addCarToFirestore,
  getCarsFromFirestore,
  updateCarInFirestore,
  deleteCarFromFirestore,
} from "../services/carsService";
import { useAuth } from "../contexts/AuthContext";

function DirectFirestoreExample() {
  const { user } = useAuth();

  const addCar = async () => {
    try {
      const carId = await addCarToFirestore(
        {
          name: "2023 Audi A6",
          brand: "Audi",
          year: 2023,
          price: 950000,
          // ... other fields
        },
        user!.uid
      );
      console.log("Car added with ID:", carId);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCars = async () => {
    try {
      const cars = await getCarsFromFirestore();
      console.log("Cars:", cars);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const updateCar = async (carId: string) => {
    try {
      await updateCarInFirestore(carId, {
        price: 920000,
        featured: true,
      });
      console.log("Car updated");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteCar = async (carId: string) => {
    try {
      await deleteCarFromFirestore(carId);
      console.log("Car deleted");
    } catch (error) {
      console.error("Error:", error);
    }
  };
}
```

### 7. Authentication Examples

```typescript
import { useAuth } from "../contexts/AuthContext";

function AuthExamples() {
  const { user, isAdmin, signInWithGoogle, logout } = useAuth();

  // Sign in
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      console.log("Signed in");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await logout();
      console.log("Signed out");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // Check if user is admin
  if (isAdmin) {
    return <AdminPanel />;
  }

  // Check if user is authenticated
  if (user) {
    return <div>Welcome {user.displayName}</div>;
  }

  return <button onClick={handleSignIn}>Sign In</button>;
}
```

### 8. Protected Operations

All car operations (add, update, delete) automatically handle Firebase vs localStorage:

- **With Firebase configured**: Operations go to Firestore
- **Without Firebase**: Operations fallback to localStorage

No need to change your code when switching between environments!

### 9. Error Handling Best Practices

```typescript
import { useCars } from "../hooks/useCars";

function RobustCarManagement() {
  const { addCar, user } = useAuth();

  const handleAddCar = async (carData: any) => {
    try {
      // Validate data first
      if (!carData.name || !carData.price) {
        throw new Error("Missing required fields");
      }

      // Add car with user ID
      const newCar = await addCar(carData, user?.uid);

      // Success feedback
      alert("Car added successfully!");

      return newCar;
    } catch (error) {
      // Specific error handling
      if (error.code === "permission-denied") {
        alert("You don't have permission to add cars");
      } else if (error.code === "unauthenticated") {
        alert("Please sign in first");
      } else {
        alert("Error adding car. Please try again.");
      }

      console.error("Error details:", error);
    }
  };
}
```

### 10. Real-time Updates (Advanced)

For real-time car updates, you can use Firestore's `onSnapshot`:

```typescript
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../admin/config/firebase";
import type { Car } from "../hooks/useCars";

function RealtimeCars() {
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const q = query(collection(db, "cars"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const carsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Car[];

      setCars(carsData);
      console.log("Cars updated in real-time");
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {cars.map((car) => (
        <div key={car.id}>{car.name}</div>
      ))}
    </div>
  );
}
```

## Testing Without Firebase

The app works perfectly without Firebase configuration:

- Authentication uses mock mode
- Cars are stored in localStorage
- All features work the same way

This is great for:

- Local development
- Testing
- Demo purposes
