import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import messageService from "../api/messageService";

const ChatWindow = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const msgData = {
      conversation_id: conversationId,
      content: newMsg,
    };

    const tempMsg = {
      ...msgData,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
    };
    setMessages([...messages, tempMsg]);
    setNewMsg("");

    try {
      await messageService.sendMessage(msgData);
      loadMessages(); // refresh after send
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md flex flex-col h-[80vh] mt-10">
      <div className="p-4 border-b font-semibold text-lg">Chat</div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400">No messages yet. Say hi!</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender_id == currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
                  msg.sender_id == currentUserId
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="p-3 border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
