// src/pages/artists/AllArtists.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@components/AdminSidebar";

const AllArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await axios.get(
        "https://shoaibahmad.pythonanywhere.com/api/artist-profiles/"
      );
      setArtists(res.data.results);
    } catch (err) {
      console.error("Error fetching artists:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-10">Loading artists...</p>;

  return (
    <div className="flex">
      <AdminSidebar onLogout={() => navigate("/admin")} />
      <div className="flex-1 bg-gray-100 p-10 min-h-screen">
        <h1 className="text-3xl font-bold text-cyan-700 mb-6">All Artists</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div key={artist.user.id} className="bg-white p-6 rounded-2xl shadow-md">
              <img
                src={artist.user.profile_image}
                alt={artist.user.username}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-semibold">
                {artist.user.first_name} {artist.user.last_name}
              </h2>
              <p className="text-gray-600">{artist.skills}</p>
              <p className="text-sm mt-2">
                <strong>Experience:</strong> {artist.experience_level}
              </p>
              <p>
                <strong>Hourly:</strong> ${artist.hourly_rate}
              </p>
              <div className="flex gap-2 mt-4">
                
                <button
                  onClick={() => navigate(`/admin/artist/${artist.user.id}`)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllArtists;
