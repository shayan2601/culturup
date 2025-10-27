import Navbar from '@components/Navbar';
import axios from 'axios';
import { useEffect, useState } from 'react';

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
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-8 text-3xl font-bold text-gray-900'>Gallery</h2>

        {loading ? (
          <div className='py-10 text-center text-gray-500'>Loading gallery...</div>
        ) : error ? (
          <div className='py-10 text-center text-red-600'>{error}</div>
        ) : artworks.length === 0 ? (
          <div className='py-10 text-center text-gray-600'>No artworks found.</div>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
            {artworks.map((art) => (
              <div
                key={art.id}
                className='group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg'
              >
                <img
                  src={
                    art.image ||
                    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900'
                  }
                  alt={art.title}
                  className='h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105'
                />
                <div className='p-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>{art.title}</h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    {art.artist_name || 'Unknown Artist'}
                  </p>
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
