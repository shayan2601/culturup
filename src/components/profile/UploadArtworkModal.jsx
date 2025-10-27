import { AnimatePresence, motion } from 'framer-motion';

export default function UploadArtworkModal({ isOpen, onClose, onUpload }) {
  if (!isOpen) return null;

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
          <h3 className='mb-4 text-xl font-bold'>Upload Artwork</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpload();
            }}
            className='space-y-4'
          >
            <input type='file' accept='image/*' required className='w-full' />
            <input type='text' placeholder='Title' className='w-full rounded-md border p-2' />
            <input type='number' placeholder='Price' className='w-full rounded-md border p-2' />
            <div className='flex justify-end space-x-3'>
              <button
                type='button'
                onClick={onClose}
                className='rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='rounded-md bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700'
              >
                Upload
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
