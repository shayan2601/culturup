const artworks = [
  {
    id: 1,
    title: 'Sunset Bliss',
    artist: 'Aisha Khan',
    price: '$200',
    image: 'https://source.unsplash.com/random/300x200?art,painting,sunset',
  },
  {
    id: 2,
    title: 'Abstract Thoughts',
    artist: 'Rahim Ali',
    price: '$350',
    image: 'https://source.unsplash.com/random/300x200?art,abstract',
  },
];

const Explore = () => (
  <>
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='mb-6 text-3xl font-bold text-cyan-600'>Explore Artworks</h1>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
        {artworks.map((art) => (
          <div key={art.id} className='rounded bg-white p-4 shadow transition hover:shadow-lg'>
            <img src={art.image} alt={art.title} className='h-40 w-full rounded object-cover' />
            <div className='mt-4'>
              <h2 className='text-xl font-semibold'>{art.title}</h2>
              <p className='text-gray-600'>by {art.artist}</p>
              <p className='font-bold text-cyan-600'>{art.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default Explore;
