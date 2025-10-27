import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '../components/AdminSidebar';

const AllEquipments = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin');
  };

  const fetchEquipments = async (filter = 'All') => {
    console.log('FETCHING EQUIPMENTS...');
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      let params = {};

      // Apply filter dynamically
      if (filter === 'Available') params.is_available = 'true';
      if (filter === 'Unavailable') params.is_available = 'false';

      const response = await axios.get('https://shoaibahmad.pythonanywhere.com/api/equipment/', {
        headers: { Authorization: `Token ${token}` },
        params,
      });

      // Handle paginated response
      const results = response.data.results || [];
      setEquipments(results);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError('❌ Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments(activeFilter);
  }, [activeFilter]);

  return (
    <div className='flex'>
      <AdminSidebar onLogout={handleLogout} />

      <div className='min-h-screen flex-1 bg-gray-100 p-10'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-cyan-700'>All Equipments</h1>

          {/* Filter Buttons */}
          <div className='flex gap-2'>
            {['All', 'Available', 'Unavailable'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-4 py-2 font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <p
            className={`mb-4 font-semibold ${
              message.includes('❌') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}

        {error && <p className='mb-4 text-red-600'>{error}</p>}

        {loading ? (
          <p>Loading equipments...</p>
        ) : equipments.length === 0 ? (
          <p>No equipment found.</p>
        ) : (
          <div className='overflow-x-auto rounded-xl bg-white p-6 shadow-md'>
            <table className='w-full border'>
              <thead>
                <tr className='bg-cyan-700 text-white'>
                  <th className='border px-4 py-3'>Image</th>
                  <th className='border px-4 py-3'>Name</th>
                  <th className='border px-4 py-3'>Type</th>
                  <th className='border px-4 py-3'>Price</th>
                  <th className='border px-4 py-3'>Available</th>
                  <th className='border px-4 py-3'>Stock</th>
                  <th className='border px-4 py-3'>Action</th>
                </tr>
              </thead>
              <tbody>
                {equipments.map((eq) => (
                  <tr key={eq.id} className='border-t text-center hover:bg-gray-50'>
                    <td className='border px-4 py-3'>
                      {eq.image ? (
                        <img
                          src={eq.image}
                          alt={eq.name}
                          className='mx-auto h-16 w-16 rounded-lg object-cover'
                        />
                      ) : (
                        <span className='text-gray-400 italic'>No image</span>
                      )}
                    </td>
                    <td className='border px-4 py-3'>{eq.name}</td>
                    <td className='border px-4 py-3 capitalize'>{eq.equipment_type}</td>
                    <td className='border px-4 py-3'>${eq.price}</td>
                    <td className='border px-4 py-3'>{eq.is_available ? '✅' : '❌'}</td>
                    <td className='border px-4 py-3'>{eq.stock_quantity}</td>
                    <td className='border px-4 py-3'>
                      <button
                        onClick={() => navigate(`/admin/update-equipment/${eq.id}`)}
                        className='rounded-lg bg-cyan-600 px-3 py-1 text-white hover:bg-cyan-700'
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEquipments;
