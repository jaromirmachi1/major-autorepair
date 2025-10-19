import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Cars from "./sections/Cars";
import Contact from "./sections/Contact";
import CarsInventory from "./pages/CarsInventory";
import CarDetail from "./pages/CarDetail";
import AdminApp from "./admin/AdminApp";
import LenisProvider from "./components/LenisProvider";

function App() {
  return (
    <div className="antialiased w-full max-w-full overflow-x-hidden">
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* Cars Inventory Page */}
        <Route path="/cars-inventory" element={<CarsInventory />} />

        {/* Car Detail Page */}
        <Route path="/car/:id" element={<CarDetail />} />

        {/* Main Website - Single Page */}
        <Route
          path="*"
          element={
            <LenisProvider>
              <Header />
              <main>
                <Hero />
                <Services />
                <Cars />
                <Contact />
              </main>
              <Footer />
            </LenisProvider>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
