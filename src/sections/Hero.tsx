import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Wrench, CircleDot, Battery, Shield, Wind, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const Hero = () => {
  const services: Service[] = [
    {
      icon: Wrench,
      title: "Generální Opravy",
      description:
        "Odborné mechanické opravy všech značek a modelů. Od diagnostiky motoru po práci na převodovce.",
      color: "from-blue-600 to-blue-800",
    },
    {
      icon: CircleDot,
      title: "Servis Pneumatik",
      description:
        "Kompletní pneuservis včetně výměny, přezutí, vyvážení a geometrie kol.",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Battery,
      title: "Baterie & Elektrika",
      description:
        "Kompletní diagnostika elektrických systémů, výměna baterií a alternátorů.",
      color: "from-blue-700 to-blue-900",
    },
    {
      icon: Shield,
      title: "Brzdový Systém",
      description:
        "Profesionální kontrola brzd, výměna destiček, broušení kotoučů a opravy hydrauliky.",
      color: "from-blue-600 to-blue-800",
    },
    {
      icon: Wind,
      title: "Klimatizace & Topení",
      description:
        "Opravy klimatizace, doplnění chladiva a údržba systému HVAC.",
      color: "from-blue-500 to-blue-700",
    },
    {
      icon: Search,
      title: "Diagnostika",
      description:
        "Špičková počítačová diagnostika pro rychlé zjištění a řešení jakýchkoli problémů vozidla.",
      color: "from-blue-800 to-blue-950",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [services.length]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/90 z-10" />
        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80"
          alt="Car background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Váš Důvěryhodný
              <span className="block text-red-primary mt-2">Auto Expert</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Profesionální autoservis a kvalitní ojetá vozidla. Dokonalost v
              každém detailu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-red-primary hover:bg-red-dark text-white font-semibold rounded-lg shadow-lg transition-all duration-300 text-lg"
              >
                Naše Služby
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("cars")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300 text-lg"
              >
                Prohlédnout Auta
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Card Stack */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-full flex items-center justify-center"
            style={{ minHeight: "500px" }}
          >
            {/* Card Stack Container */}
            <div className="relative w-[500px] h-[400px]">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = index === currentIndex;
                const isNext = index === (currentIndex + 1) % services.length;
                const isPrev =
                  index ===
                  (currentIndex - 1 + services.length) % services.length;
                const isVisible = isActive || isNext || isPrev;

                if (!isVisible) return null;

                const zIndex = isActive ? 30 : isNext ? 20 : 10;
                const scale = isActive ? 1 : isNext ? 0.95 : 0.9;
                const translateY = isActive ? 0 : isNext ? 15 : 30;
                const translateX = isActive ? 0 : isNext ? 8 : 16;
                const rotateY = isActive ? 0 : isNext ? -8 : -15;
                const rotateX = isActive ? 0 : isNext ? 2 : 4;
                const opacity = isActive ? 1 : isNext ? 0.8 : 0.6;

                return (
                  <motion.div
                    key={index}
                    initial={{
                      scale: 0.8,
                      opacity: 0,
                      y: 50,
                      x: 20,
                      rotateY: -15,
                      rotateX: 5,
                    }}
                    animate={{
                      scale,
                      opacity,
                      y: translateY,
                      x: translateX,
                      rotateY,
                      rotateX,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                      delay: index * 0.1,
                    }}
                    className="absolute bottom-0 w-full"
                    style={{
                      zIndex,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div
                      className={`relative bg-gradient-to-br ${service.color} rounded-2xl p-8 shadow-2xl cursor-pointer border border-white/10 h-[350px] flex flex-col`}
                      onClick={() => {
                        setCurrentIndex(index);
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />

                      {/* Content */}
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                          <Icon
                            className="w-8 h-8 text-white"
                            strokeWidth={2}
                          />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">
                          {service.title}
                        </h3>

                        <p className="text-white/90 text-sm leading-relaxed flex-grow">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-white"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
