import React from 'react'
const FeaturedArtists = () => {
    const artists = [
      { name: 'Aisha Khan', image: '/api/placeholder/200/200', genre: 'Abstract Expressionism', followers: '12.8k', works: 48 },
      { name: 'Rahim Ali', image: '/api/placeholder/200/200', genre: 'Contemporary', followers: '9.2k', works: 36 },
      { name: 'Sophia Chen', image: '/api/placeholder/200/200', genre: 'Digital Art', followers: '15.4k', works: 67 },
      { name: 'Michael Wong', image: '/api/placeholder/200/200', genre: 'Photography', followers: '8.7k', works: 42 },
      { name: 'Layla Diaz', image: '/api/placeholder/200/200', genre: 'Sculpture', followers: '11.3k', works: 29 },
      { name: 'Jamal Hassan', image: '/api/placeholder/200/200', genre: 'Minimalism', followers: '7.5k', works: 31 },
    ];
  
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Artists</h2>
            <a href="#" className="text-cyan-600 hover:text-cyan-500 text-sm font-medium">
              View All Artists
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="relative">
                  <img src="https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww" alt={artist.name} className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg"></div>
                </div>
                <div className="p-5">
                  <div className="flex items-center">
                    <img src="https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww" alt={artist.name} className="w-12 h-12 rounded-full border-2 border-white -mt-10 shadow-md" />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{artist.name}</h3>
                      <p className="text-sm text-gray-500">{artist.genre}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Followers</p>
                      <p className="font-semibold">{artist.followers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Works</p>
                      <p className="font-semibold">{artist.works}</p>
                    </div>
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium py-1 px-4 rounded-full transition-colors duration-300">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
export default FeaturedArtists