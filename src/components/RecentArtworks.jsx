import { Filter, Grid, List, Bookmark, Heart, Eye, Share2 } from 'lucide-react';
import React, { useState } from 'react';
// import { useRouter } from 'react-router-dom'; // Import the router for navigation
import { useNavigate } from 'react-router-dom';
const RecentArtworks = () => {
    const [viewMode, setViewMode] = useState('grid');
    // const router = useRouter();
    const navigate = useNavigate();
    const navigateToArtworkDetail = (artworkId) => {
        console.log("artwork::::", artworkId)
        navigate(`/artwork/${artworkId}`);

    };
  
    const artworks = [
      { 
        id: 'art-12345', 
        title: 'Sunset Bliss', 
        image: '/api/placeholder/400/300', 
        artist: 'Aisha Khan',
        price: '$1,250',
        likes: 328,
        views: 1624,
        category: 'Painting'
      },
      { 
        id: 'art-23456',
        title: 'Mountain Majesty', 
        image: '/api/placeholder/400/300', 
        artist: 'Rahim Ali',
        price: '$950',
        likes: 245,
        views: 1128,
        category: 'Photography' 
      },
      { 
        id: 'art-34567',
        title: 'Urban Dreams', 
        image: '/api/placeholder/400/300', 
        artist: 'Sophia Chen',
        price: '$1,800',
        likes: 412,
        views: 2048,
        category: 'Digital Art'
      },
      { 
        id: 'art-45678',
        title: 'Serene Waters', 
        image: '/api/placeholder/400/300', 
        artist: 'Michael Wong',
        price: '$750',
        likes: 198,
        views: 876,
        category: 'Watercolor'
      },
      { 
        id: 'art-56789',
        title: 'Abstract Mind', 
        image: '/api/placeholder/400/300', 
        artist: 'Layla Diaz',
        price: '$2,200',
        likes: 367,
        views: 1540,
        category: 'Abstract'
      },
      { 
        id: 'art-67890',
        title: 'Golden Horizon', 
        image: '/api/placeholder/400/300', 
        artist: 'Jamal Hassan',
        price: '$1,100',
        likes: 289,
        views: 1372,
        category: 'Landscape'
      },
    ];
  
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recent Artworks</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
              >
                <Grid className="h-5 w-5 text-gray-500" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
              >
                <List className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <button className="flex items-center text-gray-600 hover:text-gray-800">
              <Filter className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <a href="#" className="text-cyan-600 hover:text-cyan-500 text-sm font-medium">
              View All
            </a>
          </div>
        </div>
  
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 cursor-pointer"
                onClick={() => navigateToArtworkDetail(artwork.id)}
              >
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXJ0fGVufDB8fDB8fHww" 
                    alt={artwork.title} 
                    className="w-full h-56 object-cover" 
                  />
                  <div 
                    className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Bookmark className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{artwork.title}</h3>
                      <p className="text-sm text-gray-600">by {artwork.artist}</p>
                    </div>
                    <div className="bg-cyan-50 text-cyan-700 px-2 py-1 rounded text-xs font-medium">
                      {artwork.category}
                    </div>
                  </div>
                  <p className="mt-2 text-cyan-600 font-bold">{artwork.price}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex space-x-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{artwork.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{artwork.views}</span>
                      </div>
                    </div>
                    <button 
                      className="text-cyan-600 hover:text-cyan-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {artworks.map((artwork, index) => (
              <div 
                key={index} 
                className="flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200 cursor-pointer"
                onClick={() => navigateToArtworkDetail(artwork.id)}
              >
                <img 
                  src="/api/placeholder/400/300" 
                  alt={artwork.title} 
                  className="w-full sm:w-48 h-48 object-cover" 
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{artwork.title}</h3>
                        <p className="text-sm text-gray-600">by {artwork.artist}</p>
                      </div>
                      <div className="bg-cyan-50 text-cyan-700 px-2 py-1 rounded text-xs font-medium">
                        {artwork.category}
                      </div>
                    </div>
                    <p className="mt-2 text-cyan-600 font-bold">{artwork.price}</p>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex space-x-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{artwork.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{artwork.views}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="bg-white border border-gray-300 rounded-full p-1.5 hover:bg-gray-50"
                        onClick={(e) => e.stopPropagation()} 
                      >
                        <Bookmark className="h-4 w-4 text-gray-600" />
                      </button>
                      <button 
                        className="bg-white border border-gray-300 rounded-full p-1.5 hover:bg-gray-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
export default RecentArtworks;