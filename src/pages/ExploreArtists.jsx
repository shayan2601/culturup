import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@components/Navbar';

const ExploreArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      // Replace this URL with your actual artists API endpoint
      const response = await axios.get('https://shoaibahmad.pythonanywhere.com/api/artists/');
      setArtists(response.data.results || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Explore Artists</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading artists...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : artists.length === 0 ? (
          <div className="text-center text-gray-600 py-10">No artists found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artists.map((artist) => (
              <div
                key={artist.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <img
                  src={artist.profile_image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600'}
                  alt={artist.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{artist.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {artist.specialization || 'Contemporary Artist'}
                  </p>
                  <button className="mt-3 text-cyan-600 text-sm font-medium hover:underline">
                    View Profile →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreArtists;
