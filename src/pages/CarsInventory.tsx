import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCars } from "../hooks/useCars";
import SimpleGlassSurface from "../components/SimpleGlassSurface";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LenisProvider from "../components/LenisProvider";

const CarsInventory = () => {
  const { cars, loading } = useCars();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: string]: number;
  }>({});

  const getCurrentImage = (car: any) => {
    const images = car.imageUrls || [car.imageUrl];
    const index = currentImageIndex[car.id] || 0;
    return images[index] || car.imageUrl;
  };

  const nextImage = (carId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [carId]: ((prev[carId] || 0) + 1) % totalImages,
    }));
  };

  const prevImage = (carId: string, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [carId]: ((prev[carId] || 0) - 1 + totalImages) % totalImages,
    }));
  };

  // Touch/swipe support
  const handleTouchStart = (
    e: React.TouchEvent,
    carId: string,
    totalImages: number
  ) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        // Minimum swipe distance
        if (diff > 0) {
          nextImage(carId, totalImages);
        } else {
          prevImage(carId, totalImages);
        }
      }

      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchend", handleTouchEnd);
  };

  if (loading) {
    return (
      <LenisProvider>
        <div className="min-h-screen bg-black">
          <Header />
          <main className="pt-20">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
              <div className="text-center text-white text-2xl">
                Načítání vozidel...
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </LenisProvider>
    );
  }

  return (
    <LenisProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Kompletní <span className="text-red-primary">Inventář</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Prohlédněte si všechna dostupná vozidla v našem inventáři
              </p>
            </motion.div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cars.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12">
                  <p className="text-lg">
                    Žádná vozidla nejsou momentálně k dispozici.
                  </p>
                </div>
              ) : (
                cars.map((car, index) => {
                  const images = car.imageUrls || [car.imageUrl];
                  const hasMultipleImages = images.length > 1;
                  const currentImage = getCurrentImage(car);

                  return (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => navigate(`/car/${car.id}`)}
                      className="relative group cursor-pointer rounded-2xl p-[2px] bg-gradient-to-r from-black via-black to-black hover:from-red-primary hover:via-red-light hover:to-red-primary transition-all duration-500"
                    >
                      {/* Animated Border Effect */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                        <div
                          className="absolute inset-0 rounded-2xl animate-border-spin"
                          style={{
                            background:
                              "conic-gradient(from 0deg, #ED232D, #F04B54, #ED232D, #C41E26, #ED232D)",
                            filter: "blur(8px)",
                          }}
                        />
                      </div>

                      {/* Card Content */}
                      <div
                        className="relative h-80 rounded-2xl overflow-hidden bg-black"
                        onTouchStart={(e) =>
                          hasMultipleImages &&
                          handleTouchStart(e, car.id, images.length)
                        }
                      >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img
                            src={currentImage}
                            alt={car.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                        </div>

                        {/* Image Navigation Arrows */}
                        {hasMultipleImages && (
                          <>
                            {/* Previous Arrow */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                prevImage(car.id, images.length);
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                            >
                              <SimpleGlassSurface
                                width="100%"
                                height="100%"
                                borderRadius={20}
                                className="w-full h-full rounded-full flex items-center justify-center hover:brightness-30 transition-all duration-300"
                              >
                                <svg
                                  className="w-5 h-5 text-white hover:text-gray-400 transition-colors duration-200"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </SimpleGlassSurface>
                            </button>

                            {/* Next Arrow */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                nextImage(car.id, images.length);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                            >
                              <SimpleGlassSurface
                                width="100%"
                                height="100%"
                                borderRadius={20}
                                className="w-full h-full rounded-full flex items-center justify-center hover:brightness-30 transition-all duration-300"
                              >
                                <svg
                                  className="w-5 h-5 text-white hover:text-gray-400 transition-colors duration-200"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </SimpleGlassSurface>
                            </button>

                            {/* Image Counter */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                              <SimpleGlassSurface
                                width="auto"
                                height={24}
                                borderRadius={12}
                                className="px-3 py-1"
                              >
                                <span className="text-xs text-white font-medium">
                                  {(currentImageIndex[car.id] || 0) + 1} /{" "}
                                  {images.length}
                                </span>
                              </SimpleGlassSurface>
                            </div>
                          </>
                        )}

                        {/* Content */}
                        <div className="relative h-full flex flex-col justify-end">
                          {/* Price Badge */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="absolute top-4 right-4 px-3 py-1 rounded-lg font-bold text-sm bg-red-primary text-white"
                          >
                            {car.priceFormatted ||
                              `${car.price.toLocaleString()} Kč`}
                          </motion.div>

                          {/* CTA Overlay - Hidden by default, shown on hover */}
                          <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out">
                            <SimpleGlassSurface
                              width="100%"
                              height={48}
                              borderRadius={0}
                              className="py-3 px-6"
                            >
                              <span className="text-white font-semibold">
                                Zobrazit Detail
                              </span>
                            </SimpleGlassSurface>
                          </div>

                          {/* Car Info - Slides up on hover */}
                          <div className="relative transform transition-transform duration-1000 ease-out group-hover:-translate-y-12 p-4 space-y-2">
                            <div>
                              <h3 className="text-lg md:text-xl font-bold text-white mb-1 group-hover:text-red-primary transition-colors duration-300">
                                {car.name}
                              </h3>
                              <p className="text-gray-300 text-sm">
                                {car.mileage.toLocaleString()} km
                              </p>
                            </div>

                            {/* Features */}
                            <div className="flex flex-wrap gap-1">
                              {car.features &&
                                car.features.slice(0, 2).map((feature, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs border border-white/20"
                                  >
                                    {feature}
                                  </span>
                                ))}
                              {car.features && car.features.length > 2 && (
                                <span className="bg-white/10 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs border border-white/20">
                                  +{car.features.length - 2}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Back to Home Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
                className="relative"
              >
                <SimpleGlassSurface
                  width="auto"
                  height={56}
                  borderRadius={12}
                  className="px-8 py-4"
                >
                  <span className="text-white font-semibold text-lg">
                    ← Zpět na Hlavní Stránku
                  </span>
                </SimpleGlassSurface>
              </motion.button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
};

export default CarsInventory;
