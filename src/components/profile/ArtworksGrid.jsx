import { motion } from "framer-motion";
import { Edit3 } from "lucide-react";

export default function ArtworksGrid({ artworks, onEdit }) {
  if (!artworks?.length)
    return (
      <div className="text-center text-gray-500 py-12">
        🎨 No artworks uploaded yet.
      </div>
    );

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8"
    >
      {artworks.map((art) => (
        <motion.div
          key={art.id}
          layout
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition"
        >
          <img
            src={art.image}
            alt={art.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h4 className="text-lg font-semibold">{art.title}</h4>
            <p className="text-sm text-gray-500">${art.price}</p>
            <button
              onClick={() => onEdit(art.id)}
              className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Artwork</span>
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
