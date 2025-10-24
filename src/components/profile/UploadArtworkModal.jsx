import { motion, AnimatePresence } from "framer-motion";

export default function UploadArtworkModal({ isOpen, onClose, onUpload }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h3 className="text-xl font-bold mb-4">Upload Artwork</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onUpload();
            }}
            className="space-y-4"
          >
            <input type="file" accept="image/*" required className="w-full" />
            <input
              type="text"
              placeholder="Title"
              className="w-full border p-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Price"
              className="w-full border p-2 rounded-md"
            />
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
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
