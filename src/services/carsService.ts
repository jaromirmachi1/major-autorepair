import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../admin/config/firebase";
import type { Car } from "../hooks/useCars";

// Firestore collection name
const CARS_COLLECTION = "cars";

// Firestore Car type (with Firestore-specific fields)
export interface FirestoreCar extends Omit<Car, "id"> {
  createdAt: Timestamp;
  createdBy: string; // User UID who created the car
  updatedAt?: Timestamp;
}

/**
 * Add a new car to Firestore
 * @param carData - Car data to add
 * @param userId - UID of the user creating the car
 * @returns The ID of the created car
 */
export const addCarToFirestore = async (
  carData: Omit<Car, "id">,
  userId: string
): Promise<string> => {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Please set up your .env.local file."
    );
  }

  try {
    const carWithMetadata: FirestoreCar = {
      ...carData,
      createdAt: serverTimestamp() as Timestamp,
      createdBy: userId,
    };

    const docRef = await addDoc(
      collection(db, CARS_COLLECTION),
      carWithMetadata
    );
    console.log("✅ Car added to Firestore with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding car to Firestore:", error);
    throw error;
  }
};

/**
 * Get all cars from Firestore
 * @returns Array of cars with their IDs
 */
export const getCarsFromFirestore = async (): Promise<Car[]> => {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Please set up your .env.local file."
    );
  }

  try {
    const carsQuery = query(
      collection(db, CARS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(carsQuery);

    const cars: Car[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreCar;
      return {
        id: doc.id,
        name: data.name,
        brand: data.brand,
        year: data.year,
        price: data.price,
        priceFormatted: data.priceFormatted,
        mileage: data.mileage,
        fuel: data.fuel,
        transmission: data.transmission,
        description: data.description,
        imageUrl: data.imageUrl,
        featured: data.featured,
        features: data.features,
      };
    });

    console.log(`✅ Retrieved ${cars.length} cars from Firestore`);
    return cars;
  } catch (error) {
    console.error("❌ Error getting cars from Firestore:", error);
    throw error;
  }
};

/**
 * Update a car in Firestore
 * @param carId - ID of the car to update
 * @param updates - Partial car data to update
 */
export const updateCarInFirestore = async (
  carId: string,
  updates: Partial<Omit<Car, "id">>
): Promise<void> => {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Please set up your .env.local file."
    );
  }

  try {
    const carRef = doc(db, CARS_COLLECTION, carId);
    await updateDoc(carRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log("✅ Car updated in Firestore:", carId);
  } catch (error) {
    console.error("❌ Error updating car in Firestore:", error);
    throw error;
  }
};

/**
 * Delete a car from Firestore
 * @param carId - ID of the car to delete
 */
export const deleteCarFromFirestore = async (carId: string): Promise<void> => {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Please set up your .env.local file."
    );
  }

  try {
    await deleteDoc(doc(db, CARS_COLLECTION, carId));
    console.log("✅ Car deleted from Firestore:", carId);
  } catch (error) {
    console.error("❌ Error deleting car from Firestore:", error);
    throw error;
  }
};

/**
 * Check if a user owns a car (created it)
 * @param carId - ID of the car
 * @param userId - UID of the user
 * @returns true if user owns the car
 */
export const userOwnsCar = async (
  carId: string,
  userId: string
): Promise<boolean> => {
  if (!isFirebaseConfigured) {
    return true; // In mock mode, allow all operations
  }

  try {
    const carsQuery = query(collection(db, CARS_COLLECTION));
    const querySnapshot = await getDocs(carsQuery);

    const carDoc = querySnapshot.docs.find((doc) => doc.id === carId);
    if (!carDoc) return false;

    const data = carDoc.data() as FirestoreCar;
    return data.createdBy === userId;
  } catch (error) {
    console.error("❌ Error checking car ownership:", error);
    return false;
  }
};
