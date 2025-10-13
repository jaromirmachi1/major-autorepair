import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";
import { Wrench, CircleDot, Battery, Shield, Wind, Search } from "lucide-react";
import GlassSurface from "../components/GlassSurface";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

const SpotlightCard = ({ children, className = "" }: SpotlightCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-xl bg-gray-50 ${className}`}
      style={{
        background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
      }}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.15), transparent 40%)`,
        }}
      />

      {/* Border spotlight effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(239, 68, 68, 0.4), transparent 40%)`,
          maskImage:
            "linear-gradient(black, black) content-box, linear-gradient(black, black)",
          maskComposite: "exclude",
          padding: "2px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Static border */}
      <div className="absolute inset-0 rounded-xl border-2 border-gray-200 pointer-events-none" />
    </div>
  );
};

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: Wrench,
      title: "Generální Opravy",
      description:
        "Odborné mechanické opravy všech značek a modelů. Od diagnostiky motoru po práci na převodovce.",
    },
    {
      icon: CircleDot,
      title: "Servis Pneumatik",
      description:
        "Kompletní pneuservis včetně výměny, přezutí, vyvážení a geometrie kol.",
    },
    {
      icon: Battery,
      title: "Baterie & Elektrika",
      description:
        "Kompletní diagnostika elektrických systémů, výměna baterií a alternátorů.",
    },
    {
      icon: Shield,
      title: "Brzdový Systém",
      description:
        "Profesionální kontrola brzd, výměna destiček, broušení kotoučů a opravy hydrauliky.",
    },
    {
      icon: Wind,
      title: "Klimatizace & Topení",
      description:
        "Opravy klimatizace, doplnění chladiva a údržba systému HVAC.",
    },
    {
      icon: Search,
      title: "Diagnostika",
      description:
        "Špičková počítačová diagnostika pro rychlé zjištění a řešení jakýchkoli problémů vozidla.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="services" className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Naše <span className="text-red-primary">Služby</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Profesionální autoservis s precizností a péčí o každý detail
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <SpotlightCard className="cursor-pointer h-full">
                  <div className="p-8">
                    <div className="w-16 h-16 bg-red-primary rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-3 transition-colors duration-300 hover:text-red-primary">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
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
              backgroundOpacity={0.4}
              saturation={1.2}
              className="px-8 py-4"
            >
              <span className="text-black font-semibold text-lg">
                Objednat Servis
              </span>
            </GlassSurface>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
