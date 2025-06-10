import Navbar from '@components/Navbar';
import { useState } from 'react';

const ArtEquipment = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const equipmentCategories = [
    { 
      name: 'Brushes', 
      count: 78, 
      image: '/api/placeholder/300/200',
      description: 'High-quality brushes for all mediums'
    },
    { 
      name: 'Paints', 
      count: 124, 
      image: '/api/placeholder/300/200',
      description: 'Oils, acrylics, watercolors and more'
    },
    { 
      name: 'Canvas & Boards', 
      count: 56, 
      image: '/api/placeholder/300/200',
      description: 'Various surfaces for your masterpiece'
    },
    { 
      name: 'Drawing Tools', 
      count: 92, 
      image: '/api/placeholder/300/200',
      description: 'Pencils, charcoal, markers and pens'
    },
    { 
      name: 'Frames', 
      count: 43, 
      image: '/api/placeholder/300/200',
      description: 'Display your art with premium frames'
    },
    { 
      name: 'Easels', 
      count: 25, 
      image: '/api/placeholder/300/200',
      description: 'Studio and field easels for artists'
    },
    { 
      name: 'Digital Tools', 
      count: 67, 
      image: '/api/placeholder/300/200',
      description: 'Tablets, styluses and accessories'
    },
    { 
      name: 'Storage', 
      count: 38, 
      image: '/api/placeholder/300/200',
      description: 'Organize your art supplies effectively'
    },
  ];

  const filters = ['All', 'Traditional', 'Digital', 'New Arrivals', 'Best Sellers'];

  const filteredCategories = activeFilter === 'All' 
    ? equipmentCategories 
    : equipmentCategories.slice(0, 4);

  return (
    <div className="bg-gray-50 py-12">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Art Equipment</h2>
          <a href="#" className="text-cyan-600 hover:text-cyan-500 text-sm font-medium">
            View All Equipment
          </a>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeFilter === filter
                  ? 'bg-cyan-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden shadow-md bg-white hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1639537254680-3d9aa118abbe?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fEFydEVxdWlwbWVudHxlbnwwfHwwfHx8MA%3D%3D" 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.count} items</p>
              </div>
              <div className="p-4 bg-white">
                <p className="text-gray-600 text-sm">{category.description}</p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-cyan-600 font-medium text-sm">Shop Now</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">{category.count} products</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Equipment</h3>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1678812165116-20ad080a9baf?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFpbnRzfGVufDB8fDB8fHww" 
                  alt="Premium Art Set"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-8 md:w-1/2">
                <div className="uppercase tracking-wide text-sm text-cyan-600 font-semibold">New Arrival</div>
                <h2 className="mt-2 text-2xl font-bold text-gray-900">Professional Artist Collection</h2>
                <p className="mt-4 text-gray-600">
                  This comprehensive collection features our finest quality brushes, premium paints, 
                  and essential tools. Perfect for both beginners and professional artists looking to 
                  elevate their creative process.
                </p>
                <div className="mt-6">
                  <a href="#" className="inline-block bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-cyan-700 transition-colors duration-200">
                    Explore Collection
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtEquipment;