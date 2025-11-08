import Navbar from '@components/Navbar';
import axios from 'axios';
import { RefreshCw, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from 'src/context/CartContext';

const ArtEquipment = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [error, setError] = useState(null);
  const [addingId, setAddingId] = useState(null);

  const { addToCart } = useCart();

  const filters = ['All', 'Available', 'Unavailable'];

  useEffect(() => {
    fetchEquipments();
  }, [activeFilter]);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      setError(null);

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

  const handleAddToCart = (item) => {
    setAddingId(item.id);
    addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price || 0,
        image: item.image,
      },
      'equipment'
    );
    setTimeout(() => setAddingId(null), 800);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-3xl font-bold text-gray-900'>Art Equipment</h2>
          <button
            onClick={fetchEquipments}
            className='flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-500'
          >
            <RefreshCw size={16} />
            Refresh List
          </button>
        </div>

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

        {loading ? (
          <div className='py-10 text-center text-gray-500'>Loading equipments...</div>
        ) : error ? (
          <div className='py-10 text-center text-red-600'>{error}</div>
        ) : equipments.length === 0 ? (
          <div className='py-10 text-center text-gray-600'>No equipment found.</div>
        ) : (
          <>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
              {equipments.map((item) => (
                <div
                  key={item.id}
                  className='group flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg'
                >
                  <div className='relative h-48 w-full overflow-hidden'>
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1639537254680-3d9aa118abbe?w=900&auto=format&fit=crop&q=60'
                      }
                      alt={item.name}
                      className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                    />
                    <div className='absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-3'>
                      <h3 className='text-lg font-semibold text-white'>{item.name}</h3>
                      <p
                        className={`text-sm ${
                          item.is_available ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {item.is_available ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                  </div>

                  <div className='flex flex-1 flex-col justify-between p-4'>
                    <p className='line-clamp-2 text-sm text-gray-600'>{item.description}</p>

                    <div className='mt-3 flex items-center justify-between'>
                      <span className='rounded bg-gray-100 px-2 py-1 text-xs text-gray-600'>
                        {item.equipment_type || 'General'}
                      </span>
                      <span className='text-sm font-semibold text-cyan-700'>
                        Rs. {item.price || 0}
                      </span>
                    </div>

                    <button
                      disabled={!item.is_available}
                      onClick={() => handleAddToCart(item)}
                      className={`mt-4 flex items-center justify-center gap-2 rounded-lg py-2 font-medium transition ${
                        item.is_available
                          ? 'bg-cyan-600 text-white hover:bg-cyan-700'
                          : 'cursor-not-allowed bg-gray-300 text-gray-500'
                      }`}
                    >
                      <ShoppingCart size={16} />
                      {addingId === item.id ? 'Adding...' : 'Add to Cart'}
                    </button>
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
