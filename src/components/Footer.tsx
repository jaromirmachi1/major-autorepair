import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // If we're not on the homepage, navigate to homepage first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // We're on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-12">
          {/* Left Section - Brand */}
          <div className="mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-2xl font-medium mb-2"
            >
              AUTOCENTRUM MAJOR
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-6 h-6 text-gray-400"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            </motion.div>
          </div>

          {/* Middle Section - Navigation */}
          <div className="mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4"
            >
              <div className="text-sm text-gray-400 mb-1">1.0</div>
              <div className="text-lg font-medium">Pages</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-2"
            >
              <button
                onClick={() => scrollToSection("hero")}
                className="block text-white hover:text-gray-400 transition-colors duration-300 text-left"
              >
                Domů
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="block text-white hover:text-gray-400 transition-colors duration-300 text-left"
              >
                Služby
              </button>
              <button
                onClick={() => scrollToSection("cars")}
                className="block text-white hover:text-gray-400 transition-colors duration-300 text-left"
              >
                Ojetá Auta
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block text-white hover:text-gray-400 transition-colors duration-300 text-left"
              >
                Kontakt
              </button>
            </motion.div>
          </div>

          {/* Right Section - Social */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-4"
            >
              <div className="text-sm text-gray-400 mb-1">2.0</div>
              <div className="text-lg font-medium">Follow</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-2"
            >
              <a
                href="#"
                className="block text-white hover:text-gray-400 transition-colors duration-300"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="block text-white hover:text-gray-400 transition-colors duration-300"
              >
                X
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400"
        >
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Terms of Use
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
          <div className="text-gray-400">
            Designed and powered by UI Therapy
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
