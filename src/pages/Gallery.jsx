import Navbar from '@components/Navbar';
import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(
    'https://shoaibahmad.pythonanywhere.com/api/artworks/'
  );
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    const handleVisibilityChange = () => {
      const elems = document.querySelectorAll('.sensitive');
      elems.forEach((el) => {
        el.style.filter = document.visibilityState === 'hidden' ? 'blur(10px)' : 'none';
      });
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const parsePageFromUrl = (url) => {
    try {
      const u = new URL(url);
      return parseInt(u.searchParams.get('page') || '1', 10);
    } catch (err) {
      // ignore parse errors
      console.debug('parsePageFromUrl error', err);
      return 1;
    }
  };

  const fetchArtworks = useCallback(async (url) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(url);
      const data = response.data || {};
      setArtworks(data.results || []);
      setCount(data.count || 0);
      setNextUrl(data.next || null);
      setPrevUrl(data.previous || null);

      // infer page size from results if available
      if (Array.isArray(data.results) && data.results.length > 0) {
        setPageSize(data.results.length);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  }, []);

  // load artworks whenever currentUrl changes
  useEffect(() => {
    fetchArtworks(currentUrl);
  }, [currentUrl, fetchArtworks]);

  const navigateToArtworkDetail = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  const totalPages = Math.max(1, Math.ceil(count / (pageSize || 1)));
  const currentPage = parsePageFromUrl(currentUrl);

  const goToNext = () => {
    if (nextUrl) setCurrentUrl(nextUrl);
  };

  const goToPrev = () => {
    if (prevUrl) setCurrentUrl(prevUrl);
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
          <>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
              {artworks.map((art) => (
                <div
                  key={art.id}
                  onClick={() => navigateToArtworkDetail(art.id)}
                  className='group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-lg'
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

            {/* Pagination controls */}
            <div className='mt-8 flex items-center justify-center space-x-4'>
              <button
                onClick={() => goToPrev()}
                disabled={!prevUrl}
                className={`rounded px-3 py-2 ${prevUrl ? 'bg-gray-200 hover:bg-gray-300' : 'cursor-not-allowed bg-gray-100 text-gray-400'}`}
              >
                Prev
              </button>

              <div className='text-sm text-gray-700'>
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => goToNext()}
                disabled={!nextUrl}
                className={`rounded px-3 py-2 ${nextUrl ? 'bg-gray-200 hover:bg-gray-300' : 'cursor-not-allowed bg-gray-100 text-gray-400'}`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Gallery;
