import { motion } from 'framer-motion';
import { Edit3 } from 'lucide-react';

export default function ArtworksGrid({ artworks, onEdit }) {
  if (!artworks?.length)
    return <div className='py-12 text-center text-gray-500'>🎨 No artworks uploaded yet.</div>;

  return (
    <motion.div layout className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
      {artworks.map((art) => (
        <motion.div
          key={art.id}
          layout
          whileHover={{ scale: 1.03 }}
          className='overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-xl'
        >
          <img src={art.image} alt={art.title} className='h-48 w-full object-cover' />
          <div className='p-4'>
            <h4 className='text-lg font-semibold'>{art.title}</h4>
            <p className='text-sm text-gray-500'>${art.price}</p>
            <button
              onClick={() => onEdit(art.id)}
              className='mt-3 flex w-full items-center justify-center space-x-2 rounded-lg bg-cyan-600 py-2 text-white hover:bg-cyan-700'
            >
              <Edit3 className='h-4 w-4' />
              <span>Edit Artwork</span>
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
