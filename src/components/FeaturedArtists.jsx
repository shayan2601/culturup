import axios from 'axios';
import { useEffect, useState } from 'react';

const FeaturedArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await axios.get('https://shoaibahmad.pythonanywhere.com/api/artist-profiles/');
      setArtists(res.data.results.slice(0, 6));
    } catch (err) {
      console.error('Error fetching artists:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className='py-12 text-center text-gray-500'>Loading artists...</div>;

  return (
    <div className='bg-white py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-gray-900'>Featured Artists</h2>
          <a href='/artists' className='text-sm font-medium text-cyan-600 hover:text-cyan-500'>
            View All Artists
          </a>
        </div>

        {artists.length === 0 ? (
          <p className='text-center text-gray-500'>No artists found.</p>
        ) : (
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {artists.map((artist, index) => (
              <div
                key={index}
                className='rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md'
              >
                <div className='relative'>
                  <img
                    src={
                      artist.user?.profile_image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${artist.user?.first_name || 'Artist'} ${artist.user?.last_name || ''}`
                      )}&background=ddd&color=555&size=400`
                    }
                    alt={artist.user?.username || 'Artist'}
                    className='h-48 w-full rounded-t-lg object-cover'
                  />
                  <div className='absolute inset-0 rounded-t-lg bg-gradient-to-t from-black/50 to-transparent'></div>
                </div>

                <div className='p-5'>
                  <div className='flex items-center'>
                    <img
                      src={
                        artist.user?.profile_image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${artist.user?.first_name || 'Artist'} ${artist.user?.last_name || ''}`
                        )}&background=ccc&color=555&size=128`
                      }
                      alt={artist.user?.username || 'Artist'}
                      className='-mt-10 h-12 w-12 rounded-full border-2 border-white bg-gray-100 object-cover shadow-md'
                    />
                    <div className='ml-4'>
                      <h3 className='text-lg font-bold text-gray-900'>
                        {artist.user?.first_name} {artist.user?.last_name}
                      </h3>
                      <p className='text-sm text-gray-500'>{artist.skills || 'No skills listed'}</p>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-gray-500'>Experience</p>
                      <p className='font-semibold'>{artist.experience_level || 'N/A'}</p>
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Hourly Rate</p>
                      <p className='font-semibold'>${artist.hourly_rate}</p>
                    </div>
                    <button className='rounded-full bg-cyan-600 px-4 py-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-cyan-700'>
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedArtists;
