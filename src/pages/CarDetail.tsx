import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCars, type Car } from "../hooks/useCars";
import GlassSurface from "../components/GlassSurface";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LenisProvider from "../components/LenisProvider";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cars, loading } = useCars();
  const [car, setCar] = useState<Car | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    if (id && cars.length > 0) {
      const foundCar = cars.find((c) => c.id === id);
      if (foundCar) {
        setCar(foundCar);
      } else {
        // Car not found, redirect to inventory
        navigate("/cars-inventory");
      }
    }
  }, [id, cars, navigate]);

  if (loading) {
    return (
      <LenisProvider>
        <div className="min-h-screen bg-black">
          <Header />
          <main className="pt-20">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
              <div className="text-center text-white text-2xl">
                Načítání vozidla...
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </LenisProvider>
    );
  }

  if (!car) {
    return (
      <LenisProvider>
        <div className="min-h-screen bg-black">
          <Header />
          <main className="pt-20">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
              <div className="text-center text-white text-2xl">
                Vozidlo nebylo nalezeno
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </LenisProvider>
    );
  }

  const images = car.imageUrls || [car.imageUrl];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Touch/swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }

      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <LenisProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-20">
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="relative"
              >
                <div className="flex items-center gap-2 text-white font-semibold">
                  <svg
                    className="w-5 h-5"
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
                  Zpět
                </div>
              </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                {/* Main Image */}
                <div className="relative group">
                  <div
                    className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden cursor-pointer"
                    onClick={openImageModal}
                    onTouchStart={
                      hasMultipleImages ? handleTouchStart : undefined
                    }
                  >
                    <img
                      src={images[currentImageIndex]}
                      alt={`${car.name} - obrázek ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Image Navigation Arrows */}
                    {hasMultipleImages && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                        >
                          <GlassSurface
                            width="100%"
                            height="100%"
                            borderRadius={24}
                            brightness={20}
                            opacity={0.8}
                            blur={15}
                            displace={1.8}
                            backgroundOpacity={0.3}
                            saturation={1.2}
                            className="w-full h-full rounded-full flex items-center justify-center hover:brightness-30 transition-all duration-300"
                          >
                            <svg
                              className="w-6 h-6 text-white hover:text-gray-400 transition-colors duration-200"
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
                          </GlassSurface>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                        >
                          <GlassSurface
                            width="100%"
                            height="100%"
                            borderRadius={24}
                            brightness={20}
                            opacity={0.8}
                            blur={15}
                            displace={1.8}
                            backgroundOpacity={0.3}
                            saturation={1.2}
                            className="w-full h-full rounded-full flex items-center justify-center hover:brightness-30 transition-all duration-300"
                          >
                            <svg
                              className="w-6 h-6 text-white hover:text-gray-400 transition-colors duration-200"
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
                          </GlassSurface>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                          <GlassSurface
                            width="auto"
                            height={32}
                            borderRadius={16}
                            brightness={20}
                            opacity={0.8}
                            blur={15}
                            displace={1.8}
                            backgroundOpacity={0.3}
                            saturation={1.2}
                            className="px-4 py-2"
                          >
                            <span className="text-sm text-white font-medium">
                              {currentImageIndex + 1} / {images.length}
                            </span>
                          </GlassSurface>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {hasMultipleImages && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                          index === currentImageIndex
                            ? "ring-2 ring-red-primary scale-105"
                            : "opacity-70 hover:opacity-100 hover:scale-105"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${car.name} - náhled ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Car Information */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Header */}
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-4xl lg:text-5xl font-bold text-white mb-4"
                  >
                    {car.name}
                  </motion.h1>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center gap-4 mb-6"
                  >
                    <span className="text-2xl font-bold text-red-primary">
                      {car.priceFormatted || `${car.price.toLocaleString()} Kč`}
                    </span>
                    {car.featured && (
                      <span className="bg-red-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Doporučeno
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Key Specifications */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Klíčové Specifikace
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <GlassSurface
                      width="100%"
                      height={80}
                      borderRadius={12}
                      brightness={20}
                      opacity={0.8}
                      blur={15}
                      displace={1.8}
                      backgroundOpacity={0.3}
                      saturation={1.2}
                      className="p-4"
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {car.year}
                        </div>
                        <div className="text-sm text-gray-300">Rok výroby</div>
                      </div>
                    </GlassSurface>

                    <GlassSurface
                      width="100%"
                      height={80}
                      borderRadius={12}
                      brightness={20}
                      opacity={0.8}
                      blur={15}
                      displace={1.8}
                      backgroundOpacity={0.3}
                      saturation={1.2}
                      className="p-4"
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">
                          {car.mileage.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-300">km</div>
                      </div>
                    </GlassSurface>

                    <GlassSurface
                      width="100%"
                      height={80}
                      borderRadius={12}
                      brightness={20}
                      opacity={0.8}
                      blur={15}
                      displace={1.8}
                      backgroundOpacity={0.3}
                      saturation={1.2}
                      className="p-4"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          {car.fuel}
                        </div>
                        <div className="text-sm text-gray-300">Palivo</div>
                      </div>
                    </GlassSurface>

                    <GlassSurface
                      width="100%"
                      height={80}
                      borderRadius={12}
                      brightness={20}
                      opacity={0.8}
                      blur={15}
                      displace={1.8}
                      backgroundOpacity={0.3}
                      saturation={1.2}
                      className="p-4"
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">
                          {car.transmission}
                        </div>
                        <div className="text-sm text-gray-300">Převodovka</div>
                      </div>
                    </GlassSurface>
                  </div>
                </motion.div>

                {/* Features */}
                {car.features && car.features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Vybavení
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {car.features.map((feature, index) => (
                        <GlassSurface
                          key={index}
                          width="auto"
                          height={40}
                          borderRadius={20}
                          brightness={20}
                          opacity={0.8}
                          blur={15}
                          displace={1.8}
                          backgroundOpacity={0.3}
                          saturation={1.2}
                          className="px-4 py-2"
                        >
                          <span className="text-white text-sm font-medium">
                            {feature}
                          </span>
                        </GlassSurface>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Popis
                  </h3>
                  <GlassSurface
                    width="100%"
                    height="auto"
                    borderRadius={12}
                    brightness={20}
                    opacity={0.8}
                    blur={15}
                    displace={1.8}
                    backgroundOpacity={0.3}
                    saturation={1.2}
                    className="p-6"
                  >
                    <p className="text-gray-300 leading-relaxed">
                      {car.description}
                    </p>
                  </GlassSurface>
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Scroll to contact section or navigate to contact page
                      const contactSection = document.getElementById("contact");
                      if (contactSection) {
                        contactSection.scrollIntoView({ behavior: "smooth" });
                      } else {
                        navigate("/#contact");
                      }
                    }}
                    className="relative w-full"
                  >
                    <GlassSurface
                      width="100%"
                      height={56}
                      borderRadius={12}
                      brightness={20}
                      opacity={0.8}
                      blur={15}
                      displace={1.8}
                      backgroundOpacity={0.3}
                      saturation={1.2}
                      className="py-4"
                    >
                      <span className="text-white font-semibold text-lg">
                        Kontaktovat Prodejce
                      </span>
                    </GlassSurface>
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />

        {/* Image Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <img
                src={images[currentImageIndex]}
                alt={`${car.name} - obrázek ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />

              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
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
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
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
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-4 py-2">
                    <span className="text-white text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </LenisProvider>
  );
};

export default CarDetail;
