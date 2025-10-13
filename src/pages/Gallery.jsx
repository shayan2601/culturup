import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@components/Navbar';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      // Replace this URL with your actual artworks API endpoint
      const response = await axios.get('https://shoaibahmad.pythonanywhere.com/api/artworks/');
      setArtworks(response.data.results || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Gallery</h2>

        {loading ? (
          <div className="text-center text-gray-500 py-10">Loading gallery...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-10">{error}</div>
        ) : artworks.length === 0 ? (
          <div className="text-center text-gray-600 py-10">No artworks found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="group relative rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={art.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900'}
                  alt={art.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{art.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{art.artist_name || 'Unknown Artist'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
