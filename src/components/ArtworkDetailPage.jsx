import { useState } from 'react';
import { 
  Heart, 
  Eye, 
  Share2, 
  Bookmark, 
  User, 
  Clock, 
  CheckCircle, 
  ChevronLeft,
  AlertCircle
} from 'lucide-react';

const ArtworkDetailPage = () => {
  const [currentBid, setCurrentBid] = useState(1350);
  const [userBid, setUserBid] = useState('');
  const [bidStatus, setBidStatus] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showBidHistory, setShowBidHistory] = useState(false);

  // Artwork data
  const artwork = {
    id: 'art-12345',
    title: 'Sunset Bliss',
    description: 'A captivating portrayal of a sunset over calm waters, representing the transition between day and night. The warm orange and red hues blend seamlessly with cool purples and blues, creating a sense of serenity and reflection.',
    image: '/api/placeholder/800/600',
    artist: {
      name: 'Aisha Khan',
      avatar: '/api/placeholder/48/48',
      verified: true,
      bio: 'Contemporary artist known for vibrant landscapes and emotional color palettes',
      artworks: 47
    },
    details: {
      medium: 'Acrylic on Canvas',
      dimensions: '30" × 40"',
      created: '2024',
      style: 'Contemporary',
      certificate: 'Includes Certificate of Authenticity'
    },
    price: {
      current: 1350,
      start: 950,
      currency: 'USD'
    },
    auction: {
      endTime: '2025-05-28T23:59:59',
      remainingDays: 17,
      remainingHours: 8,
      minBidIncrement: 50
    },
    stats: {
      likes: 328,
      views: 1624,
      bidCount: 7
    },
    category: 'Painting',
    tags: ['sunset', 'landscape', 'contemporary', 'vibrant']
  };

  // Bidding history
  const bidHistory = [
    { user: 'art_collector92', amount: 1350, time: '2 hours ago' },
    { user: 'gallery_five', amount: 1250, time: '6 hours ago' },
    { user: 'modern_muse', amount: 1150, time: '1 day ago' },
    { user: 'creative_soul', amount: 1050, time: '2 days ago' },
    { user: 'art_enthusiast', amount: 950, time: '3 days ago' }
  ];

  // Similar artworks
  const similarArtworks = [
    { title: 'Golden Horizon', price: '$1,100', image: '/api/placeholder/300/200', artist: 'Jamal Hassan' },
    { title: 'Ocean Dreams', price: '$1,400', image: '/api/placeholder/300/200', artist: 'Sophia Chen' },
    { title: 'Evening Glow', price: '$990', image: '/api/placeholder/300/200', artist: 'Michael Wong' }
  ];

  // Format price to currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Calculate time remaining in auction
  const getTimeRemaining = () => {
    return `${artwork.auction.remainingDays}d ${artwork.auction.remainingHours}h remaining`;
  };

  // Handle bid submission
  const handleBidSubmit = () => {
    const bidAmount = Number(userBid);
    
    if (isNaN(bidAmount) || bidAmount <= 0) {
      setBidStatus('error-format');
      return;
    }
    
    if (bidAmount <= currentBid) {
      setBidStatus('error-low');
      return;
    }
    
    if (bidAmount < currentBid + artwork.auction.minBidIncrement) {
      setBidStatus('error-increment');
      return;
    }
    
    // Success case
    setCurrentBid(bidAmount);
    setBidStatus('success');
    setUserBid('');
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <a href="#" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Back to Artworks</span>
          </a>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Artwork image */}
          <div className="lg:col-span-2 mb-8 lg:mb-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1535673774336-ef95d2851cf3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhaW50c3xlbnwwfHwwfHx8MA%3D%3D" 
                alt={artwork.title} 
                className="w-full object-cover h-96"
              />
              <div className="p-4 flex justify-between items-center border-t border-gray-100">
                <div className="flex space-x-4">
                  <button 
                    className="flex items-center text-gray-500 hover:text-red-500"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isLiked ? artwork.stats.likes + 1 : artwork.stats.likes}</span>
                  </button>
                  <div className="flex items-center text-gray-500">
                    <Eye className="h-5 w-5 mr-1" />
                    <span>{artwork.stats.views}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-cyan-600 text-cyan-600' : 'text-gray-500'}`} />
                  </button>
                  <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
                    <Share2 className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Artwork info and bidding */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{artwork.title}</h1>
                  <div className="flex items-center mt-1">
                    <span className="text-sm text-gray-600">by</span>
                    <a href="#" className="ml-1 text-sm font-medium text-gray-800 hover:text-cyan-600">{artwork.artist.name}</a>
                    {artwork.artist.verified && (
                      <CheckCircle className="h-4 w-4 text-cyan-600 ml-1" />
                    )}
                  </div>
                </div>
                <div className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-sm font-medium">
                  {artwork.category}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 text-sm">{artwork.description}</p>
              </div>

              {/* Current bid and auction info */}
              <div className="border-t border-b border-gray-100 py-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-gray-500 text-sm">Current bid</div>
                  <div className="flex items-center text-sm text-cyan-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{getTimeRemaining()}</span>
                  </div>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(currentBid)}</span>
                  <span className="ml-2 text-sm text-gray-500">({bidHistory.length} bids)</span>
                </div>

                {/* Bid input */}
                <div className="mb-2">
                  <div className="flex">
                    <div className="relative flex-grow">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-gray-500">$</span>
                      </div>
                      <input
                        type="text"
                        value={userBid}
                        onChange={(e) => {
                          setUserBid(e.target.value);
                          if (bidStatus) setBidStatus('');
                        }}
                        className="pl-8 pr-4 py-3 w-full rounded-l-lg border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                        placeholder={`Min. bid ${formatPrice(currentBid + artwork.auction.minBidIncrement)}`}
                      />
                    </div>
                    <button
                      onClick={handleBidSubmit}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-3 rounded-r-lg transition-colors duration-200"
                    >
                      Place Bid
                    </button>
                  </div>
                  
                  {/* Bid status messages */}
                  {bidStatus === 'error-format' && (
                    <p className="mt-2 text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Please enter a valid amount
                    </p>
                  )}
                  {bidStatus === 'error-low' && (
                    <p className="mt-2 text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Bid must be higher than current bid
                    </p>
                  )}
                  {bidStatus === 'error-increment' && (
                    <p className="mt-2 text-red-600 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Minimum increment is ${artwork.auction.minBidIncrement}
                    </p>
                  )}
                  {bidStatus === 'success' && (
                    <p className="mt-2 text-green-600 text-sm flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Your bid has been placed successfully!
                    </p>
                  )}
                </div>

                <p className="text-xs text-gray-500">
                  Minimum bid increment: ${artwork.auction.minBidIncrement}
                </p>
              </div>

              {/* Bid history toggle */}
              <button 
                onClick={() => setShowBidHistory(!showBidHistory)}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm font-medium flex justify-center items-center mb-6"
              >
                {showBidHistory ? 'Hide' : 'View'} Bid History
              </button>

              {/* Bid history */}
              {showBidHistory && (
                <div className="border rounded-lg overflow-hidden mb-6">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidder</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bidHistory.map((bid, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{bid.user}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{formatPrice(bid.amount)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{bid.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Artwork details */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Artwork Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Medium</div>
                  <div className="text-gray-900">{artwork.details.medium}</div>
                  <div className="text-gray-500">Size</div>
                  <div className="text-gray-900">{artwork.details.dimensions}</div>
                  <div className="text-gray-500">Created</div>
                  <div className="text-gray-900">{artwork.details.created}</div>
                  <div className="text-gray-500">Style</div>
                  <div className="text-gray-900">{artwork.details.style}</div>
                </div>
                <p className="text-sm text-gray-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  {artwork.details.certificate}
                </p>
              </div>
            </div>

            {/* Artist info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">About the Artist</h3>
              <div className="flex items-center mb-3">
                <div className="rounded-full bg-gray-200 overflow-hidden h-12 w-12 mr-3">
                  <img src="https://images.unsplash.com/photo-1543237935-aa9ffc1c0bc0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBhaW50c3xlbnwwfHwwfHx8MA%3D%3D" alt={artwork.artist.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{artwork.artist.name}</h4>
                    {artwork.artist.verified && (
                      <CheckCircle className="h-4 w-4 text-cyan-600 ml-1" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{artwork.artist.artworks} artworks</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{artwork.artist.bio}</p>
              <a href="#" className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">View Profile</a>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Similar artworks */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {similarArtworks.map((item, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200">
                <div className="relative">
                  <img src="https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBhaW50c3xlbnwwfHwwfHx8MA%3D%3D" alt={item.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-md">
                    <Bookmark className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">by {item.artist}</p>
                  <p className="mt-2 text-cyan-600 font-bold">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailPage;