import axios from 'axios';
import { Bookmark, CheckCircle, ChevronLeft, Eye, Heart, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ArtworkDetailPage = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchArtwork();
  }, [artworkId]);

  const fetchArtwork = async () => {
    try {
      const res = await axios.get(
        `https://shoaibahmad.pythonanywhere.com/api/artworks/${artworkId}/`
      );
      setArtwork(res.data);
    } catch (err) {
      console.error('Error fetching artwork:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);

  if (loading)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-lg text-gray-600'>Loading artwork details...</p>
      </div>
    );

  if (!artwork)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-lg text-gray-600'>Artwork not found.</p>
      </div>
    );

  const artist = artwork.artist || {};
  const category = artwork.category || {};

  return (
    <div className='min-h-screen bg-gray-50 py-6'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Back button */}
        <div className='mb-6'>
          <button
            onClick={() => navigate(-1)}
            className='inline-flex items-center text-gray-600 hover:text-gray-900'
          >
            <ChevronLeft className='mr-1 h-5 w-5' />
            Back to Artworks
          </button>
        </div>

        {/* Layout */}
        <div className='lg:grid lg:grid-cols-3 lg:gap-8'>
          {/* Artwork Image */}
          <div className='mb-6 lg:col-span-2 lg:mb-0'>
            <div className='overflow-hidden rounded-lg bg-white shadow-md'>
              <img
                src={artwork.watermarked_image || artwork.image}
                alt={artwork.title}
                className='h-96 w-full object-cover'
              />
              <div className='flex items-center justify-between border-t border-gray-100 p-4'>
                <div className='flex space-x-4'>
                  <button
                    className='flex items-center text-gray-500 hover:text-red-500'
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`mr-1 h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    <span>{isLiked ? artwork.likes_count + 1 : artwork.likes_count}</span>
                  </button>
                  <div className='flex items-center text-gray-500'>
                    <Eye className='mr-1 h-5 w-5' />
                    <span>{artwork.views_count}</span>
                  </div>
                </div>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className='rounded-full border border-gray-200 p-2 hover:bg-gray-50'
                  >
                    <Bookmark
                      className={`h-5 w-5 ${
                        isBookmarked ? 'fill-cyan-600 text-cyan-600' : 'text-gray-500'
                      }`}
                    />
                  </button>
                  <button className='rounded-full border border-gray-200 p-2 hover:bg-gray-50'>
                    <Share2 className='h-5 w-5 text-gray-500' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className='lg:col-span-1'>
            <div className='mb-6 rounded-lg bg-white p-6 shadow-md'>
              <h1 className='mb-2 text-2xl font-bold text-gray-900'>{artwork.title}</h1>
              <div className='mb-4 flex items-center'>
                <span className='text-sm text-gray-600'>by</span>
                <span className='ml-1 text-sm font-medium text-gray-800'>
                  {artist.first_name} {artist.last_name}
                </span>
                {artist.is_verified && <CheckCircle className='ml-1 h-4 w-4 text-cyan-600' />}
              </div>
              <p className='mb-4 text-sm text-gray-600'>{artwork.description}</p>

              {/* Price */}
              <div className='mb-6 border-t border-b py-4'>
                <p className='mb-1 text-sm text-gray-500'>Price</p>
                <p className='text-3xl font-bold text-gray-900'>{formatPrice(artwork.price)}</p>
                <p className='mt-2 text-sm text-gray-500'>
                  Category: <span className='font-medium'>{category.name}</span>
                </p>
                <p className='text-sm text-gray-500'>
                  Type: <span className='font-medium'>{artwork.artwork_type}</span>
                </p>

                {/* Purchase Button */}
                <button
                  onClick={() => navigate(`/purchase/${artwork.id}`)}
                  className='mt-5 w-full rounded-lg bg-cyan-600 py-3 font-medium text-white transition hover:bg-cyan-700'
                >
                  Purchase
                </button>
              </div>

              {/* Artist Info */}
              <div className='border-t pt-4'>
                <h3 className='mb-4 font-medium text-gray-900'>About the Artist</h3>
                <div className='mb-3 flex items-center'>
                  <img
                    src={artist.profile_image || 'https://via.placeholder.com/80?text=Artist'}
                    alt={artist.first_name}
                    className='mr-3 h-12 w-12 rounded-full object-cover'
                  />
                  <div>
                    <h4 className='font-medium text-gray-900'>
                      {artist.first_name} {artist.last_name}
                    </h4>
                    <p className='text-sm text-gray-600'>{artist.user_type || 'Artist'}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/artist/${artist.id}`)}
                  className='text-sm font-medium text-cyan-600 hover:text-cyan-700'
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailPage;
