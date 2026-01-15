import Navbar from '@components/Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExploreArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    experience_level: 'beginner',
    is_available: true,
    min_hourly_rate: 50,
    max_hourly_rate: 500,
    search: '',
    ordering: '-rating',
    page: 1,
    page_size: 20,
  });

  useEffect(() => {
    fetchArtists();
  }, [filters]);

  const fetchArtists = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');

      const response = await axios.get(
        'https://shoaibahmad.pythonanywhere.com/api/artist-profiles/',
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: filters,
        }
      );

      setArtists(response.data.results || []);
    } catch (err) {
      console.error('API error:', err.response?.data || err.message);
      setError(
        err.response?.data?.detail || 'Failed to load artist profiles. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-8 text-3xl font-bold text-gray-900'>Explore Artists</h2>

        <div className='mb-6 flex flex-wrap items-center gap-4 rounded-lg bg-white p-4 shadow'>
          <select
            value={filters.experience_level}
            onChange={(e) => setFilters({ ...filters, experience_level: e.target.value })}
            className='rounded-md border border-gray-300 px-3 py-2 text-sm'
          >
            <option value='beginner'>Beginner</option>
            <option value='intermediate'>Intermediate</option>
            <option value='expert'>Expert</option>
          </select>

          <select
            value={filters.is_available}
            onChange={(e) => setFilters({ ...filters, is_available: e.target.value === 'true' })}
            className='rounded-md border border-gray-300 px-3 py-2 text-sm'
          >
            <option value='true'>Available</option>
            <option value='false'>Unavailable</option>
          </select>

          

          <input
            type='text'
            placeholder='Search...'
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className='flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm'
          />

          
        </div>

        {loading ? (
          <div className='py-10 text-center text-gray-500'>Loading artists...</div>
        ) : error ? (
          <div className='py-10 text-center text-red-600'>{error}</div>
        ) : artists.length === 0 ? (
          <div className='py-10 text-center text-gray-600'>No artists found.</div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {artists.map((artist, index) => {
              const user = artist.user || {};
              return (
                <div
                  key={index}
                  className='overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg'
                >
                  <img
                    src={
                      user?.profile_image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${user?.first_name || 'Artist'} ${user?.last_name || ''}`
                      )}&background=ccc&color=555&size=256`
                    }
                    alt={`${user?.first_name || 'Artist'} ${user?.last_name || ''}`}
                    className='h-56 w-full rounded-lg object-cover'
                  />

                  <div className='p-4'>
                    <h3 className='text-lg font-semibold text-gray-800'>
                      {`${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                        user.username ||
                        'Unknown Artist'}
                    </h3>
                    <p className='mt-1 text-sm text-gray-500'>
                      {artist.skills || 'Contemporary Artist'}
                    </p>

                    <div className='mt-3 flex items-center justify-between text-sm text-gray-600'>
                      <span>⭐ {artist?.rating ? Number(artist.rating).toFixed(1) : 'N/A'}</span>

                      <span>💰 ${artist.hourly_rate || 'N/A'}/hr</span>
                    </div>

                    <p className='mt-3 line-clamp-2 text-xs text-gray-500'>
                      {artist.bio || 'No bio available'}
                    </p>

                    <div className='mt-4 flex gap-2'>
                      <button
                        onClick={() => navigate('/chat', { state: { artistId: artist.user.id } })}
                        className='rounded-md bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700'
                      >
                        Message
                      </button>
                      <button
                        onClick={() => navigate(`/artist/${artist.user.id}`)}
                        className='rounded-md bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700'
                      >
                        Profile
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
