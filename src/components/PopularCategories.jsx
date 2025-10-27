const PopularCategories = () => {
  const categories = [
    { name: 'Abstract', count: 247, image: '/api/placeholder/300/200' },
    { name: 'Photography', count: 183, image: '/api/placeholder/300/200' },
    { name: 'Digital Art', count: 165, image: '/api/placeholder/300/200' },
    { name: 'Painting', count: 321, image: '/api/placeholder/300/200' },
  ];

  return (
    <div className='bg-gray-50 py-12'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h2 className='text-2xl font-bold text-gray-900'>Popular Categories</h2>
          <a href='#' className='text-sm font-medium text-cyan-600 hover:text-cyan-500'>
            View All Categories
          </a>
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {categories.map((category, index) => (
            <div key={index} className='group relative overflow-hidden rounded-lg shadow-md'>
              <img
                src='https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXJ0fGVufDB8fDB8fHww'
                alt={category.name}
                className='h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105'
              />
              <div className='absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-4'>
                <h3 className='text-lg font-bold text-white'>{category.name}</h3>
                <p className='text-sm text-white/80'>{category.count} artworks</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCategories;
