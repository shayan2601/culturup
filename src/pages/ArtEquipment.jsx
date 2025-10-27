import Navbar from '@components/Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ArtEquipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [error, setError] = useState(null);

  const filters = ['All', 'Available', 'Unavailable'];

  useEffect(() => {
    fetchEquipments();
  }, [activeFilter]);

  const fetchEquipments = async () => {
    console.log('FETCH:::');
    try {
      setLoading(true);
      setError(null);

      // Build query params dynamically
      let params = {};
      if (activeFilter === 'Available') params.is_available = 'true';
      if (activeFilter === 'Unavailable') params.is_available = 'false';

      const response = await axios.get('https://shoaibahmad.pythonanywhere.com/api/equipment/', {
        params,
      });

      setEquipments(response.data.results || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError('Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-3xl font-bold text-gray-900'>Art Equipment</h2>
          <button
            onClick={fetchEquipments}
            className='text-sm font-medium text-cyan-600 hover:text-cyan-500'
          >
            Refresh List
          </button>
        </div>

        {/* Filters */}
        <div className='mb-8 flex flex-wrap gap-2'>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeFilter === filter
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className='py-10 text-center text-gray-500'>Loading equipments...</div>
        ) : error ? (
          <div className='py-10 text-center text-red-600'>{error}</div>
        ) : equipments.length === 0 ? (
          <div className='py-10 text-center text-gray-600'>No equipment found.</div>
        ) : (
          <>
            {/* Equipment Grid */}
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {equipments.map((item) => (
                <div
                  key={item.id}
                  className='group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg'
                >
                  <div className='h-48 overflow-hidden'>
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1639537254680-3d9aa118abbe?w=900&auto=format&fit=crop&q=60'
                      }
                      alt={item.name}
                      className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                  </div>
                  <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4'>
                    <h3 className='text-lg font-bold text-white'>{item.name}</h3>
                    <p className='text-sm text-white/80'>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                  <div className='bg-white p-4'>
                    <p className='text-sm text-gray-600'>{item.description}</p>
                    <div className='mt-3 flex items-center justify-between'>
                      <span className='text-sm font-medium text-cyan-600'>View Details</span>
                      <span className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-600'>
                        {item.equipment_type || 'General'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ArtEquipment;
