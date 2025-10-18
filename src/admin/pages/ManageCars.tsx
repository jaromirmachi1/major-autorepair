import { useState } from "react";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import { useCars, type Car } from "../../hooks/useCars";
import { Snackbar, Alert } from "@mui/material";
import { isSupabaseConfigured } from "../../config/supabase";
import { createSupabaseImageService } from "../../services/supabaseImageService";

function ManageCars() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cars, addCar, updateCar, deleteCar } = useCars();
  const imageService = createSupabaseImageService();
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
    engineVolume: "",
    power: "",
    description: "",
    imageUrl: "",
    featured: false,
    pinned: false,
    features: [] as string[],
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [featuresInput, setFeaturesInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingCarId, setDeletingCarId] = useState<string | null>(null);

  const showNotification = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    console.log("🔔 Showing notification:", { message, severity });
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setUploadError(
        `Soubor ${file.name} není podporovaný formát. Použijte pouze JPG nebo PNG.`
      );
      return false;
    }

    if (file.size > maxSize) {
      setUploadError(
        `Soubor ${file.name} je příliš velký. Maximální velikost je 10MB.`
      );
      return false;
    }

    return true;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError("");

    // Check total number of files (limit based on storage type)
    const maxFiles = isSupabaseConfigured ? 10 : 3;
    if (uploadedFiles.length + files.length > maxFiles) {
      setUploadError(`Můžete nahrát maximálně ${maxFiles} fotografií.`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      if (validateFile(file)) {
        validFiles.push(file);
      } else {
        return; // Stop if any file is invalid
      }
    }

    setUploadedFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const convertFilesToUrls = async (files: File[]): Promise<string[]> => {
    try {
      // Limit based on storage type
      const maxFiles = isSupabaseConfigured ? 10 : 3;
      const limitedFiles = files.slice(0, maxFiles);

      // Use image service to upload files
      const results = await imageService.uploadMultipleImages(
        limitedFiles,
        `cars/${user?.id || "anonymous"}`
      );

      return results.map((result) => result.url);
    } catch (error) {
      console.error("Error uploading images:", error);
      showNotification("Chyba při nahrávání obrázků", "error");
      return [];
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

    // Validate that we have at least one image
    if (uploadedFiles.length === 0 && !formData.imageUrl) {
      setUploadError(
        "Musíte nahrát alespoň jednu fotografii nebo zadat URL obrázku."
      );
      return;
    }

    // Set loading state
    setIsSubmitting(true);
    setUploadError("");

    // Auto-format price for display if not provided
    const priceFormatted =
      formData.priceFormatted || `${formData.price.toLocaleString()} Kč`;

    try {
      let imageUrls: string[] = [];

      // Convert uploaded files to URLs
      if (uploadedFiles.length > 0) {
        imageUrls = await convertFilesToUrls(uploadedFiles);
      }

      // Add URL image if provided
      if (formData.imageUrl) {
        imageUrls.unshift(formData.imageUrl);
      }

      const carData = {
        ...formData,
        priceFormatted,
        imageUrl: imageUrls[0], // First image as main image
        imageUrls: imageUrls, // All images
      };

      if (editingCar) {
        // Update existing car
        await updateCar(editingCar.id, carData);
        showNotification("Vozidlo bylo úspěšně aktualizováno! 🚗", "success");
      } else {
        // Add new car (pass userId for Firestore)
        console.log("Adding car with user:", user);
        console.log("Car data:", carData);
        await addCar(carData, user?.id);
        showNotification("Vozidlo bylo úspěšně přidáno! ✅", "success");
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
        engineVolume: "",
        power: "",
        description: "",
        imageUrl: "",
        featured: false,
        pinned: false,
        features: [],
      });
      setFeaturesInput("");
      setUploadedFiles([]);
      setUploadError("");
      setIsFormOpen(false);
      setEditingCar(null);
    } catch (error) {
      console.error("Error saving car:", error);
      showNotification(
        "Chyba při ukládání vozidla. Zkuste to prosím znovu.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
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
      engineVolume: car.engineVolume || "",
      power: car.power || "",
      description: car.description,
      imageUrl: car.imageUrl,
      featured: car.featured,
      pinned: car.pinned || false,
      features: car.features || [],
    });
    setFeaturesInput((car.features || []).join(", "));
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Opravdu chcete smazat toto vozidlo?")) {
      setDeletingCarId(id);
      try {
        await deleteCar(id);
        showNotification("Vozidlo bylo úspěšně smazáno! 🗑️", "success");
      } catch (error) {
        console.error("Error deleting car:", error);
        showNotification(
          "Chyba při mazání vozidla. Zkuste to prosím znovu.",
          "error"
        );
      } finally {
        setDeletingCarId(null);
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
      engineVolume: "",
      power: "",
      description: "",
      imageUrl: "",
      featured: false,
      pinned: false,
      features: [],
    });
    setFeaturesInput("");
    setUploadedFiles([]);
    setUploadError("");
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
              {user?.displayName || user?.username}
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              {/* Loading Overlay */}
              {isSubmitting && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                  <div className="text-center">
                    <svg
                      className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-lg font-semibold text-gray-700">
                      {editingCar
                        ? "Aktualizuji vozidlo..."
                        : "Přidávám vozidlo..."}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Ukládám do databáze, prosím čekejte
                    </p>
                  </div>
                </div>
              )}
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
                      Objem motoru
                    </label>
                    <input
                      type="text"
                      name="engineVolume"
                      value={formData.engineVolume}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="např. 2.0L, 3.0L, Electric"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Výkon motoru
                    </label>
                    <input
                      type="text"
                      name="power"
                      value={formData.power}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="např. 150 kW, 200 HP"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fotografie vozidla *
                    </label>
                    <div className="space-y-4">
                      {/* File Upload */}
                      <div>
                        <input
                          type="file"
                          multiple
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {isSupabaseConfigured ? (
                            <>
                              Nahrávání do Supabase Storage - až 10 fotografií
                              (JPG, PNG, max 10MB každá)
                            </>
                          ) : (
                            <>
                              Lokální úložiště (vývoj) - až 3 fotografie (JPG,
                              PNG, max 10MB každá)
                            </>
                          )}
                        </p>
                      </div>

                      {/* URL Input (Alternative) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nebo zadejte URL obrázku
                        </label>
                        <input
                          type="url"
                          name="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      {/* Error Message */}
                      {uploadError && (
                        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                          {uploadError}
                        </div>
                      )}

                      {/* Uploaded Files Preview */}
                      {uploadedFiles.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Nahrané fotografie ({uploadedFiles.length}/
                            {isSupabaseConfigured ? 10 : 3}):
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                >
                                  ×
                                </button>
                                <p className="text-xs text-gray-500 truncate mt-1">
                                  {file.name}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                    value={featuresInput}
                    onChange={(e) => {
                      // Just update the input value, don't process features yet
                      setFeaturesInput(e.target.value);
                    }}
                    onBlur={(e) => {
                      // Process features when user leaves the field
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
                    stránce. Oddělte čárkami a stiskněte Tab nebo klikněte jinam
                    pro uložení.
                  </p>
                </div>
                <div className="space-y-3">
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="pinned"
                      checked={formData.pinned}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">
                      📌 Připnout vozidlo (zvýrazní se na hlavní stránce)
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {editingCar ? "Aktualizuji..." : "Přidávám vozidlo..."}
                      </>
                    ) : editingCar ? (
                      "Aktualizovat vozidlo"
                    ) : (
                      "Přidat vozidlo"
                    )}
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
                        {car.pinned ? (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            📌 Připnuto
                          </span>
                        ) : (
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Nepřipnuto
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
                          disabled={deletingCarId === car.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {deletingCarId === car.id ? (
                            <>
                              <svg
                                className="animate-spin h-3 w-3"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  fill="none"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Maže se...
                            </>
                          ) : (
                            "Smazat"
                          )}
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

      {/* Success/Error Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ zIndex: 9999 }} // Ensure it's above modals
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ManageCars;
