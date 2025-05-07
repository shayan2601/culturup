const PopularCategories = () => {
    const categories = [
      { name: 'Abstract', count: 247, image: '/api/placeholder/300/200' },
      { name: 'Photography', count: 183, image: '/api/placeholder/300/200' },
      { name: 'Digital Art', count: 165, image: '/api/placeholder/300/200' },
      { name: 'Painting', count: 321, image: '/api/placeholder/300/200' },
    ];
  
    return (
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Popular Categories</h2>
            <a href="#" className="text-cyan-600 hover:text-cyan-500 text-sm font-medium">
              View All Categories
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden shadow-md">
                <img 
                  src={category.image}
                  alt={category.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.count} artworks</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default PopularCategories