import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    phone_number: '',
    user_type: 'buyer',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleUserType = () => {
    setFormData((prev) => ({
      ...prev,
      user_type: prev.user_type === 'buyer' ? 'artist' : 'buyer',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.password) {
      toast.error('Password field is required.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must contain at least 6 characters.');
      setLoading(false);
      return;
    }

    if (!formData.password_confirm) {
      toast.error('Password confirmation is required.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirm) {
      toast.error('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.phone_number && formData.phone_number.length > 11) {
      toast.error('Phone number must not exceed 11 characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/auth/register/',
        formData
      );

      localStorage.setItem('userData', JSON.stringify(response.data));
      toast.success('Signup successful! Redirecting to login...');

      setFormData({
        username: '',
        email: '',
        password: '',
        password_confirm: '',
        phone_number: '',
        user_type: 'buyer',
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        'Signup failed. Please check your input.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
        <div className='w-full max-w-md rounded bg-white p-8 shadow-lg'>
          <h2 className='mb-6 text-center text-3xl font-bold text-cyan-600'>Create Your Account</h2>
          <form className='space-y-4' onSubmit={handleSubmit}>
            <input
              type='text'
              name='username'
              placeholder='Username'
              value={formData.username}
              onChange={handleChange}
              required
              className='w-full rounded border p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            />
            <input
              type='email'
              name='email'
              placeholder='Email'
              value={formData.email}
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
            <input
              type='password'
              name='password_confirm'
              placeholder='Confirm Password'
              value={formData.password_confirm}
              onChange={handleChange}
              required
              className='w-full rounded border p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            />
            <input
              type='number'
              name='phone_number'
              placeholder='Phone Number'
              value={formData.phone_number}
              onChange={handleChange}
              maxLength={11}
              className='w-full rounded border p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            />

            <div className='flex items-center justify-between'>
              <span className='font-medium text-gray-600'>Account Type:</span>
              <div className='flex items-center space-x-2'>
                <span
                  className={`${
                    formData.user_type === 'buyer' ? 'font-semibold text-cyan-600' : 'text-gray-400'
                  }`}
                >
                  Buyer
                </span>
                <label className='relative inline-flex cursor-pointer items-center'>
                  <input
                    type='checkbox'
                    className='peer sr-only'
                    checked={formData.user_type === 'artist'}
                    onChange={toggleUserType}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-cyan-600 peer-focus:ring-2 peer-focus:ring-cyan-500 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
                <span
                  className={`${
                    formData.user_type === 'artist'
                      ? 'font-semibold text-cyan-600'
                      : 'text-gray-400'
                  }`}
                >
                  Artist
                </span>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full rounded bg-cyan-600 py-2 text-white transition hover:bg-cyan-700 disabled:opacity-50'
            >
              {loading ? 'Signing up...' : 'Signup'}
            </button>

            {/* react-toastify toasts are handled globally via ToastContainer in main.jsx */}
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
