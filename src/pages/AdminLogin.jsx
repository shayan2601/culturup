import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/auth/login/',
        formData
      );

      const { token, email, username, user_id } = response.data;

      // ✅ Store credentials
      localStorage.setItem('authToken', token);
      localStorage.setItem('adminData', JSON.stringify({ email, username, user_id }));

      setMessage({ type: 'success', text: 'Login successful!' });

      // Reset form and navigate to admin dashboard
      setFormData({ username: '', password: '' });
      navigate('/admin/dashboard');
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Login failed';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md rounded bg-white p-8 shadow-lg'>
        <h2 className='mb-6 text-center text-2xl font-semibold text-cyan-600'>Admin Login</h2>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type='text'
            name='username'
            placeholder='Username'
            className='w-full rounded border p-3'
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type='password'
            name='password'
            placeholder='Password'
            className='w-full rounded border p-3'
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type='submit'
            disabled={loading}
            className={`w-full rounded bg-cyan-600 py-2 text-white hover:bg-cyan-700 ${
              loading ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
