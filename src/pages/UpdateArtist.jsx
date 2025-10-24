// src/pages/artists/UpdateArtist.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "@components/AdminSidebar";

const UpdateArtist = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtist();
  }, []);

  const fetchArtist = async () => {
    try {
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
      setForm(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("authToken");
    e.preventDefault();
    try {
      await axios.patch(
        `https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${id}/`,
        form,
        {
          headers: {
            Authorization: `Token ${token}`, // 🔹 Include Bearer token
          },
        }
      );
      alert("✅ Artist updated successfully!");
      navigate("/admin/artists");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update artist.");
    }
  };

  if (loading) return <p className="p-10">Loading...</p>;
  if (!artist) return <p className="p-10">Artist not found.</p>;

  return (
    <div className="flex">
      <AdminSidebar onLogout={() => navigate("/admin")} />
      <div className="flex-1 bg-gray-100 p-10 min-h-screen">
        <h1 className="text-3xl font-bold text-cyan-700 mb-6">
          Update Artist - {artist.user.username}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md space-y-4 max-w-2xl">
          <div>
            <label>Bio</label>
            <textarea
              name="bio"
              value={form.bio || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label>Skills</label>
            <input
              type="text"
              name="skills"
              value={form.skills || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label>Hourly Rate</label>
            <input
              type="number"
              name="hourly_rate"
              value={form.hourly_rate || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
          >
            Update Artist
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateArtist;
