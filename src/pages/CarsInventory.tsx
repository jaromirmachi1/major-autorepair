import { motion } from "framer-motion";
import { useCars } from "../hooks/useCars";
import GlassSurface from "../components/GlassSurface";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CarsInventory = () => {
  const { cars, loading } = useCars();

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="pt-20">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center text-white text-2xl">
              Načítání vozidel...
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
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
              cars.map((car, index) => (
                <motion.div
                  key={car.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
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
                  <div className="relative h-80 rounded-2xl overflow-hidden bg-black">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    </div>

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

                      {/* CTA Button - Hidden by default, shown on hover */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-out"
                      >
                        <GlassSurface
                          width="100%"
                          height={48}
                          borderRadius={0}
                          brightness={20}
                          opacity={0.8}
                          blur={15}
                          displace={1.8}
                          backgroundOpacity={0.2}
                          saturation={1.2}
                          className="py-3 px-6"
                        >
                          <span className="text-white font-semibold">
                            Zobrazit Detail
                          </span>
                        </GlassSurface>
                      </motion.button>

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
              ))
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
              <GlassSurface
                width="auto"
                height={56}
                borderRadius={12}
                brightness={20}
                opacity={0.8}
                blur={15}
                displace={1.8}
                backgroundOpacity={0.3}
                saturation={1.2}
                className="px-8 py-4"
              >
                <span className="text-white font-semibold text-lg">
                  ← Zpět na Hlavní Stránku
                </span>
              </GlassSurface>
            </motion.button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CarsInventory;
