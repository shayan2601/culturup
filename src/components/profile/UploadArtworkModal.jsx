import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_FILENAME_LEN = 100;

  const [isAvailable, setIsAvailable] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://shoaibahmad.pythonanywhere.com/api/categories/', {
          headers: { Authorization: `Token ${token}` },
        });
        setCategories(res.data);
      } catch (err) {
        console.log('⚠️ Failed to load categories:', err.message);
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen, token]);

  useEffect(() => {
    if (mode === 'edit' && artwork) {
      setTitle(artwork.title || '');
      setDescription(artwork.description || '');
      setPrice(artwork.price || '');
      setCategoryId(artwork.category?.id || '');
      setArtworkType(artwork.artwork_type || 'digital');
      setIsAvailable(artwork.is_available ?? true);
      setIsFeatured(artwork.is_featured ?? false);
      // If artwork has an image URL, show it as preview when editing
      setPreviewUrl(artwork.image || artwork.image_url || null);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setArtworkType('digital');
      setImage(null);
      setPreviewUrl(null);
      setIsAvailable(true);
      setIsFeatured(false);
    }
  }, [mode, artwork]);

  // Manage preview URL when a file is chosen
  useEffect(() => {
    if (!image) return;
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleFileChange = (file) => {
    if (!file) return;

    // Basic type check
    const isImageType = file.type && file.type.startsWith('image/');
    const ext = (file.name || '').split('.').pop().toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic', 'heif'];

    if (!isImageType && !allowedExts.includes(ext)) {
      toast.error('Upload a valid image. The file you selected is not recognized as an image.');
      return;
    }

    // Size check
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image must be smaller than 10 MB.');
      return;
    }

    let fileToUse = file;

    // Truncate filename if too long (server requires <= 100 chars)
    if ((file.name || '').length > MAX_FILENAME_LEN) {
      const nameWithoutExt = (file.name || '').replace(/\.[^/.]+$/, '');
      const fileExt = ext ? `.${ext}` : '';
      const truncatedBase = nameWithoutExt.slice(0, MAX_FILENAME_LEN - fileExt.length);
      const newName = `${truncatedBase}${fileExt}`;
      try {
        fileToUse = new File([file], newName, { type: file.type });
        toast.warn('Filename was longer than 100 characters — it has been truncated.');
      } catch (err) {
        // If File constructor not available, fall back but notify user
        console.debug('filename truncate failed', err);
        toast.warn(
          'Filename is too long and could not be truncated by the browser. Please rename your file.'
        );
        return;
      }
    }

    setImage(fileToUse);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', categoryId);
    formData.append('artwork_type', artworkType);
    formData.append('price', price);
    formData.append('is_available', isAvailable);
    formData.append('is_featured', isFeatured);

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
      toast.success(`${mode === 'edit' ? 'Artwork updated' : 'Artwork uploaded'} successfully.`);
      onClose();
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
      const errMsg = err.response?.data?.image[0] || '';
      toast.error(`Failed to ${mode === 'edit' ? 'update' : 'upload'} artwork. ${errMsg}`);
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
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className='cursor-pointer rounded-md border-2 border-dashed border-gray-200 p-4 text-center hover:border-cyan-500'
            >
              <input
                id='artwork-image'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => handleFileChange(e.target.files[0])}
              />

              {previewUrl ? (
                <div className='flex flex-col items-center'>
                  <img
                    src={previewUrl}
                    alt='Artwork preview'
                    className='mx-auto mb-2 h-48 w-full max-w-xs rounded-md object-cover'
                    onError={() => {
                      setImage(null);
                      setPreviewUrl(null);
                      toast.error('The selected image appears to be invalid or corrupted.');
                    }}
                  />
                  <div className='flex gap-2'>
                    <button
                      type='button'
                      onClick={() => {
                        setImage(null);
                        setPreviewUrl(null);
                      }}
                      className='rounded-md bg-red-100 px-3 py-1 text-sm text-red-700'
                    >
                      Remove
                    </button>
                    <label
                      htmlFor='artwork-image'
                      className='cursor-pointer rounded-md bg-cyan-600 px-3 py-1 text-sm text-white hover:bg-cyan-700'
                    >
                      Change
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor='artwork-image'
                  className='flex cursor-pointer flex-col items-center justify-center gap-2'
                >
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400'>
                    📷
                  </div>
                  <span className='text-sm text-gray-500'>
                    Drag & drop an image here, or click to select
                  </span>
                  <span className='mt-1 text-xs text-gray-400'>PNG, JPG — up to 10MB</span>
                </label>
              )}
            </div>

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

            <div className='flex items-center gap-3'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
                <span>Available</span>
              </label>

              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span>Featured</span>
              </label>
            </div>

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
