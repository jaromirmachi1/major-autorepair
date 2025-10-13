import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Header = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isOverLightBackground, setIsOverLightBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = ["hero", "services", "cars", "contact"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }

      // Check if we're over a light background section
      const lightBackgroundSections = ["services", "contact"]; // Add sections with light backgrounds
      const isOverLight = lightBackgroundSections.some((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      setIsOverLightBackground(isOverLight);
      console.log(
        "isOverLightBackground:",
        isOverLight,
        "currentSection:",
        currentSection
      );
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const navLinks = [
    { name: "Domů", href: "hero" },
    { name: "Služby", href: "services" },
    { name: "Ojetá Auta", href: "cars" },
    { name: "Kontakt", href: "contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center items-center gap-4">
          {/* Logo Container */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-2xl cursor-pointer"
            style={{ backgroundColor: "#0000004b" }}
            onClick={() => scrollToSection("hero")}
          >
            <img
              src="/logo.svg"
              alt="Marina Logo"
              className="h-8 w-auto filter-difference"
              style={{ filter: "difference" }}
            />
          </motion.div>

          {/* Navigation Container */}
          <div
            className="backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-2xl"
            style={{
              backgroundColor: "#0000004b",
            }}
          >
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => scrollToSection(link.href)}
                  className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm ${
                    activeSection === link.href
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  }`}
                  style={
                    isOverLightBackground
                      ? {
                          color: "#000000",
                          filter: "none",
                          mixBlendMode: "normal",
                          WebkitFilter: "none",
                          WebkitMixBlendMode: "normal",
                        }
                      : {
                          filter: "difference",
                          color: "white",
                          mixBlendMode: "difference",
                        }
                  }
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                </motion.button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isOverLightBackground
                    ? "hover:bg-gray-800/10"
                    : "hover:bg-white/10"
                }`}
                style={
                  isOverLightBackground
                    ? {
                        color: "#000000",
                        filter: "none",
                        mixBlendMode: "normal",
                        WebkitFilter: "none",
                        WebkitMixBlendMode: "normal",
                      }
                    : {
                        filter: "difference",
                        color: "white",
                        mixBlendMode: "difference",
                      }
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
