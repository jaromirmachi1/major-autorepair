import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCars, type Car } from "../../hooks/useCars";

function ManageCars() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cars, addCar, updateCar, deleteCar } = useCars();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    year: new Date().getFullYear(),
    price: 0,
    priceFormatted: "",
    mileage: 0,
    fuel: "Gasoline",
    transmission: "Automatic",
    description: "",
    imageUrl: "",
    featured: false,
    features: [] as string[],
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseFloat(value)
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Auto-format price for display if not provided
    const priceFormatted =
      formData.priceFormatted || `${formData.price.toLocaleString()} Kč`;

    try {
      if (editingCar) {
        // Update existing car
        await updateCar(editingCar.id, {
          ...formData,
          priceFormatted,
        });
      } else {
        // Add new car (pass userId for Firestore)
        await addCar(
          {
            ...formData,
            priceFormatted,
          },
          user?.uid
        );
      }

      // Reset form
      setFormData({
        name: "",
        brand: "",
        year: new Date().getFullYear(),
        price: 0,
        priceFormatted: "",
        mileage: 0,
        fuel: "Gasoline",
        transmission: "Automatic",
        description: "",
        imageUrl: "",
        featured: false,
        features: [],
      });
      setIsFormOpen(false);
      setEditingCar(null);
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Chyba při ukládání vozidla. Zkuste to prosím znovu.");
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      year: car.year,
      price: car.price,
      priceFormatted: car.priceFormatted || "",
      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission,
      description: car.description,
      imageUrl: car.imageUrl,
      featured: car.featured,
      features: car.features || [],
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Opravdu chcete smazat toto vozidlo?")) {
      try {
        await deleteCar(id);
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("Chyba při mazání vozidla. Zkuste to prosím znovu.");
      }
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingCar(null);
    setFormData({
      name: "",
      brand: "",
      year: new Date().getFullYear(),
      price: 0,
      priceFormatted: "",
      mileage: 0,
      fuel: "Gasoline",
      transmission: "Automatic",
      description: "",
      imageUrl: "",
      featured: false,
      features: [],
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Zpět
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Správa vozidel</h1>
          </div>
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
        {/* Add Car Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + Přidat nové vozidlo
          </button>
        </div>

        {/* Car Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingCar ? "Upravit vozidlo" : "Přidat nové vozidlo"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Název vozidla *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="např. BMW 3 Series"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Značka *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="např. BMW"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rok výroby *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cena (Kč) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="1000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nájezd (km) *
                    </label>
                    <input
                      type="number"
                      name="mileage"
                      value={formData.mileage}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Typ paliva *
                    </label>
                    <select
                      name="fuel"
                      value={formData.fuel}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Gasoline">Benzín</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Elektro</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Převodovka *
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Automatic">Automatická</option>
                      <option value="Manual">Manuální</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL obrázku *
                    </label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Popis *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Zadejte popis vozidla..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vlastnosti (oddělené čárkou, volitelné)
                  </label>
                  <input
                    type="text"
                    name="features"
                    value={formData.features.join(", ")}
                    onChange={(e) => {
                      const features = e.target.value
                        .split(",")
                        .map((f) => f.trim())
                        .filter((f) => f);
                      setFormData((prev) => ({ ...prev, features }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="např. Automatická, Kožený interiér, Navigace"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tyto vlastnosti budou zobrazeny jako odznaky na hlavní
                    stránce
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Prémiové vozidlo (zobrazí se na hlavní stránce)
                  </label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    {editingCar ? "Aktualizovat vozidlo" : "Přidat vozidlo"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                  >
                    Zrušit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cars List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {cars.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="text-lg">Zatím nebyla přidána žádná vozidla.</p>
              <p className="text-sm mt-2">
                Klikněte na "Přidat nové vozidlo" pro začátek.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Obrázek
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vozidlo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rok
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cena
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nájezd
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stav
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Akce
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={car.imageUrl}
                          alt={car.name}
                          className="h-12 w-20 object-cover rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {car.name}
                        </div>
                        <div className="text-sm text-gray-500">{car.brand}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {car.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {car.price.toLocaleString()} Kč
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {car.mileage.toLocaleString()} km
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {car.featured ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Prémiové
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Běžné
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Upravit
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Smazat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ManageCars;
