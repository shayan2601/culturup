import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@components/Navbar';
import { useNavigate } from 'react-router-dom';

const ExploreArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔹 Default filter state (all required params included)
  const [filters, setFilters] = useState({
    experience_level: 'beginner',   // beginner | intermediate | expert
    is_available: true,           // true | false
    min_hourly_rate: 50,          // number
    max_hourly_rate: 500,         // number
    search: '',                   // string
    ordering: '-rating',          // rating | -rating | hourly_rate | -hourly_rate
    page: 1,                      // number
    page_size: 20,                // number (<= 100)
  });

  useEffect(() => {
    fetchArtists();
  }, [filters]); // re-fetch when filters change

  const fetchArtists = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token'); // optional

      const response = await axios.get(
        'http://shoaibahmad.pythonanywhere.com/api/artist-profiles/',
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: filters,
        }
      );

      setArtists(response.data.results || []);
    } catch (err) {
      console.error('API error:', err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
          'Failed to load artist profiles. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Artists</h2>

        {/* 🔹 Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-center">
          <select
            value={filters.experience_level}
            onChange={(e) =>
              setFilters({ ...filters, experience_level: e.target.value })
            }
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>

          <select
            value={filters.is_available}
            onChange={(e) =>
              setFilters({ ...filters, is_available: e.target.value === 'true' })
            }
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>

          <input
            type="number"
            placeholder="Min rate"
            value={filters.min_hourly_rate}
            onChange={(e) =>
              setFilters({ ...filters, min_hourly_rate: e.target.value })
            }
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-28"
          />

          <input
            type="number"
            placeholder="Max rate"
            value={filters.max_hourly_rate}
            onChange={(e) =>
              setFilters({ ...filters, max_hourly_rate: e.target.value })
            }
            className="border border-gray-300 rounded-md px-3 py-2 text-sm w-28"
          />

          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
          />

          <select
            value={filters.ordering}
            onChange={(e) => setFilters({ ...filters, ordering: e.target.value })}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="-rating">Highest Rated</option>
            <option value="rating">Lowest Rated</option>
            <option value="-hourly_rate">Highest Rate</option>
            <option value="hourly_rate">Lowest Rate</option>
          </select>

          <button
            onClick={() => setFilters({ ...filters, page: 1 })}
            className="bg-cyan-600 text-white px-4 py-2 rounded-md text-sm hover:bg-cyan-700"
          >
            Apply Filters
          </button>
        </div>

        {/* 🔹 Results Section */}
        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading artists...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : artists.length === 0 ? (
          <div className="text-center text-gray-600 py-10">No artists found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artists.map((artist, index) => {
              const user = artist.user || {};
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <img
                    src={
                      user?.profile_image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${user?.first_name || 'Artist'} ${user?.last_name || ''}`
                      )}&background=ccc&color=555&size=256`
                    }
                    alt={`${user?.first_name || 'Artist'} ${user?.last_name || ''}`}
                    className="w-full h-56 object-cover rounded-lg"
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {`${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                        user.username ||
                        'Unknown Artist'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {artist.skills || 'Contemporary Artist'}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                      <span>
                        ⭐ {artist?.rating ? Number(artist.rating).toFixed(1) : "N/A"}
                      </span>

                      <span>💰 ${artist.hourly_rate || 'N/A'}/hr</span>
                    </div>

                    <p className="mt-3 text-xs text-gray-500 line-clamp-2">
                      {artist.bio || 'No bio available'}
                    </p>

                    <div className="flex gap-2 mt-4">
                      <button className="text-cyan-600 text-sm font-medium hover:underline">
                        View Profile →
                      </button>
                      <button
                        onClick={() => navigate("/chat", { state: { artistId: artist.user.id } })}
                        className="bg-cyan-600 text-white text-sm px-3 py-2 rounded-md hover:bg-cyan-700"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreArtists;
