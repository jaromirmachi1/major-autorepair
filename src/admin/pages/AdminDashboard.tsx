import { useAuth } from "../contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import { useCars } from "../../hooks/useCars";
import { loadMockCarsToLocalStorage } from "../../utils/loadMockCars";
import { isSupabaseConfigured } from "../../config/supabase";
import { getTotalMessagesCount, getUnreadMessagesCount } from "../../services/supabaseMessagesService";
import { useState, useEffect } from "react";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cars } = useCars();
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMessagesCount = async () => {
      if (isSupabaseConfigured) {
        try {
          const [total, unread] = await Promise.all([
            getTotalMessagesCount(),
            getUnreadMessagesCount(),
          ]);
          setTotalMessages(total);
          setUnreadMessages(unread);
        } catch (error) {
          console.error("Error fetching messages count:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchMessagesCount();
    // Refresh every 30 seconds to get updated counts
    const interval = setInterval(fetchMessagesCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLoadMockCars = () => {
    if (loadMockCarsToLocalStorage()) {
      alert("Mock cars loaded successfully! Refresh the page to see them.");
    } else {
      alert("Failed to load mock cars.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Administrace</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.displayName || user?.username}
            </span>
            <button
              onClick={() => navigate("/")}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-semibold flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Zpět na web
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Vítejte v administraci</h2>
          <p className="text-gray-600 mb-6">
            Zde můžete spravovat obsah vašeho webu.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Vozidla</h3>
              <p className="text-3xl font-bold text-blue-600">{cars.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Služby</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg relative">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-purple-900">Zprávy</h3>
                {unreadMessages > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    !
                  </span>
                )}
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? "..." : totalMessages}
              </p>
              {unreadMessages > 0 && (
                <p className="text-sm text-red-600 font-semibold mt-1">
                  {unreadMessages} nepřečtených
                </p>
              )}
            </div>
          </div>

          {/* Development Tools */}
          {!isSupabaseConfigured && (
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                🛠️ Development Mode
              </h3>
              <p className="text-yellow-800 mb-4">
                Supabase is not configured. Using localStorage for development.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleLoadMockCars}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
                >
                  Load Mock Cars
                </button>
                <span className="text-sm text-yellow-700 self-center">
                  Current cars: {cars.length}
                </span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Rychlé akce</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/admin/manage-cars")}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors text-left"
              >
                <div className="font-semibold">Správa vozidel</div>
                <div className="text-sm opacity-90">
                  Přidat, upravit nebo odebrat vozidla
                </div>
              </button>
              <button
                onClick={() => navigate("/admin/messages")}
                className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-left"
              >
                <div className="font-semibold">Zobrazit zprávy</div>
                <div className="text-sm opacity-90">
                  Zkontrolovat odeslaná kontaktní formuláře
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
