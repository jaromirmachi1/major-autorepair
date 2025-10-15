import { useState, useEffect } from "react";
import { useAuth } from "../contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import {
  getMessagesFromSupabase,
  markMessageAsRead,
  deleteMessageFromSupabase,
  getUnreadMessagesCount,
  type ContactMessage,
} from "../../services/supabaseMessagesService";
import { isSupabaseConfigured } from "../../config/supabase";

const AdminMessages = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/admin/login");
      return;
    }

    loadMessages();
  }, [user, isAdmin, navigate]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      if (isSupabaseConfigured) {
        const [messagesData, unreadCountData] = await Promise.all([
          getMessagesFromSupabase(),
          getUnreadMessagesCount(),
        ]);
        setMessages(messagesData);
        setUnreadCount(unreadCountData);
      } else {
        // Mock data for development
        setMessages([
          {
            id: "1",
            name: "Jan Novák",
            email: "jan@example.com",
            phone: "+420 123 456 789",
            subject: "Dotaz na opravu",
            message:
              "Dobrý den, potřebuji opravit brzdy na mém BMW. Můžete mi prosím sdělit cenu?",
            created_at: new Date().toISOString(),
            read: false,
          },
          {
            id: "2",
            name: "Marie Svobodová",
            email: "marie@example.com",
            subject: "Prodej vozidla",
            message: "Máte nějaké vozy v ceně do 200 000 Kč?",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            read: true,
          },
        ]);
        setUnreadCount(1);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleMessageClick = async (message: ContactMessage) => {
    setSelectedMessage(message);

    // Mark as read if not already read
    if (!message.read && isSupabaseConfigured) {
      try {
        await markMessageAsRead(message.id!);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === message.id ? { ...msg, read: true } : msg
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Opravdu chcete smazat tuto zprávu?")) return;

    try {
      if (isSupabaseConfigured) {
        await deleteMessageFromSupabase(messageId);
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("cs-CZ", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Načítání zpráv...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Zprávy z Kontaktního Formuláře
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.displayName || user?.email}
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
              onClick={() => navigate("/admin/dashboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              Dashboard
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Celkem zpráv
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nepřečtené</p>
                <p className="text-2xl font-bold text-gray-900">
                  {unreadCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Přečtené</p>
                <p className="text-2xl font-bold text-gray-900">
                  {messages.length - unreadCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Messages List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Seznam zpráv
              </h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Žádné zprávy nejsou k dispozici.
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => handleMessageClick(message)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedMessage?.id === message.id
                        ? "bg-blue-50 border-r-4 border-blue-500"
                        : ""
                    } ${!message.read ? "bg-yellow-50" : ""}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {message.name}
                          </h3>
                          {!message.read && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Nová
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {message.email}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {message.subject}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {message.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDate(message.created_at!)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMessage(message.id!);
                        }}
                        className="ml-2 text-red-600 hover:text-red-800 transition-colors"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Detail zprávy
              </h2>
            </div>
            <div className="p-6">
              {selectedMessage ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Jméno
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedMessage.name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {selectedMessage.email}
                      </a>
                    </p>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Telefon
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedMessage.phone}
                        </a>
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Předmět
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedMessage.subject}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Zpráva
                    </label>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Datum odeslání
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {formatDate(selectedMessage.created_at!)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2">Vyberte zprávu pro zobrazení detailu</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMessages;
