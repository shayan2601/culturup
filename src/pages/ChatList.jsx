import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import messageService from "../api/messageService";

const ChatList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        <div className="divide-y divide-gray-200">
          {conversations.map((conv, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 px-2 rounded-md"
              onClick={() => navigate(`/chat/${conv.id}`)}
            >
              <div>
                <h3 className="font-medium text-gray-800">
                  {conv.other_user?.first_name
                    ? `${conv.other_user.first_name} ${conv.other_user.last_name || ""}`
                    : conv.other_user?.username || "Unknown"}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-1">
                  {conv.last_message?.content || "No messages yet"}
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(conv.updated_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
