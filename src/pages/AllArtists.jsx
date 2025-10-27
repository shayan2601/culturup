// src/pages/artists/AllArtists.jsx
import AdminSidebar from '@components/AdminSidebar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AllArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await axios.get('https://shoaibahmad.pythonanywhere.com/api/artist-profiles/');
      setArtists(res.data.results);
    } catch (err) {
      console.error('Error fetching artists:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className='p-10'>Loading artists...</p>;

  return (
    <div className='flex'>
      <AdminSidebar onLogout={() => navigate('/admin')} />
      <div className='min-h-screen flex-1 bg-gray-100 p-10'>
        <h1 className='mb-6 text-3xl font-bold text-cyan-700'>All Artists</h1>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {artists.map((artist) => (
            <div key={artist.user.id} className='rounded-2xl bg-white p-6 shadow-md'>
              <img
                src={artist.user.profile_image}
                alt={artist.user.username}
                className='mb-4 h-48 w-full rounded-xl object-cover'
              />
              <h2 className='text-xl font-semibold'>
                {artist.user.first_name} {artist.user.last_name}
              </h2>
              <p className='text-gray-600'>{artist.skills}</p>
              <p className='mt-2 text-sm'>
                <strong>Experience:</strong> {artist.experience_level}
              </p>
              <p>
                <strong>Hourly:</strong> ${artist.hourly_rate}
              </p>
              <div className='mt-4 flex gap-2'>
                <button
                  onClick={() => navigate(`/admin/artist/${artist.user.id}`)}
                  className='rounded-lg bg-gray-600 px-3 py-1 text-sm text-white hover:bg-gray-700'
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllArtists;
