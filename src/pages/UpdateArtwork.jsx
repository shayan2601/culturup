import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar";

const UpdateArtwork = () => {
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtwork();
  }, []);

  const fetchArtwork = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `https://shoaibahmad.pythonanywhere.com/api/artworks/${id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setForm(res.data);
      setImagePreview(res.data.image); // show existing image
    } catch (err) {
      console.error("Error fetching artwork:", err);
      alert("Failed to fetch artwork details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in to update artwork.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("description", form.description || "");
    formData.append("is_available", form.is_available);
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      await axios.patch(
        `https://shoaibahmad.pythonanywhere.com/api/artworks/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "multipart/form-data", // ✅ Important
          },
        }
      );

      alert("✅ Artwork updated successfully!");
      navigate(-1);
    } catch (err) {
      console.error("Error updating artwork:", err.response?.data || err.message);
      alert("❌ Failed to update artwork. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-cyan-700 font-semibold">
        Loading artwork details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-cyan-700 mb-6">
          Update Artwork
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Artwork Image Preview */}
          {imagePreview && (
            <div className="flex justify-center mb-4">
              <img
                src={imagePreview}
                alt={form.title}
                className="w-64 h-48 object-cover rounded-lg shadow"
              />
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Replace Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              disabled
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Price (USD)</label>
            <input
              type="number"
              name="price"
              value={form.price || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 min-h-[100px]"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Availability</label>
            <select
              name="is_available"
              value={form.is_available ? "true" : "false"}
              onChange={(e) =>
                setForm({ ...form, is_available: e.target.value === "true" })
              }
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Update Artwork
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateArtwork;
