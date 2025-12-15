import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [setupData, setSetupData] = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [password, setPassword] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);

  const authToken = localStorage.getItem('authToken');

  const axiosAuth = axios.create({
    headers: { Authorization: authToken ? `Token ${authToken}` : '' },
  });

  const fetchStatus = useCallback(async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await axiosAuth.get(
        'https://shoaibahmad.pythonanywhere.com/api/auth/2fa/status/'
      );
      setStatus(res.data?.two_factor_enabled ? { enabled: true } : { enabled: false });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not fetch 2FA status');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const getSetup = async () => {
    if (!authToken) return toast.error('Not authenticated');
    setLoading(true);
    try {
      const res = await axiosAuth.get('https://shoaibahmad.pythonanywhere.com/api/auth/2fa/setup/');
      // expected: {qr_code: <url/base64>, secret: 'ABCDEF...'}
      setSetupData(res.data);
      toast.info('Scan the QR code with your authenticator app and enter a code to enable 2FA');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Could not start 2FA setup');
    } finally {
      setLoading(false);
    }
  };

  const enable2FA = async (e) => {
    e.preventDefault();
    if (!authToken) return toast.error('Not authenticated');
    if (!totpCode) return toast.error('Enter the TOTP code from your authenticator');
    setLoading(true);
    try {
      const payload = { totp_code: totpCode };
      const res = await axiosAuth.post(
        'https://shoaibahmad.pythonanywhere.com/api/auth/2fa/enable/',
        payload
      );
      setBackupCodes(res.data.backup_codes || []);
      toast.success('2FA enabled. Save your backup codes in a safe place.');
      setSetupData(null);
      setTotpCode('');
      fetchStatus();
    } catch (err) {
      toast.error(
        err.response?.data?.detail || err.response?.data?.error || 'Failed to enable 2FA'
      );
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async (e) => {
    e.preventDefault();
    if (!authToken) return toast.error('Not authenticated');
    if (!password) return toast.error('Enter your password to disable 2FA');
    setLoading(true);
    try {
      const payload = { password };
      // optionally include totp_code or backup_code in payload if user wants
      const res = await axiosAuth.post(
        'https://shoaibahmad.pythonanywhere.com/api/auth/2fa/disable/',
        payload
      );
      toast.success(res.data?.detail || '2FA disabled');
      setPassword('');
      fetchStatus();
    } catch (err) {
      toast.error(
        err.response?.data?.detail || err.response?.data?.error || 'Failed to disable 2FA'
      );
    } finally {
      setLoading(false);
    }
  };

  const regenBackupCodes = async () => {
    if (!authToken) return toast.error('Not authenticated');
    setLoading(true);
    try {
      const res = await axiosAuth.post(
        'https://shoaibahmad.pythonanywhere.com/api/auth/2fa/backup-codes/'
      );
      setBackupCodes(res.data.backup_codes || []);
      toast.success('Backup codes regenerated. Save them somewhere safe.');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to regenerate backup codes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='mx-auto max-w-3xl p-6'>
        <h1 className='mb-4 text-3xl font-bold'>Settings</h1>

        <section className='mb-6 rounded bg-white p-6 shadow'>
          <h2 className='mb-2 text-xl font-semibold'>Two-Factor Authentication (2FA)</h2>
          <p className='mb-4 text-sm text-gray-600'>
            Manage your TOTP-based two-factor authentication and backup codes.
          </p>

          <div className='space-y-4'>
            <div>
              <strong>Status:</strong>{' '}
              {loading && !status ? 'Checking...' : status?.enabled ? 'Enabled' : 'Disabled'}
            </div>

            {!status?.enabled && (
              <div className='space-y-2'>
                <button onClick={getSetup} className='rounded bg-cyan-600 px-4 py-2 text-white'>
                  Start 2FA setup
                </button>
              </div>
            )}

            {setupData && (
              <div className='mt-4 flex flex-col gap-4'>
                <div>
                  {setupData.qr_code ? (
                    // qr_code might be a data URL or an image url
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img
                      src={setupData.qr_code}
                      alt='QR code'
                      className='h-48 w-48 rounded border'
                    />
                  ) : null}
                </div>
                <div>
                  <div className='mb-2'>
                    Secret: <code className='rounded bg-gray-100 p-1'>{setupData.secret}</code>
                  </div>
                  <form onSubmit={enable2FA} className='flex gap-2'>
                    <input
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      placeholder='Enter code from app'
                      className='flex-1 rounded border p-2'
                    />
                    <button className='rounded bg-green-600 px-4 py-2 text-white'>Enable</button>
                  </form>
                </div>
              </div>
            )}

            {status?.enabled && (
              <div className='space-y-2'>
                <button
                  onClick={regenBackupCodes}
                  className='rounded bg-yellow-600 px-4 py-2 text-white'
                >
                  Regenerate backup codes
                </button>
                <form onSubmit={disable2FA} className='mt-2 flex gap-2'>
                  <input
                    type='password'
                    placeholder='Your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='flex-1 rounded border p-2'
                  />
                  <button className='rounded bg-red-600 px-4 py-2 text-white'>Disable 2FA</button>
                </form>
              </div>
            )}

            {backupCodes?.length > 0 && (
              <div className='mt-4 rounded border bg-gray-50 p-4'>
                <h3 className='mb-2 text-sm font-medium'>Backup codes (store these safely)</h3>
                <ul className='grid gap-2 sm:grid-cols-2'>
                  {backupCodes.map((c, i) => (
                    <li key={i} className='rounded bg-white p-2 shadow-sm'>
                      <code>{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Settings;
