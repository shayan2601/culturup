import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import messageService from '../api/messageService';

const ChatWindow = () => {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const currentUserId = localStorage.getItem('user_id');

  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  const loadMessages = async () => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
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
    setNewMsg('');

    try {
      await messageService.sendMessage(msgData);
      loadMessages(); // refresh after send
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='mx-auto mt-10 flex h-[80vh] max-w-3xl flex-col rounded-lg bg-white shadow-md'>
      <div className='border-b p-4 text-lg font-semibold'>Chat</div>

      <div className='flex-1 space-y-3 overflow-y-auto p-4'>
        {loading ? (
          <p className='text-gray-500'>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className='text-gray-400'>No messages yet. Say hi!</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender_id == currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 text-sm ${
                  msg.sender_id == currentUserId
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className='flex items-center gap-2 border-t p-3'>
        <input
          type='text'
          placeholder='Type your message...'
          className='flex-1 rounded-md border px-3 py-2 focus:outline-none'
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className='rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700'
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
