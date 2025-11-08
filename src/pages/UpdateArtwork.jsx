import Navbar from '@components/Navbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateArtwork = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtwork();
  }, []);

  const fetchArtwork = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(`https://shoaibahmad.pythonanywhere.com/api/artworks/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setForm(res.data);
      setImagePreview(res.data.image);
    } catch (err) {
      console.error('Error fetching artwork:', err);
      alert('Failed to fetch artwork details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to update artwork.');
      return;
    }

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('price', form.price);
    formData.append('description', form.description || '');
    formData.append('is_available', form.is_available);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      await axios.patch(`https://shoaibahmad.pythonanywhere.com/api/artworks/${id}/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Artwork updated successfully!');
      navigate(-1);
    } catch (err) {
      console.error('Error updating artwork:', err.response?.data || err.message);
      alert('❌ Failed to update artwork. Please try again.');
    }
  };

  if (loading)
    return (
      <div className='flex min-h-screen items-center justify-center font-semibold text-cyan-700'>
        Loading artwork details...
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navbar />

      <div className='mx-auto mt-8 max-w-2xl rounded-xl bg-white p-6 shadow-lg'>
        <h1 className='mb-6 text-3xl font-bold text-cyan-700'>Update Artwork</h1>

        <form onSubmit={handleSubmit} className='space-y-5'>
          {imagePreview && (
            <div className='mb-4 flex justify-center'>
              <img
                src={imagePreview}
                alt={form.title}
                className='h-48 w-64 rounded-lg object-cover shadow'
              />
            </div>
          )}

          <div>
            <label className='mb-1 block font-medium'>Replace Image (optional)</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            />
          </div>

          <div>
            <label className='mb-1 block font-medium'>Title</label>
            <input
              type='text'
              name='title'
              value={form.title || ''}
              onChange={handleChange}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
              disabled
            />
          </div>

          <div>
            <label className='mb-1 block font-medium'>Price (USD)</label>
            <input
              type='number'
              name='price'
              value={form.price || ''}
              onChange={handleChange}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            />
          </div>

          <div>
            <label className='mb-1 block font-medium'>Description</label>
            <textarea
              name='description'
              value={form.description || ''}
              onChange={handleChange}
              className='min-h-[100px] w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            />
          </div>

          <div>
            <label className='mb-1 block font-medium'>Availability</label>
            <select
              name='is_available'
              value={form.is_available ? 'true' : 'false'}
              onChange={(e) => setForm({ ...form, is_available: e.target.value === 'true' })}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none'
            >
              <option value='true'>Available</option>
              <option value='false'>Unavailable</option>
            </select>
          </div>

          <button
            type='submit'
            className='w-full rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white transition hover:bg-cyan-700'
          >
            Update Artwork
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateArtwork;
