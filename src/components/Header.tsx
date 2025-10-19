import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import GlassSurface from "./GlassSurface";
import { useLenis } from "../hooks/useLenis";

const Header = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isOverLightBackground, setIsOverLightBackground] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);
  const { scrollToElement } = useLenis();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    // Set clicked item for arrow animation
    setClickedItem(sectionId);

    // Wait for arrow animation to complete, then close menu and scroll
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setClickedItem(null);

      // If we're not on the homepage, navigate to homepage first
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          scrollToElement(sectionId, {
            duration: 1.0,
            easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
            offset: -80,
          });
        }, 100);
      } else {
        // We're on homepage, just scroll
        scrollToElement(sectionId, {
          duration: 1.0,
          easing: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
          offset: -80,
        });
      }
      setActiveSection(sectionId);
    }, 600); // Wait for arrow animation to complete
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
      <div className="max-w-7xl xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4">
        <div className="flex justify-center items-center gap-4">
          {/* Logo Container */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              onClick={() => scrollToSection("hero")}
              className="cursor-pointer"
            >
              <GlassSurface
                width="auto"
                height={60}
                borderRadius={16}
                brightness={20}
                opacity={0.8}
                blur={15}
                displace={1.8}
                backgroundOpacity={0.2}
                saturation={1.2}
                className="px-4 py-3"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={isOverLightBackground ? "black" : "white"}
                    src={
                      isOverLightBackground
                        ? "/major-blacklogo.png"
                        : "/logo.svg"
                    }
                    alt="Marina Logo"
                    className="h-8 w-auto filter-difference"
                    style={{ filter: "difference" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  />
                </AnimatePresence>
              </GlassSurface>
            </motion.div>
          </motion.div>

          {/* Navigation Container */}
          <GlassSurface
            width="auto"
            height={60}
            borderRadius={16}
            brightness={20}
            opacity={0.8}
            blur={15}
            displace={1.8}
            backgroundOpacity={0.2}
            saturation={1.2}
            className="px-4 py-3"
          >
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity:
                      hoveredButton && hoveredButton !== link.href ? 0.4 : 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.1 * index,
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  onMouseEnter={() => setHoveredButton(link.href)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <motion.button
                    onClick={() => scrollToSection(link.href)}
                    className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm cursor-pointer ${
                      activeSection === link.href
                        ? "bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                    style={
                      isOverLightBackground
                        ? ({
                            color: "#000000",
                            filter: "none",
                            mixBlendMode: "normal",
                          } as React.CSSProperties)
                        : ({
                            filter: "difference",
                            color: "white",
                            mixBlendMode: "difference",
                          } as React.CSSProperties)
                    }
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.name}
                  </motion.button>
                </motion.div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isOverLightBackground
                    ? "hover:bg-gray-800/10"
                    : "hover:bg-white/10"
                }`}
                style={
                  isOverLightBackground
                    ? ({
                        color: "#000000",
                        filter: "none",
                        mixBlendMode: "normal",
                      } as React.CSSProperties)
                    : ({
                        filter: "difference",
                        color: "white",
                        mixBlendMode: "difference",
                      } as React.CSSProperties)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-5 h-5 flex flex-col justify-center items-center">
                  <motion.span
                    className="block w-5 h-0.5 bg-current mb-1"
                    animate={{
                      rotate: isMobileMenuOpen ? 45 : 0,
                      y: isMobileMenuOpen ? 6 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="block w-5 h-0.5 bg-current mb-1"
                    animate={{
                      opacity: isMobileMenuOpen ? 0 : 1,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.span
                    className="block w-5 h-0.5 bg-current"
                    animate={{
                      rotate: isMobileMenuOpen ? -45 : 0,
                      y: isMobileMenuOpen ? -6 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                </div>
              </motion.button>
            </div>
          </GlassSurface>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-black"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {/* Mobile Menu Content */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative pt-20 px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 * index + 0.2,
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    className="relative"
                  >
                    <motion.button
                      onClick={() => scrollToSection(link.href)}
                      className={`w-full text-left  py-5 transition-all duration-300 font-medium text-xl text-white relative z-10 flex flex-col justify-center ${
                        activeSection === link.href
                          ? "text-white/80"
                          : "hover:text-white/70"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex">
                        {link.name}
                        {/* Arrow icon positioned relative to text */}
                        <motion.div
                          className="ml-5"
                          initial={{ opacity: 0.3, x: 0 }}
                          animate={{
                            opacity: clickedItem === link.href ? 1 : 0.3,
                            x: clickedItem === link.href ? 400 : 0,
                          }}
                          transition={{
                            duration: 0.8,
                            ease: "easeInOut",
                          }}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.div>
                      </span>
                    </motion.button>

                    {/* White separator line - don't show after last item */}
                    {index < navLinks.length - 1 && (
                      <div className="w-full h-px bg-white/20" />
                    )}
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
