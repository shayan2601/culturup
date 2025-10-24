import React, { useEffect, useState } from "react";
import axios from "axios";

const FeaturedArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await axios.get(
        "https://shoaibahmad.pythonanywhere.com/api/artist-profiles/"
      );
      // Show maximum 6 artists only
      setArtists(res.data.results.slice(0, 6));
    } catch (err) {
      console.error("Error fetching artists:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="py-12 text-center text-gray-500">Loading artists...</div>
    );

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Featured Artists</h2>
          <a
            href="/artists"
            className="text-cyan-600 hover:text-cyan-500 text-sm font-medium"
          >
            View All Artists
          </a>
        </div>

        {artists.length === 0 ? (
          <p className="text-center text-gray-500">No artists found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={
                      artist.user?.profile_image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        `${artist.user?.first_name || 'Artist'} ${artist.user?.last_name || ''}`
                      )}&background=ddd&color=555&size=400`
                    }
                    alt={artist.user?.username || 'Artist'}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-lg"></div>
                </div>

                <div className="p-5">
                  <div className="flex items-center">
                    <img
                      src={
                        artist.user?.profile_image ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          `${artist.user?.first_name || 'Artist'} ${artist.user?.last_name || ''}`
                        )}&background=ccc&color=555&size=128`
                      }
                      alt={artist.user?.username || 'Artist'}
                      className="w-12 h-12 rounded-full border-2 border-white -mt-10 shadow-md object-cover bg-gray-100"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {artist.user?.first_name} {artist.user?.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {artist.skills || "No skills listed"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Experience</p>
                      <p className="font-semibold">
                        {artist.experience_level || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Hourly Rate</p>
                      <p className="font-semibold">${artist.hourly_rate}</p>
                    </div>
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium py-1 px-4 rounded-full transition-colors duration-300">
                      Follow
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedArtists;
