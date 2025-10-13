import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@components/Navbar';

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
    console.log("FETCH:::")
    try {
      setLoading(true);
      setError(null);

      // Build query params dynamically
      let params = {};
      if (activeFilter === 'Available') params.is_available = 'true';
      if (activeFilter === 'Unavailable') params.is_available = 'false';

      const response = await axios.get(
        'https://shoaibahmad.pythonanywhere.com/api/equipment/',
        { params }
      );

      setEquipments(response.data.results || []);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setError('Failed to load equipment data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Art Equipment</h2>
          <button
            onClick={fetchEquipments}
            className="text-cyan-600 hover:text-cyan-500 text-sm font-medium"
          >
            Refresh List
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
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
          <div className="text-center text-gray-500 py-10">Loading equipments...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : equipments.length === 0 ? (
          <div className="text-center text-gray-600 py-10">No equipment found.</div>
        ) : (
          <>
            {/* Equipment Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipments.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        item.image ||
                        'https://images.unsplash.com/photo-1639537254680-3d9aa118abbe?w=900&auto=format&fit=crop&q=60'
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg">{item.name}</h3>
                    <p className="text-white/80 text-sm">
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-cyan-600 font-medium text-sm">View Details</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
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
