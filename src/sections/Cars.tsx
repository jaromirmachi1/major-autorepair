import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Cars = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cars = [
    {
      id: 1,
      name: "2020 BMW 3 Series",
      price: "720 000 Kč",
      mileage: "72 000 km",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      features: ["Automatická", "Kožený Interiér", "Navigace"],
      span: "col-span-1 row-span-1",
    },
    {
      id: 2,
      name: "2019 Mercedes C-Class",
      price: "810 000 Kč",
      mileage: "61 000 km",
      image:
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
      features: ["Premium Zvuk", "Panorama", "Sportovní Paket"],
      span: "col-span-1 md:col-span-2 row-span-1",
    },
    {
      id: 3,
      name: "2021 Audi A4",
      price: "895 000 Kč",
      mileage: "40 000 km",
      image:
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      features: ["Quattro AWD", "LED Světla", "Tech Paket"],
      span: "col-span-1 md:col-span-2 row-span-1 md:row-span-2",
    },
    {
      id: 4,
      name: "2020 Tesla Model 3",
      price: "950 000 Kč",
      mileage: "48 000 km",
      image:
        "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
      features: ["Autopilot", "Premium Interiér", "Long Range"],
      span: "col-span-1 row-span-1",
    },
    {
      id: 5,
      name: "2019 Lexus ES 350",
      price: "735 000 Kč",
      mileage: "67 000 km",
      image:
        "https://images.unsplash.com/photo-1623869675781-80aa31bcc9e9?w=800&q=80",
      features: ["Luxury Paket", "Vyhřívané Sedačky", "Couvací Kamera"],
      span: "col-span-1 row-span-1",
    },
    {
      id: 6,
      name: "2021 Porsche Macan",
      price: "1 295 000 Kč",
      mileage: "29 000 km",
      image:
        "https://images.unsplash.com/photo-1611821064430-f1c3f4f7e6c7?w=800&q=80",
      features: ["Sport Chrono", "Premium Audio", "Panoramatická Střecha"],
      span: "col-span-1 md:col-span-2 row-span-1",
    },
  ];

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
    <section id="cars" className="py-20 bg-black" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
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
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] gap-4">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`${car.span} relative group cursor-pointer rounded-2xl p-[2px] bg-gradient-to-r from-black via-black to-black hover:from-red-primary hover:via-red-light hover:to-red-primary transition-all duration-500`}
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
              <div className="relative h-full rounded-2xl overflow-hidden bg-black">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-6">
                  {/* Price Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="absolute top-4 right-4 bg-red-primary text-white px-4 py-2 rounded-lg font-bold text-sm"
                  >
                    {car.price}
                  </motion.div>

                  {/* Car Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-red-primary transition-colors duration-300">
                        {car.name}
                      </h3>
                      <p className="text-gray-300 text-sm">{car.mileage}</p>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {car.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs border border-white/20"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-white text-black py-3 rounded-lg font-semibold hover:bg-red-primary hover:text-white transition-all duration-300 mt-2 opacity-0 group-hover:opacity-100"
                    >
                      Zobrazit Detail
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-red-primary text-white font-semibold rounded-lg hover:bg-red-dark transition-all duration-300 text-lg"
          >
            Zobrazit Veškerý Inventář
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Cars;
