// src/pages/artists/ArtistDetails.jsx
import AdminSidebar from '@components/AdminSidebar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtist();
    fetchArtworks();
  }, []);

  const fetchArtist = async () => {
    const token = localStorage.getItem('authToken');

    const res = await axios.get(
      `https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setArtist(res.data);
  };

  const fetchArtworks = async () => {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(
      `https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${id}/artworks/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setArtworks(res.data.results || []);
  };

  if (!artist) return <p className='p-10'>Loading...</p>;

  return (
    <div className='flex'>
      <AdminSidebar onLogout={() => navigate('/admin')} />
      <div className='min-h-screen flex-1 bg-gray-100 p-10'>
        <h1 className='mb-6 text-3xl font-bold text-cyan-700'>
          {artist.user.first_name} {artist.user.last_name}
        </h1>

        <div className='mb-6 rounded-xl bg-white p-6 shadow-md'>
          <p>
            <strong>Bio:</strong> {artist.bio}
          </p>
          <p>
            <strong>Skills:</strong> {artist.skills}
          </p>
          <p>
            <strong>Experience:</strong> {artist.experience_level}
          </p>
          <p>
            <strong>Hourly Rate:</strong> ${artist.hourly_rate}
          </p>
        </div>

        <h2 className='mb-4 text-2xl font-semibold'>Artworks</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {artworks.map((art) => (
            <div key={art.id} className='rounded-xl bg-white p-6 shadow-md'>
              <img
                src={art.image}
                alt={art.title}
                className='mb-3 h-48 w-full rounded-lg object-cover'
              />
              <h3 className='font-semibold'>{art.title}</h3>
              <p>${art.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
