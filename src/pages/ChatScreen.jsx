import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Image as ImageIcon } from "lucide-react";

const ChatScreen = () => {
  const location = useLocation();
  const artistId = location.state?.artistId;
  const userData = JSON.parse(localStorage.getItem("userData"));
  const token = localStorage.getItem("authToken");

  const [artist, setArtist] = useState(null);
  const [messages, setMessages] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 🔹 Fetch artist details
  const fetchArtist = async () => {
    console.log("userData?.user_type: ", userData?.user_type)
    try {
      if(userData?.user_type == 'artist'){
        const res = await axios.get(
          `http://shoaibahmad.pythonanywhere.com/api/artist-profiles/${artistId}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        
        setArtist(res.data);
        
      }
    } catch (err) {
      const res = await axios.get(
        `http://shoaibahmad.pythonanywhere.com/api/buyer-profiles/${artistId}/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setArtist(res.data);
      console.error("Error fetching artist details:", err);
    }
  };

  // 🔹 Fetch related artworks
  const fetchArtworks = async () => {
    try {
      const res = await axios.get(
        `http://shoaibahmad.pythonanywhere.com/api/artist-profiles/${artistId}/artworks/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setArtworks(res.data);
    } catch (err) {
      console.error("Error fetching artworks:", err);
    }
  };

  // 🔹 Fetch messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        "http://shoaibahmad.pythonanywhere.com/api/messages/",
        { headers: { Authorization: `Token ${token}` } }
      );

      const filtered = res.data.results.filter(
        (msg) =>
          (msg.sender.id === userData.id && msg.receiver.id === artistId) ||
          (msg.sender.id === artistId && msg.receiver.id === userData.id)
      );

      setMessages(filtered.reverse()); // Reverse order for WhatsApp-style
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // 🔹 Send message
  const sendMessage = async () => {
    if (!messageText.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        "http://shoaibahmad.pythonanywhere.com/api/messages/",
        {
          receiver_id: artistId,
          content: messageText,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      setMessageText("");
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artistId) {
      fetchArtist();
      fetchMessages();
      fetchArtworks();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [artistId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!artist) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Sidebar (Artist Info + Artworks) */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex flex-col w-1/3 bg-white border-r border-gray-200 p-6 overflow-y-auto shadow-md"
      >
        <div className="text-center">
          <img
            src={
              artist.user.profile_image ||
              `https://ui-avatars.com/api/?name=${artist.user.first_name || ""}+${artist.user.last_name || ""}`
            }
            alt="Artist"
            className="w-28 h-28 rounded-full mx-auto shadow-lg object-cover"
          />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            {artist.user.first_name || artist.user.username}
          </h2>
          <p className="text-gray-500 text-sm">@{artist.user.username}</p>
        </div>

        <h3 className="mt-8 mb-3 font-semibold text-gray-700 text-sm flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Related Artworks
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {artworks.length > 0 ? (
            artworks.slice(0, 6).map((art, idx) => (
              <motion.img
                key={idx}
                src={art.image || "https://via.placeholder.com/150"}
                alt={`art-${idx}`}
                className="w-full h-28 object-cover rounded-lg shadow hover:scale-105 transition-transform cursor-pointer"
                whileHover={{ scale: 1.05 }}
              />
            ))
          ) : (
            <p className="text-xs text-gray-400 col-span-2">No artworks yet.</p>
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="p-4 bg-cyan-600 text-white flex items-center shadow-md">
          <img
            src={
              artist.user.profile_image ||
              `https://ui-avatars.com/api/?name=${artist.user.first_name || ""}+${artist.user.last_name || ""}`
            }
            alt="Artist"
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h2 className="font-semibold text-lg">
              {artist.user.first_name || artist.user.username}
            </h2>
            <p className="text-xs opacity-75">@{artist.user.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse gap-3 bg-gray-50">
          <div ref={messagesEndRef} />
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                msg.sender.id === userData.id
                  ? "bg-cyan-600 text-white self-end rounded-br-none"
                  : "bg-white text-gray-800 self-start border rounded-bl-none"
              }`}
            >
              <p>{msg.content}</p>
              <span className="text-[10px] text-gray-300 mt-1 block text-right">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white flex items-center gap-2 shadow-inner">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={loading}
            className="bg-cyan-600 text-white px-4 py-2 rounded-full text-sm hover:bg-cyan-700 shadow-md"
          >
            {loading ? "..." : <Send size={18} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
