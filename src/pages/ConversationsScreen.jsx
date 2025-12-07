import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConversationsScreen = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('userData'));
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const res = await axios.get('https://shoaibahmad.pythonanywhere.com/api/messages/', {
          headers: { Authorization: `Token ${token}` },
        });

        
        const grouped = {};
        res.data.results.forEach((msg) => {
          const partner = msg.sender.id === user.id ? msg.receiver : msg.sender;
          if (!grouped[partner.id]) grouped[partner.id] = [];
          grouped[partner.id].push(msg);
        });

        
        const convArray = Object.keys(grouped).map((id) => ({
          partner:
            grouped[id][0].sender.id === user.id ? grouped[id][0].receiver : grouped[id][0].sender,
          messages: grouped[id],
        }));

        setConversations(convArray);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [token, user.id]);

  if (loading) {
    return <div className='flex min-h-screen items-center justify-center'>Loading...</div>;
  }

  return (
    <div className='mx-auto min-h-screen max-w-3xl bg-gray-50 p-4'>
      <h2 className='mb-6 text-2xl font-bold'>Your Conversations</h2>

      {conversations.length === 0 && (
        <p className='text-gray-500'>You have no conversations yet.</p>
      )}

      <div className='space-y-4'>
        {conversations.map((conv) => (
          <div
            key={conv.partner.id}
            onClick={() => navigate('/chat', { state: { artistId: conv.partner.id } })}
            className='flex cursor-pointer items-center gap-4 rounded-xl bg-white p-4 shadow transition hover:shadow-md'
          >
            <img
              src={
                conv.partner.profile_image ||
                `https://ui-avatars.com/api/?name=${conv.partner.first_name || ''}+${conv.partner.last_name || ''}`
              }
              alt={conv.partner.username}
              className='h-12 w-12 rounded-full object-cover'
            />
            <div className='flex-1'>
              <h3 className='font-semibold'>{conv.partner.first_name || conv.partner.username}</h3>
              <p className='truncate text-sm text-gray-500'>
                {conv.messages[conv.messages.length - 1].content}
              </p>
            </div>
            <span className='text-xs text-gray-400'>
              {new Date(conv.messages[conv.messages.length - 1].created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationsScreen;
