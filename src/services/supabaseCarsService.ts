import { supabase, isSupabaseConfigured } from "../config/supabase";
import type { Car } from "../hooks/useCars";

// Supabase Car type (with Supabase-specific fields)
export interface SupabaseCar extends Omit<Car, "id"> {
  created_at: string;
  created_by: string; // User UID who created the car
  updated_at?: string;
}

/**
 * Add a new car to Supabase
 * @param carData - Car data to add
 * @param userId - UID of the user creating the car
 * @returns The ID of the created car
 */
export const addCarToSupabase = async (
  carData: Omit<Car, "id">,
  userId: string
): Promise<string> => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Please set up your .env.local file."
    );
  }

  try {
    const carWithMetadata = {
      name: carData.name,
      brand: carData.brand,
      year: carData.year,
      price: carData.price,
      price_formatted: carData.priceFormatted,
      mileage: carData.mileage,
      fuel: carData.fuel,
      transmission: carData.transmission,
      engine_volume: carData.engineVolume,
      power: carData.power,
      description: carData.description,
      image_url: carData.imageUrl,
      image_urls: carData.imageUrls,
      featured: carData.featured,
      pinned: carData.pinned,
      features: carData.features,
      created_by: userId,
    };

    const { data, error } = await supabase
      .from("cars")
      .insert(carWithMetadata)
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    console.log("✅ Car added to Supabase with ID:", data.id);
    return data.id;
  } catch (error) {
    console.error("❌ Error adding car to Supabase:", error);
    throw error;
  }
};

/**
 * Get all cars from Supabase
 * @returns Array of cars with their IDs
 */
export const getCarsFromSupabase = async (): Promise<Car[]> => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Please set up your .env.local file."
    );
  }

  try {
    const { data, error } = await supabase
      .from("cars")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const cars: Car[] = (data || []).map((car: any) => ({
      id: car.id,
      name: car.name,
      brand: car.brand,
      year: car.year,
      price: car.price,
      priceFormatted: car.price_formatted,
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      engineVolume: car.engine_volume,
      power: car.power,
      description: car.description,
      imageUrl: car.image_url,
      imageUrls: car.image_urls,
      featured: car.featured,
      pinned: car.pinned,
      features: car.features,
    }));

    console.log(`✅ Retrieved ${cars.length} cars from Supabase`);
    return cars;
  } catch (error) {
    console.error("❌ Error getting cars from Supabase:", error);
    throw error;
  }
};

/**
 * Update a car in Supabase
 * @param carId - ID of the car to update
 * @param updates - Partial car data to update
 */
export const updateCarInSupabase = async (
  carId: string,
  updates: Partial<Omit<Car, "id">>
): Promise<void> => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Please set up your .env.local file."
    );
  }

  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Map Car properties to Supabase column names
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.brand !== undefined) updateData.brand = updates.brand;
    if (updates.year !== undefined) updateData.year = updates.year;
    if (updates.price !== undefined) updateData.price = updates.price;
    if (updates.priceFormatted !== undefined)
      updateData.price_formatted = updates.priceFormatted;
    if (updates.mileage !== undefined) updateData.mileage = updates.mileage;
    if (updates.fuel !== undefined) updateData.fuel = updates.fuel;
    if (updates.transmission !== undefined)
      updateData.transmission = updates.transmission;
    if (updates.engineVolume !== undefined)
      updateData.engine_volume = updates.engineVolume;
    if (updates.power !== undefined) updateData.power = updates.power;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.imageUrls !== undefined)
      updateData.image_urls = updates.imageUrls;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.pinned !== undefined) updateData.pinned = updates.pinned;
    if (updates.features !== undefined) updateData.features = updates.features;

    const { error } = await supabase
      .from("cars")
      .update(updateData)
      .eq("id", carId);

    if (error) {
      throw error;
    }

    console.log("✅ Car updated in Supabase:", carId);
  } catch (error) {
    console.error("❌ Error updating car in Supabase:", error);
    throw error;
  }
};

/**
 * Delete a car from Supabase
 * @param carId - ID of the car to delete
 */
export const deleteCarFromSupabase = async (carId: string): Promise<void> => {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Please set up your .env.local file."
    );
  }

  try {
    const { error } = await supabase.from("cars").delete().eq("id", carId);

    if (error) {
      throw error;
    }

    console.log("✅ Car deleted from Supabase:", carId);
  } catch (error) {
    console.error("❌ Error deleting car from Supabase:", error);
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
  if (!isSupabaseConfigured) {
    return true; // In mock mode, allow all operations
  }

  try {
    const { data, error } = await supabase
      .from("cars")
      .select("created_by")
      .eq("id", carId)
      .single();

    if (error || !data) {
      return false;
    }

    return data.created_by === userId;
  } catch (error) {
    console.error("❌ Error checking car ownership:", error);
    return false;
  }
};
