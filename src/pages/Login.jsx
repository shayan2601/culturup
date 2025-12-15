import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Navbar from '../components/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [requires2FA, setRequires2FA] = useState(false);
  const [sessionToken, setSessionToken] = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/auth/login/',
        formData
      );

      // if server requires 2FA, it will return requires_2fa with a session_token
      if (response.data?.requires_2fa) {
        setRequires2FA(true);
        setSessionToken(response.data.session_token);
        toast.info(response.data.message || 'Please provide 2FA code');
        setLoading(false);
        return;
      }

      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));

      toast.success('Login successful!');

      setFormData({ username: '', password: '' });

      navigate('/');
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Login failed';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerify = async (e) => {
    e.preventDefault();
    if (!sessionToken) return toast.error('Session token missing');
    setLoading(true);

    try {
      const payload = { session_token: sessionToken };
      if (totpCode) payload.totp_code = totpCode;
      if (backupCode) payload.backup_code = backupCode;

      const res = await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/auth/2fa/verify/',
        payload
      );

      const { token, user } = res.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      toast.success('Login successful!');
      setRequires2FA(false);
      setSessionToken(null);
      setTotpCode('');
      setBackupCode('');
      navigate('/');
    } catch (err) {
      const errMsg =
        err.response?.data?.error || err.response?.data?.detail || '2FA verification failed';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const cancel2FA = () => {
    setRequires2FA(false);
    setSessionToken(null);
    setTotpCode('');
    setBackupCode('');
  };

  return (
    <>
      <Navbar />
      <div className='flex min-h-screen items-center justify-center bg-gray-100 px-4'>
        <div className='w-full max-w-md rounded bg-white p-8 shadow-lg'>
          <h2 className='mb-6 text-center text-3xl font-bold text-cyan-600'>Login</h2>
          {!requires2FA ? (
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
            </form>
          ) : (
            <form className='space-y-4' onSubmit={handle2FAVerify}>
              <p className='text-sm text-gray-600'>
                Enter the 6-digit code from your authenticator app or a backup code.
              </p>
              <input
                type='text'
                name='totp'
                placeholder='2FA code (TOTP)'
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className='w-full rounded border p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
              />
              <div className='text-center text-gray-500'>or</div>
              <input
                type='text'
                name='backup'
                placeholder='Backup code'
                value={backupCode}
                onChange={(e) => setBackupCode(e.target.value)}
                className='w-full rounded border p-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
              />

              <div className='flex gap-2'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 rounded bg-cyan-600 py-2 text-white transition hover:bg-cyan-700 disabled:opacity-50'
                >
                  {loading ? 'Verifying...' : 'Verify 2FA'}
                </button>
                <button
                  type='button'
                  onClick={cancel2FA}
                  className='flex-1 rounded border py-2 text-gray-700 hover:bg-gray-50'
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
