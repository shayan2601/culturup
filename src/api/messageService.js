import axios from 'axios';

const API_URL = 'https://shoaibahmad.pythonanywhere.com/api/messages/';

const getConversations = async () => {
  const token = localStorage.getItem('authToken');
  const res = await axios.get(`${API_URL}conversations/`, {
    headers: token ? { Authorization: `Token ${token}` } : {},
  });
  return res.data;
};

const getMessages = async (conversationId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${API_URL}?conversation_id=${conversationId}`, {
    headers: token ? { Authorization: `Token ${token}` } : {},
  });
  return res.data;
};

const sendMessage = async (payload) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(API_URL, payload, {
    headers: token ? { Authorization: `Token ${token}` } : {},
  });
  return res.data;
};

const markMessageRead = async (messageId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(
    `${API_URL}${messageId}/mark_read/`,
    {},
    {
      headers: token ? { Authorization: `Token ${token}` } : {},
    }
  );
  return res.data;
};

export default {
  getConversations,
  getMessages,
  sendMessage,
  markMessageRead,
};
