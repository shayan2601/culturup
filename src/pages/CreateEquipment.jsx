import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '../components/AdminSidebar';

const CreateEquipment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    equipment_type: '',
    price: '',
    stock_quantity: '',
    is_available: false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');

      const form = new FormData();
      form.append('name', formData.name);
      form.append('description', formData.description);
      form.append('equipment_type', formData.equipment_type);
      form.append('price', formData.price);
      form.append('stock_quantity', formData.stock_quantity);
      form.append('is_available', formData.is_available);
      if (image) form.append('image', image);

      await axios.post('https://shoaibahmad.pythonanywhere.com/api/equipment/', form, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('✅ Equipment created successfully!');
      setFormData({
        name: '',
        description: '',
        equipment_type: '',
        price: '',
        stock_quantity: '',
        is_available: false,
      });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to create equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex'>
      <AdminSidebar onLogout={handleLogout} />

      <div className='min-h-screen flex-1 bg-gray-100 p-10'>
        <h1 className='mb-6 text-3xl font-bold text-cyan-700'>Create Equipment</h1>

        <form
          onSubmit={handleSubmit}
          className='max-w-2xl space-y-6 rounded-2xl bg-white p-8 shadow-md'
        >
          {message && (
            <p
              className={`text-center font-semibold ${
                message.includes('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}

          <div>
            <label className='mb-2 block font-medium'>Name *</label>
            <input
              type='text'
              name='name'
              required
              value={formData.name}
              onChange={handleChange}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-600'
            />
          </div>

          <div>
            <label className='mb-2 block font-medium'>Description</label>
            <textarea
              name='description'
              rows='3'
              value={formData.description}
              onChange={handleChange}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-600'
            ></textarea>
          </div>

          <div>
            <label className='mb-2 block font-medium'>Equipment Type *</label>
            <select
              name='equipment_type'
              required
              value={formData.equipment_type}
              onChange={handleChange}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-600'
            >
              <option value=''>Select Type</option>
              <option value='frame'>Frame</option>
              <option value='paint'>Paint</option>
              <option value='brush'>Brush</option>
              <option value='canvas'>Canvas</option>
              <option value='other'>Other</option>
            </select>
          </div>

          <div>
            <label className='mb-2 block font-medium'>Price *</label>
            <input
              type='number'
              step='0.01'
              name='price'
              required
              value={formData.price}
              onChange={handleChange}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-600'
            />
          </div>

          <div>
            <label className='mb-2 block font-medium'>Stock Quantity</label>
            <input
              type='number'
              name='stock_quantity'
              min='0'
              value={formData.stock_quantity}
              onChange={handleChange}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-600'
            />
          </div>

          <div>
            <label className='mb-2 block font-medium'>Upload Image (PNG/JPG)</label>
            <input
              type='file'
              accept='image/png, image/jpeg'
              onChange={handleImageChange}
              className='w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-cyan-600'
            />
            {preview && (
              <img
                src={preview}
                alt='Preview'
                className='mt-3 h-32 w-32 rounded-lg border object-cover'
              />
            )}
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              name='is_available'
              checked={formData.is_available}
              onChange={handleChange}
              className='mr-2'
            />
            <label>Is Available</label>
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-cyan-600 py-2 font-semibold text-white transition-all hover:bg-cyan-700'
          >
            {loading ? 'Submitting...' : 'Create Equipment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEquipment;
