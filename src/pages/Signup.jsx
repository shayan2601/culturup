import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    user_type: 'buyer',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
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
    setMessage(null);

    if(formData?.password.length < 6){
      setMessage({ type: 'error', text: "password must contain atleast 6 characters" });
      setLoading(false);
      return;
    }

    if(!/A-Z/.test(formData.password)){
      setMessage({ type: 'error', text: "password must contain capital letters" });
      setLoading(false);
      return;
    }

    if(!/a-z/.test(formData.password)){
      setMessage({ type: 'error', text: "password must contain small letters" });
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('https://shoaibahmad.pythonanywhere.com/api/signup/', formData);
      
      localStorage.setItem('signupUser', JSON.stringify(response.data));
      
      setMessage({ type: 'success', text: 'Signup successful! Redirecting to login...' });

      
  
      setFormData({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        user_type: 'buyer',
      });
  
      setTimeout(() => {
        navigate('/login');
      }, 1500);
  
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Signup failed';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-8 shadow-lg rounded">
          <h2 className="text-3xl font-bold text-center text-cyan-600 mb-6">Create Your Account</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              // minLength={6}
              // pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Account Type:</span>
              <div className="flex items-center space-x-2">
                <span className={`${formData.user_type === 'buyer' ? 'text-cyan-600 font-semibold' : 'text-gray-400'}`}>
                  Buyer
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.user_type === 'artist'}
                    onChange={toggleUserType}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
                <span className={`${formData.user_type === 'artist' ? 'text-cyan-600 font-semibold' : 'text-gray-400'}`}>
                  Artist
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition disabled:opacity-50"
            >
              {loading ? 'Signing up...' : 'Signup'}
            </button>

            {message && (
              <p className={`text-sm mt-2 text-center ${message.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                {message.text}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
