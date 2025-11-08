import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AdminSidebar from '../components/AdminSidebar';

const UpdateEquipment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    equipment_type: '',
    price: '',
    stock_quantity: '',
    is_available: false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetching, setFetching] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin');
  };

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await axios.get(
          `https://shoaibahmad.pythonanywhere.com/api/equipment/${id}/`
        );
        const data = response.data;
        setFormData({
          name: data.name || '',
          description: data.description || '',
          equipment_type: data.equipment_type || '',
          price: data.price || '',
          stock_quantity: data.stock_quantity || '',
          is_available: data.is_available || false,
        });
        setPreview(data.image || '');
      } catch (error) {
        console.error('Error fetching equipment:', error);
        setMessage('❌ Failed to load equipment details.');
      } finally {
        setFetching(false);
      }
    };
    fetchEquipment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      const formDataToSend = new FormData();

      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      if (image) {
        formDataToSend.append('image', image);
      }

      await axios.put(
        `https://shoaibahmad.pythonanywhere.com/api/equipment/${id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('✅ Equipment updated successfully!');
      setTimeout(() => navigate('/admin/equipments'), 1500);
    } catch (err) {
      console.error('Error updating equipment:', err);
      setMessage('❌ Failed to update equipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className='flex'>
        <AdminSidebar onLogout={handleLogout} />
        <div className='min-h-screen flex-1 bg-gray-100 p-10'>
          <p>Loading equipment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <AdminSidebar onLogout={handleLogout} />

      <div className='min-h-screen flex-1 bg-gray-100 p-10'>
        <h1 className='mb-6 text-3xl font-bold text-cyan-700'>Update Equipment</h1>

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

          <div>
            <label className='mb-2 block font-medium'>Equipment Image</label>
            <input type='file' accept='image/*' onChange={handleImageChange} className='w-full' />
            {preview && (
              <img
                src={preview}
                alt='Preview'
                className='mt-3 h-40 w-40 rounded-lg border object-cover'
              />
            )}
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full rounded-lg bg-cyan-600 py-2 font-semibold text-white transition-all hover:bg-cyan-700'
          >
            {loading ? 'Updating...' : 'Update Equipment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateEquipment;
