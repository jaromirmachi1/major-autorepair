import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCars } from "../../hooks/useCars";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cars } = useCars();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
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
              {user?.displayName || user?.email}
            </span>
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
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Zprávy</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
          </div>

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
              <button className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-left">
                <div className="font-semibold">Správa služeb</div>
                <div className="text-sm opacity-90">
                  Aktualizovat vaše služby
                </div>
              </button>
              <button className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors text-left">
                <div className="font-semibold">Zobrazit zprávy</div>
                <div className="text-sm opacity-90">
                  Zkontrolovat odeslaná kontaktní formuláře
                </div>
              </button>
              <button className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors text-left">
                <div className="font-semibold">Nastavení</div>
                <div className="text-sm opacity-90">
                  Konfigurace vašeho webu
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
