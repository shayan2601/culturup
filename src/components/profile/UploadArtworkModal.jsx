import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function UploadArtworkModal({
  isOpen,
  onClose,
  onUpload,
  token,
  mode = 'create',
  artwork = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [artworkType, setArtworkType] = useState('digital');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // ✅ Fetch categories on open
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          'https://shoaibahmad.pythonanywhere.com/api/categories/',
          {
            headers: { Authorization: `Token ${token}` },
          }
        );
        setCategories(res.data);
      } catch (err) {
        console.log('⚠️ Failed to load categories:', err.message);
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen, token]);

  // ✅ Fill fields when editing
  useEffect(() => {
    if (mode === 'edit' && artwork) {
      setTitle(artwork.title || '');
      setDescription(artwork.description || '');
      setPrice(artwork.price || '');
      setCategoryId(artwork.category?.id || '');
      setArtworkType(artwork.artwork_type || 'digital');
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setArtworkType('digital');
      setImage(null);
    }
  }, [mode, artwork]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    formData.append('artwork_type', artworkType);
    formData.append('price', price);

    if (image) formData.append('image', image);

    const url =
      mode === 'edit'
        ? `https://shoaibahmad.pythonanywhere.com/api/artworks/${artwork.id}/`
        : `https://shoaibahmad.pythonanywhere.com/api/artworks/`;

    const method = mode === 'edit' ? 'patch' : 'post';

    try {
      setLoading(true);
      const res = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(`${mode === 'edit' ? 'Updated' : 'Created'} artwork:`, res.data);
      onUpload(res.data);
      onClose();
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      alert(`Failed to ${mode === 'edit' ? 'update' : 'upload'} artwork.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'
        >
          <h3 className='mb-4 text-xl font-bold'>
            {mode === 'edit' ? 'Edit Artwork' : 'Upload Artwork'}
          </h3>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              type='file'
              accept='image/*'
              onChange={(e) => setImage(e.target.files[0])}
              className='w-full'
            />

            <input
              type='text'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='w-full rounded-md border p-2'
              required
            />

            <textarea
              placeholder='Description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full rounded-md border p-2'
              required
            />

            <input
              type='number'
              step='0.01'
              placeholder='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='w-full rounded-md border p-2'
              required
            />

            {/* ✅ Category dropdown */}
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className='w-full rounded-md border p-2'
              required
            >
              <option value=''>Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={artworkType}
              onChange={(e) => setArtworkType(e.target.value)}
              className='w-full rounded-md border p-2'
            >
              <option value='digital'>Digital</option>
              <option value='physical'>Physical</option>
              <option value='mixed'>Mixed</option>
            </select>

            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={onClose}
                className='rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300'
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700 disabled:opacity-60'
                disabled={loading}
              >
                {loading
                  ? mode === 'edit'
                    ? 'Updating...'
                    : 'Uploading...'
                  : mode === 'edit'
                  ? 'Update'
                  : 'Upload'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
