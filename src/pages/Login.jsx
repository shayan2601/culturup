import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));

      setMessage({ type: 'success', text: 'Login successful!' });

      setFormData({ username: '', password: '' });

      navigate('/');
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Login failed';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
        <div className='w-full max-w-md rounded bg-white p-8 shadow-lg'>
          <h2 className='mb-6 text-center text-3xl font-bold text-cyan-600'>Login</h2>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <input
              type='text'
              name='username'
              placeholder='username'
              value={formData.username}
              onChange={handleChange}
              required
              className='w-full rounded border p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            />
            <input
              type='password'
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full rounded border p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            />
            <button
              type='submit'
              disabled={loading}
              className='w-full rounded bg-cyan-600 py-2 text-white transition hover:bg-cyan-700 disabled:opacity-50'
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {message && (
              <p
                className={`mt-2 text-center text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}
              >
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
