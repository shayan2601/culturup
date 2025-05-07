
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
  // Add more artwork objects as needed
];

const Explore = () => (
  <>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-600 mb-6">Explore Artworks</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
            <img src={art.image} alt={art.title} className="w-full h-40 object-cover rounded" />
            <div className="mt-4">
              <h2 className="text-xl font-semibold">{art.title}</h2>
              <p className="text-gray-600">by {art.artist}</p>
              <p className="text-cyan-600 font-bold">{art.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default Explore;
