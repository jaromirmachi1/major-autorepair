import { motion } from "framer-motion";
import { useState } from "react";
import { useCars } from "../hooks/useCars";
import GlassSurface from "../components/GlassSurface";

const Cars = () => {
  const { cars: allCars, loading } = useCars();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Get only featured cars for homepage display
  const cars = allCars.filter((car) => car.featured);

  // Define grid spans for visual variety (cycle through patterns)
  const gridSpans = [
    "col-span-1 row-span-1",
    "col-span-1 md:col-span-2 row-span-1",
    "col-span-1 md:col-span-2 row-span-1 md:row-span-2",
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-1 md:col-span-2 row-span-1",
  ];

  if (loading) {
    return (
      <section id="cars" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white text-2xl">
            Načítání vozidel...
          </div>
        </div>
      </section>
    );
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="cars" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prémiová <span className="text-red-primary">Ojetá Auta</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Pečlivě vybraná kvalitní vozidla zkontrolovaná a certifikovaná
            našimi experty
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] gap-4 relative"
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight Effect */}
          <div
            className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
            style={{
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(237, 35, 45, 0.08), rgba(237, 35, 45, 0.03) 30%, transparent 60%)`,
            }}
          />

          {cars.length === 0 ? (
            <div className="col-span-3 text-center text-gray-400 py-12">
              No featured cars available at the moment.
            </div>
          ) : (
            cars.map((car, index) => {
              const span = gridSpans[index % gridSpans.length];
              return (
                <motion.div
                  key={car.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`${span} relative group cursor-pointer rounded-2xl p-[2px] bg-gradient-to-r from-black via-black to-black hover:from-red-primary hover:via-red-light hover:to-red-primary transition-all duration-500 z-0`}
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
                  <div className="relative h-full rounded-2xl overflow-hidden bg-black z-0">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={car.imageUrl}
                        alt={car.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-end z-10">
                      {/* Price Badge */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="absolute top-4 right-4 bg-red-primary text-white px-4 py-2 rounded-lg font-bold text-sm z-20"
                      >
                        {car.priceFormatted ||
                          `${car.price.toLocaleString()} Kč`}
                      </motion.div>

                      {/* CTA Button - Hidden by default, shown at bottom on hover */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 z-10"
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
                          <span className="text-black font-semibold">
                            Zobrazit Detail
                          </span>
                        </GlassSurface>
                      </motion.button>

                      {/* Car Info - Slides up on hover */}
                      <div className="relative transform transition-transform duration-300 ease-out group-hover:-translate-y-12 p-6 space-y-3 z-20">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-red-primary transition-colors duration-300">
                            {car.name}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {car.mileage.toLocaleString()} km
                          </p>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2">
                          {car.features &&
                            car.features.map((feature, idx) => (
                              <span
                                key={idx}
                                className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs border border-white/20"
                              >
                                {feature}
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
                Zobrazit Veškerý Inventář
              </span>
            </GlassSurface>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Cars;
