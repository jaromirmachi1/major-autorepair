import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function AdminLogin() {
  const { user, isAdmin, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Přihlášení Správce
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Přihlaste se pomocí svého administrátorského Google účtu
        </p>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Přihlásit se přes Google
        </button>
        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Zpět na hlavní stránku
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
