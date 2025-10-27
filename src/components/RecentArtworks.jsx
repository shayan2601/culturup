import axios from 'axios';
import { Bookmark, Eye, Filter, Grid, Heart, List, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RecentArtworks = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://shoaibahmad.pythonanywhere.com/api/artworks/');
      // limit to 6 artworks
      setArtworks(response.data.results.slice(0, 6));
    } catch (err) {
      console.error('Error fetching artworks:', err);
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const navigateToArtworkDetail = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  if (loading) return <div className='py-12 text-center text-gray-500'>Loading artworks...</div>;

  if (error) return <div className='py-12 text-center text-red-500'>{error}</div>;

  return (
    <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
      <div className='mb-8 flex items-center justify-between'>
        <h2 className='text-2xl font-bold text-gray-900'>Recent Artworks</h2>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center rounded-lg bg-gray-100 p-1'>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded p-1.5 ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
            >
              <Grid className='h-5 w-5 text-gray-500' />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-1.5 ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
            >
              <List className='h-5 w-5 text-gray-500' />
            </button>
          </div>
          <button className='flex items-center text-gray-600 hover:text-gray-800'>
            <Filter className='mr-1 h-4 w-4' />
            <span className='text-sm font-medium'>Filter</span>
          </button>
          <a href='/artworks' className='text-sm font-medium text-cyan-600 hover:text-cyan-500'>
            View All
          </a>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className='cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md'
              onClick={() => navigateToArtworkDetail(artwork.id)}
            >
              <div className='relative'>
                <img
                  src={artwork.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={artwork.title}
                  className='h-56 w-full object-cover'
                />
                <div
                  className='absolute top-3 right-3 rounded-full bg-white p-1.5 shadow-md'
                  onClick={(e) => e.stopPropagation()}
                >
                  <Bookmark className='h-4 w-4 text-gray-600' />
                </div>
              </div>
              <div className='p-4'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900'>{artwork.title}</h3>
                    <p className='text-sm text-gray-600'>by {artwork.artist_name}</p>
                  </div>
                  <div className='rounded bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700'>
                    {artwork.category_name}
                  </div>
                </div>
                <p className='mt-2 font-bold text-cyan-600'>Rs.{artwork.price}</p>
                <div className='mt-3 flex items-center justify-between'>
                  <div className='flex space-x-3 text-sm text-gray-500'>
                    <div className='flex items-center'>
                      <Heart className='mr-1 h-4 w-4' />
                      <span>{artwork.likes_count}</span>
                    </div>
                    <div className='flex items-center'>
                      <Eye className='mr-1 h-4 w-4' />
                      <span>{artwork.views_count}</span>
                    </div>
                  </div>
                  <button
                    className='text-cyan-600 hover:text-cyan-500'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // LIST VIEW
        <div className='space-y-4'>
          {artworks.map((artwork) => (
            <div
              key={artwork.id}
              className='flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md sm:flex-row'
              onClick={() => navigateToArtworkDetail(artwork.id)}
            >
              <img
                src={artwork.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                alt={artwork.title}
                className='h-48 w-full object-cover sm:w-48'
              />
              <div className='flex flex-1 flex-col justify-between p-4'>
                <div>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h3 className='text-lg font-bold text-gray-900'>{artwork.title}</h3>
                      <p className='text-sm text-gray-600'>by {artwork.artist_name}</p>
                    </div>
                    <div className='rounded bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700'>
                      {artwork.category_name}
                    </div>
                  </div>
                  <p className='mt-2 font-bold text-cyan-600'>${artwork.price}</p>
                </div>
                <div className='mt-3 flex items-center justify-between'>
                  <div className='flex space-x-3 text-sm text-gray-500'>
                    <div className='flex items-center'>
                      <Heart className='mr-1 h-4 w-4' />
                      <span>{artwork.likes_count}</span>
                    </div>
                    <div className='flex items-center'>
                      <Eye className='mr-1 h-4 w-4' />
                      <span>{artwork.views_count}</span>
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    <button
                      className='rounded-full border border-gray-300 bg-white p-1.5 hover:bg-gray-50'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Bookmark className='h-4 w-4 text-gray-600' />
                    </button>
                    <button
                      className='rounded-full border border-gray-300 bg-white p-1.5 hover:bg-gray-50'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Share2 className='h-4 w-4 text-gray-600' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentArtworks;
