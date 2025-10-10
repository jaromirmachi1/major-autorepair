import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Cars from "./sections/Cars";
import Contact from "./sections/Contact";
// import AdminApp from "./admin/AdminApp"; // Disabled until Firebase is configured

function App() {
  return (
    <div className="antialiased">
      <Routes>
        {/* Admin Routes - Disabled until Firebase is configured */}
        {/* <Route path="/admin/*" element={<AdminApp />} /> */}

        {/* Main Website - Single Page */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <main>
                <Hero />
                <Services />
                <Cars />
                <Contact />
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
