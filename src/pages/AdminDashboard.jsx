import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28', '#FF4444'];

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/admin');
        return;
      }

      const response = await axios.get(
        'https://shoaibahmad.pythonanywhere.com/api/dashboard/stats/',
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard stats.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminData');
    navigate('/admin');
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-100'>
        <p className='text-lg font-semibold text-cyan-700'>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className='flex'>
      <AdminSidebar onLogout={handleLogout} />

      <div className='min-h-screen flex-1 overflow-y-auto bg-gray-100 p-10'>
        <h1 className='mb-8 text-3xl font-bold text-cyan-700'>Admin Dashboard</h1>

        {error && <p className='mb-4 text-red-600'>{error}</p>}

        <div className='mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3'>
          {stats ? (
            Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className='rounded-2xl bg-white p-6 shadow transition-all hover:shadow-lg'
              >
                <h3 className='mb-2 text-lg font-semibold text-gray-600 capitalize'>
                  {key.replace(/_/g, ' ')}
                </h3>
                <p className='text-2xl font-bold text-cyan-700'>{value}</p>
              </div>
            ))
          ) : (
            <p>No statistics available</p>
          )}
        </div>

        <div className='grid grid-cols-1 gap-10 lg:grid-cols-2'>
          <div className='rounded-2xl bg-white p-6 shadow'>
            <h3 className='mb-4 text-lg font-semibold text-gray-700'>Monthly User Growth</h3>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart
                data={[
                  { month: 'Jan', users: 120 },
                  { month: 'Feb', users: 160 },
                  { month: 'Mar', users: 210 },
                  { month: 'Apr', users: 260 },
                  { month: 'May', users: 310 },
                  { month: 'Jun', users: 400 },
                ]}
              >
                <Line type='monotone' dataKey='users' stroke='#00C49F' strokeWidth={3} />
                <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='rounded-2xl bg-white p-6 shadow'>
            <h3 className='mb-4 text-lg font-semibold text-gray-700'>
              Artwork Category Distribution
            </h3>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Paintings', value: 35 },
                    { name: 'Sculptures', value: 25 },
                    { name: 'Photography', value: 20 },
                    { name: 'Digital Art', value: 15 },
                    { name: 'Other', value: 5 },
                  ]}
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='value'
                  label
                >
                  {COLORS.map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
