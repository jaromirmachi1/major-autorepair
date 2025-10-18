import { useState, useEffect } from "react";
import { isSupabaseConfigured } from "../config/supabase";
import {
  getCarsFromSupabase,
  addCarToSupabase,
  updateCarInSupabase,
  deleteCarFromSupabase,
} from "../services/supabaseCarsService";

export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  priceFormatted?: string; // For display purposes
  mileage: number;
  fuel: string;
  transmission: string;
  engineVolume?: string; // Engine volume (e.g., "2.0L", "3.0L")
  power?: string; // Engine power (e.g., "150 kW", "200 HP")
  description: string;
  imageUrl: string;
  imageUrls?: string[]; // Array of all images
  featured: boolean;
  pinned: boolean; // Pinned cars show prominently on homepage
  features?: string[]; // Optional features array for homepage display
}

// Initial mock cars data
const initialCars: Car[] = [
  {
    id: "1",
    name: "2020 BMW 3 Series",
    brand: "BMW",
    year: 2020,
    price: 720000,
    priceFormatted: "720 000 Kč",
    mileage: 72000,
    fuel: "Gasoline",
    transmission: "Automatic",
    engineVolume: "2.0L",
    power: "190 kW",
    description:
      "Krásné BMW 3 Series v perfektním stavu s kompletní servisní historií.",
    imageUrl:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
    featured: true,
    pinned: true,
    features: ["Automatická", "Kožený Interiér", "Navigace"],
  },
  {
    id: "2",
    name: "2019 Mercedes C-Class",
    brand: "Mercedes-Benz",
    year: 2019,
    price: 810000,
    priceFormatted: "810 000 Kč",
    mileage: 61000,
    fuel: "Diesel",
    transmission: "Automatic",
    engineVolume: "2.0L",
    power: "143 kW",
    description:
      "Luxusní Mercedes C-Class s premium vybavením a nízkou spotřebou.",
    imageUrl:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    featured: true,
    pinned: false,
    features: ["Premium Zvuk", "Panorama", "Sportovní Paket"],
  },
  {
    id: "3",
    name: "2021 Audi A4",
    brand: "Audi",
    year: 2021,
    price: 895000,
    priceFormatted: "895 000 Kč",
    mileage: 40000,
    fuel: "Gasoline",
    transmission: "Automatic",
    engineVolume: "2.0L",
    power: "180 kW",
    description:
      "Téměř nové Audi A4 s Quattro pohonem a špičkovou technologií.",
    imageUrl:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
    featured: true,
    pinned: true,
    features: ["Quattro AWD", "LED Světla", "Tech Paket"],
  },
  {
    id: "4",
    name: "2020 Tesla Model 3",
    brand: "Tesla",
    year: 2020,
    price: 950000,
    priceFormatted: "950 000 Kč",
    mileage: 48000,
    fuel: "Electric",
    transmission: "Automatic",
    engineVolume: "Electric",
    power: "283 kW",
    description:
      "Elektromobil budoucnosti s autopilot funkcí a dlouhým dojezdem.",
    imageUrl:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
    featured: true,
    pinned: false,
    features: ["Autopilot", "Premium Interiér", "Long Range"],
  },
  {
    id: "5",
    name: "2019 Lexus ES 350",
    brand: "Lexus",
    year: 2019,
    price: 735000,
    priceFormatted: "735 000 Kč",
    mileage: 67000,
    fuel: "Gasoline",
    transmission: "Automatic",
    engineVolume: "3.5L",
    power: "225 kW",
    description: "Japonská kvalita a spolehlivost v luxusním balení.",
    imageUrl:
      "https://images.unsplash.com/photo-1623869675781-80aa31bcc9e9?w=800&q=80",
    featured: false,
    pinned: false,
    features: ["Luxury Paket", "Vyhřívané Sedačky", "Couvací Kamera"],
  },
  {
    id: "6",
    name: "2021 Porsche Macan",
    brand: "Porsche",
    year: 2021,
    price: 1295000,
    priceFormatted: "1 295 000 Kč",
    mileage: 29000,
    fuel: "Gasoline",
    transmission: "Automatic",
    engineVolume: "2.9L",
    power: "280 kW",
    description:
      "Sportovní SUV s legendárním Porsche DNA a výjimečným výkonem.",
    imageUrl:
      "https://images.unsplash.com/photo-1611821064430-f1c3f4f7e6c7?w=800&q=80",
    featured: true,
    pinned: true,
    features: ["Sport Chrono", "Premium Audio", "Panoramatická Střecha"],
  },
];

const STORAGE_KEY = "cars";

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize cars from Supabase or localStorage (fallback)
  useEffect(() => {
    const loadCars = async () => {
      try {
        if (isSupabaseConfigured) {
          // Load from Supabase
          const supabaseCars = await getCarsFromSupabase();
          setCars(supabaseCars);
          console.log("✅ Loaded cars from Supabase");
        } else {
          // Fallback to localStorage for development without Supabase
          const storedCars = localStorage.getItem(STORAGE_KEY);

          if (storedCars) {
            try {
              const parsed = JSON.parse(storedCars);

              // Validate data structure
              const isValidStructure =
                Array.isArray(parsed) &&
                (parsed.length === 0 ||
                  (parsed[0].hasOwnProperty("featured") &&
                    parsed[0].hasOwnProperty("imageUrl")));

              if (isValidStructure) {
                setCars(parsed);
              } else {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCars));
                setCars(initialCars);
              }
            } catch (error) {
              console.error("Error parsing cars from localStorage:", error);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCars));
              setCars(initialCars);
            }
          } else {
            // First time load - save initial cars to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCars));
            setCars(initialCars);
          }
          console.log("⚠️ Using localStorage (Supabase not configured)");
        }
      } catch (error) {
        console.error("Error loading cars:", error);
        // Fallback to localStorage on error
        const storedCars = localStorage.getItem(STORAGE_KEY);
        if (storedCars) {
          setCars(JSON.parse(storedCars));
        } else {
          setCars(initialCars);
        }
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  // Save cars to localStorage (fallback only)
  const saveToLocalStorage = (updatedCars: Car[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCars));
    setCars(updatedCars);
  };

  const addCar = async (car: Omit<Car, "id">, userId?: string) => {
    try {
      console.log("useCars addCar called with:", {
        car,
        userId,
        isSupabaseConfigured,
      });

      if (isSupabaseConfigured && userId) {
        // Add to Supabase
        console.log("Using Supabase");
        const carId = await addCarToSupabase(car, userId);
        const newCar: Car = { ...car, id: carId };
        setCars([newCar, ...cars]); // Add to beginning (newest first)
        return newCar;
      } else {
        // Fallback to localStorage
        console.log("Using localStorage fallback");
        const newCar: Car = {
          ...car,
          id: Date.now().toString(),
        };
        const updatedCars = [newCar, ...cars];
        saveToLocalStorage(updatedCars);
        return newCar;
      }
    } catch (error) {
      console.error("Error adding car:", error);
      throw error;
    }
  };

  const updateCar = async (id: string, updates: Partial<Car>) => {
    try {
      if (isSupabaseConfigured) {
        // Update in Supabase
        await updateCarInSupabase(id, updates);
        const updatedCars = cars.map((car) =>
          car.id === id ? { ...car, ...updates } : car
        );
        setCars(updatedCars);
      } else {
        // Fallback to localStorage
        const updatedCars = cars.map((car) =>
          car.id === id ? { ...car, ...updates } : car
        );
        saveToLocalStorage(updatedCars);
      }
    } catch (error) {
      console.error("Error updating car:", error);
      throw error;
    }
  };

  const deleteCar = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        // Delete from Supabase
        await deleteCarFromSupabase(id);
        const updatedCars = cars.filter((car) => car.id !== id);
        setCars(updatedCars);
      } else {
        // Fallback to localStorage
        const updatedCars = cars.filter((car) => car.id !== id);
        saveToLocalStorage(updatedCars);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      throw error;
    }
  };

  const getFeaturedCars = () => {
    return cars.filter((car) => car.featured);
  };

  return {
    cars,
    loading,
    addCar,
    updateCar,
    deleteCar,
    getFeaturedCars,
  };
};
