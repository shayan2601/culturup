// src/pages/artists/ArtistDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "@components/AdminSidebar";

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtist();
    fetchArtworks();
  }, []);

  const fetchArtist = async () => {
    const token = localStorage.getItem("authToken"); // 🔹 Get token from localStorage

    const res = await axios.get(
      `https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 🔹 Include Bearer token
        },
      }
    );
    setArtist(res.data);
  };

  const fetchArtworks = async () => {
    const token = localStorage.getItem("authToken"); // 🔹 Get token from localStorage
    const res = await axios.get(
      `https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${id}/artworks/`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // 🔹 Include Bearer token
        },
      }
    );
    setArtworks(res.data.results || []);
  };

  if (!artist) return <p className="p-10">Loading...</p>;

  return (
    <div className="flex">
      <AdminSidebar onLogout={() => navigate("/admin")} />
      <div className="flex-1 bg-gray-100 p-10 min-h-screen">
        <h1 className="text-3xl font-bold text-cyan-700 mb-6">
          {artist.user.first_name} {artist.user.last_name}
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <p><strong>Bio:</strong> {artist.bio}</p>
          <p><strong>Skills:</strong> {artist.skills}</p>
          <p><strong>Experience:</strong> {artist.experience_level}</p>
          <p><strong>Hourly Rate:</strong> ${artist.hourly_rate}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Artworks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <div key={art.id} className="bg-white p-6 rounded-xl shadow-md">
              <img
                src={art.image}
                alt={art.title}
                className="w-full h-48 object-cover rounded-lg mb-3"
              />
              <h3 className="font-semibold">{art.title}</h3>
              <p>${art.price}</p>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;
