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
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-cyan-700'>Admin Dashboard</h1>
          <div className='text-sm text-gray-500'>
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {error && (
          <div className='mb-6 rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700 shadow-sm'>
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className='mb-10 space-y-8'>
          {/* User Statistics */}
          <div>
            <h2 className='mb-4 text-xl font-semibold text-gray-700'>User Overview</h2>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <StatCard title='Total Users' value={stats?.total_users} />
              <StatCard title='Total Artists' value={stats?.total_artists} />
              <StatCard title='Total Buyers' value={stats?.total_buyers} />
            </div>
          </div>

          {/* Job Statistics */}
          <div>
            <h2 className='mb-4 text-xl font-semibold text-gray-700'>Job Statistics</h2>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              <StatCard title='Total Jobs' value={stats?.total_jobs} />
              <StatCard title='Active Jobs' value={stats?.active_jobs} color='text-blue-600' />
              <StatCard title='In Progress' value={stats?.in_progress_jobs} color='text-amber-600' />
              <StatCard title='Completed Jobs' value={stats?.completed_jobs} color='text-green-600' />
            </div>
          </div>

          {/* Order & Payment Statistics */}
          <div>
            <h2 className='mb-4 text-xl font-semibold text-gray-700'>Orders & Finance</h2>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              <StatCard title='Total Orders' value={stats?.total_orders} />
              <StatCard title='Pending Orders' value={stats?.pending_orders} color='text-amber-600' />
              <StatCard title='Completed Orders' value={stats?.completed_orders} color='text-green-600' />
              <StatCard
                title='Total Revenue'
                value={stats?.total_revenue}
                isCurrency
                color='text-cyan-700'
              />
            </div>
            <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3'>
              <StatCard title='Total Payments' value={stats?.total_payments} />
              <StatCard title='Pending Payments' value={stats?.pending_payments} color='text-amber-600' />
              <StatCard title='Completed Payments' value={stats?.completed_payments} color='text-green-600' />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-8 xl:grid-cols-2'>
          {/* Recent Registrations Table */}
          <div className='rounded-2xl bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-xl font-bold text-gray-700'>Recent Registrations</h3>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Username</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Email</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Type</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white text-sm'>
                  {stats?.recent_registrations?.map((user) => (
                    <tr key={user.id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 font-medium text-gray-900'>{user.username}</td>
                      <td className='px-6 py-4 text-gray-600'>{user.email}</td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          user.user_type === 'artist' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.user_type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className='rounded-2xl bg-white p-6 shadow-sm'>
            <h3 className='mb-4 text-xl font-bold text-gray-700'>Recent Orders</h3>
            <div className='overflow-x-auto'>
              {stats?.recent_orders?.length > 0 ? (
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Order ID</th>
                      <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Customer</th>
                      <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Status</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-200 bg-white text-sm'>
                    {stats.recent_orders.map((order, idx) => (
                      <tr key={order.id || idx} className='hover:bg-gray-50 transition-colors'>
                        <td className='px-6 py-4 font-mono text-gray-500'>{order.id || '#'+idx}</td>
                        <td className='px-6 py-4 text-gray-900'>{order.customer_name || 'Anonymous'}</td>
                        <td className='px-6 py-4'>
                           <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'>
                            {order.status || 'Success'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className='flex h-32 items-center justify-center text-gray-400'>
                  No recent orders found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className='mt-8 rounded-2xl bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-xl font-bold text-gray-700'>Recent Payments</h3>
          <div className='overflow-x-auto'>
            {stats?.recent_payments?.length > 0 ? (
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Transaction ID</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Payer</th>
                    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>Amount</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 bg-white text-sm'>
                  {stats.recent_payments.map((payment, index) => (
                    <tr key={payment.transaction_id || index} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 font-mono text-gray-500'>{payment.transaction_id}</td>
                      <td className='px-6 py-4 font-medium text-gray-900'>{payment.payer__username}</td>
                      <td className='px-6 py-4 text-gray-600'>Rs. {payment.amount || '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='flex h-32 items-center justify-center text-gray-400'>
                No recent payments found
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className='mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2'>
          <div className='rounded-2xl bg-white p-6 shadow-sm'>
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
                <CartesianGrid stroke='#f0f0f0' strokeDasharray='5 5' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='rounded-2xl bg-white p-6 shadow-sm'>
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

/* Helper Components */
const StatCard = ({ title, value, isCurrency = false, color = 'text-cyan-700' }) => (
  <div className='rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-gray-100'>
    <h3 className='mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500'>
      {title}
    </h3>
    <p className={`text-2xl font-bold ${color}`}>
      {value !== undefined ? (isCurrency ? `Rs. ${Number(value).toLocaleString()}` : value) : '--'}
    </p>
  </div>
);

export default AdminDashboard;
