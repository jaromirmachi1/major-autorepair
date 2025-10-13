import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Cars from "./sections/Cars";
import Contact from "./sections/Contact";
import AdminApp from "./admin/AdminApp";
import LenisProvider from "./components/LenisProvider";

function App() {
  return (
    <div className="antialiased">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminApp />} />

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
