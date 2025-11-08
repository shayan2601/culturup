import axios from 'axios';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ChatScreen = () => {
  const location = useLocation();
  const artistId = location.state?.artistId;
  console.log('artistId::::::: ', artistId);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const token = localStorage.getItem('authToken');

  const [artist, setArtist] = useState(null);
  const [messages, setMessages] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchArtist = async () => {
    console.log('userData?.user_type: ', userData?.user_type);

    const tokenHeader = { headers: { Authorization: `Token ${token}` } };

    const urls =
      userData?.user_type === 'artist'
        ? [
            `http://shoaibahmad.pythonanywhere.com/api/artist-profiles/${artistId}/`,
            `http://shoaibahmad.pythonanywhere.com/api/buyer-profiles/${artistId}/`,
          ]
        : [
            `http://shoaibahmad.pythonanywhere.com/api/buyer-profiles/${artistId}/`,
            `http://shoaibahmad.pythonanywhere.com/api/artist-profiles/${artistId}/`,
          ];

    for (let url of urls) {
      try {
        const res = await axios.get(url, tokenHeader);
        setArtist(res.data);
        return;
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error fetching profile from:', url, err);
        }
      }
    }

    console.error('Profile not found for artistId:', artistId);
    setArtist(null);
  };

  const fetchArtworks = async () => {
    try {
      const res = await axios.get(
        `http://shoaibahmad.pythonanywhere.com/api/artist-profiles/${artistId}/artworks/`,
        { headers: { Authorization: `Token ${token}` } }
      );
      setArtworks(res.data);
    } catch (err) {
      console.error('Error fetching artworks:', err);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get('http://shoaibahmad.pythonanywhere.com/api/messages/', {
        headers: { Authorization: `Token ${token}` },
      });

      const filtered = res.data.results.filter(
        (msg) =>
          (msg.sender.id === userData.id && msg.receiver.id === artistId) ||
          (msg.sender.id === artistId && msg.receiver.id === userData.id)
      );

      setMessages(filtered.reverse());
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        'http://shoaibahmad.pythonanywhere.com/api/messages/',
        {
          receiver_id: artistId,
          content: messageText,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      setMessageText('');
      fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!artist) {
    return (
      <div className='flex h-screen items-center justify-center text-gray-500'>Loading chat...</div>
    );
  }

  return (
    <div className='flex h-screen flex-col bg-gradient-to-br from-gray-100 to-gray-200 md:flex-row'>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='hidden w-1/3 flex-col overflow-y-auto border-r border-gray-200 bg-white p-6 shadow-md md:flex'
      >
        <div className='text-center'>
          <img
            src={
              artist.user.profile_image ||
              `https://ui-avatars.com/api/?name=${artist.user.first_name || ''}+${artist.user.last_name || ''}`
            }
            alt='Artist'
            className='mx-auto h-28 w-28 rounded-full object-cover shadow-lg'
          />
          <h2 className='mt-4 text-xl font-semibold text-gray-800'>
            {artist.user.first_name || artist.user.username}
          </h2>
          <p className='text-sm text-gray-500'>@{artist.user.username}</p>
        </div>

        <h3 className='mt-8 mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700'>
          <ImageIcon className='h-4 w-4' /> Related Artworks
        </h3>

        <div className='grid grid-cols-2 gap-2'>
          {artworks.length > 0 ? (
            artworks
              .slice(0, 6)
              .map((art, idx) => (
                <motion.img
                  key={idx}
                  src={art.image || 'https://via.placeholder.com/150'}
                  alt={`art-${idx}`}
                  className='h-28 w-full cursor-pointer rounded-lg object-cover shadow transition-transform hover:scale-105'
                  whileHover={{ scale: 1.05 }}
                />
              ))
          ) : (
            <p className='col-span-2 text-xs text-gray-400'>No artworks yet.</p>
          )}
        </div>
      </motion.div>

      <div className='flex flex-1 flex-col'>
        <div className='flex items-center bg-cyan-600 p-4 text-white shadow-md'>
          <img
            src={
              artist.user.profile_image ||
              `https://ui-avatars.com/api/?name=${artist.user.first_name || ''}+${artist.user.last_name || ''}`
            }
            alt='Artist'
            className='mr-3 h-10 w-10 rounded-full'
          />
          <div>
            <h2 className='text-lg font-semibold'>
              {artist.user.first_name || artist.user.username}
            </h2>
            <p className='text-xs opacity-75'>@{artist.user.username}</p>
          </div>
        </div>

        <div className='flex flex-1 flex-col-reverse gap-3 overflow-y-auto bg-gray-50 p-4'>
          <div ref={messagesEndRef} />
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-xs rounded-2xl px-4 py-2 shadow-sm ${
                msg.sender.id === userData.id
                  ? 'self-end rounded-br-none bg-cyan-600 text-white'
                  : 'self-start rounded-bl-none border bg-white text-gray-800'
              }`}
            >
              <p>{msg.content}</p>
              <span className='mt-1 block text-right text-[10px] text-gray-300'>
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </motion.div>
          ))}
        </div>

        <div className='flex items-center gap-2 border-t bg-white p-3 shadow-inner'>
          <input
            type='text'
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 rounded-full border px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={loading}
            className='rounded-full bg-cyan-600 px-4 py-2 text-sm text-white shadow-md hover:bg-cyan-700'
          >
            {loading ? '...' : <Send size={18} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
