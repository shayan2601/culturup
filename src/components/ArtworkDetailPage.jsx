import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  Eye,
  Share2,
  Bookmark,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";

const ArtworkDetailPage = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchArtwork();
  }, [artworkId]);

  const fetchArtwork = async () => {
    try {
      const res = await axios.get(
        `https://shoaibahmad.pythonanywhere.com/api/artworks/${artworkId}/`
      );
      setArtwork(res.data);
    } catch (err) {
      console.error("Error fetching artwork:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Loading artwork details...</p>
      </div>
    );

  if (!artwork)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600 text-lg">Artwork not found.</p>
      </div>
    );

  const artist = artwork.artist || {};
  const category = artwork.category || {};

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Artworks
          </button>
        </div>

        {/* Layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Artwork Image */}
          <div className="lg:col-span-2 mb-6 lg:mb-0">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={artwork.watermarked_image || artwork.image}
                alt={artwork.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-4 flex justify-between items-center border-t border-gray-100">
                <div className="flex space-x-4">
                  <button
                    className="flex items-center text-gray-500 hover:text-red-500"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={`h-5 w-5 mr-1 ${
                        isLiked ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    <span>
                      {isLiked
                        ? artwork.likes_count + 1
                        : artwork.likes_count}
                    </span>
                  </button>
                  <div className="flex items-center text-gray-500">
                    <Eye className="h-5 w-5 mr-1" />
                    <span>{artwork.views_count}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                  >
                    <Bookmark
                      className={`h-5 w-5 ${
                        isBookmarked
                          ? "fill-cyan-600 text-cyan-600"
                          : "text-gray-500"
                      }`}
                    />
                  </button>
                  <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
                    <Share2 className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {artwork.title}
              </h1>
              <div className="flex items-center mb-4">
                <span className="text-sm text-gray-600">by</span>
                <span className="ml-1 text-sm font-medium text-gray-800">
                  {artist.first_name} {artist.last_name}
                </span>
                {artist.is_verified && (
                  <CheckCircle className="h-4 w-4 text-cyan-600 ml-1" />
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {artwork.description}
              </p>

              {/* Price */}
              <div className="border-t border-b py-4 mb-6">
                <p className="text-gray-500 text-sm mb-1">Price</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(artwork.price)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Category: <span className="font-medium">{category.name}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Type:{" "}
                  <span className="font-medium">{artwork.artwork_type}</span>
                </p>
              </div>

              {/* Artist Info */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-4">
                  About the Artist
                </h3>
                <div className="flex items-center mb-3">
                  <img
                    src={
                      artist.profile_image ||
                      "https://via.placeholder.com/80?text=Artist"
                    }
                    alt={artist.first_name}
                    className="h-12 w-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {artist.first_name} {artist.last_name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {artist.user_type || "Artist"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/artist/${artist.id}`)}
                  className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetailPage;
