// Utility to manually load mock cars into localStorage
// This can be used in development when you want to reset or add mock data

import type { Car } from "../hooks/useCars";

export const mockCars: Car[] = [
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
    description:
      "Sportovní SUV s legendárním Porsche DNA a výjimečným výkonem.",
    imageUrl:
      "https://images.unsplash.com/photo-1611821064430-f1c3f4f7e6c7?w=800&q=80",
    featured: true,
    pinned: true,
    features: ["Sport Chrono", "Premium Audio", "Panoramatická Střecha"],
  },
];

export const loadMockCarsToLocalStorage = () => {
  try {
    localStorage.setItem("cars", JSON.stringify(mockCars));
    console.log(
      "✅ Mock cars loaded to localStorage:",
      mockCars.length,
      "cars"
    );
    return true;
  } catch (error) {
    console.error("❌ Error loading mock cars to localStorage:", error);
    return false;
  }
};

export const clearLocalStorageCars = () => {
  try {
    localStorage.removeItem("cars");
    console.log("✅ Cars cleared from localStorage");
    return true;
  } catch (error) {
    console.error("❌ Error clearing localStorage:", error);
    return false;
  }
};

// Auto-load mock cars if localStorage is empty (development mode)
export const autoLoadMockCars = () => {
  if (typeof window !== "undefined") {
    const existingCars = localStorage.getItem("cars");
    if (!existingCars) {
      loadMockCarsToLocalStorage();
    }
  }
};
