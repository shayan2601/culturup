import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AllEquipments = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin");
  };

  const fetchEquipments = async (filter = "All") => {
    console.log("FETCHING EQUIPMENTS...");
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      let params = {};

      // Apply filter dynamically
      if (filter === "Available") params.is_available = "true";
      if (filter === "Unavailable") params.is_available = "false";

      const response = await axios.get(
        "https://shoaibahmad.pythonanywhere.com/api/equipment/",
        {
          headers: { Authorization: `Token ${token}` },
          params,
        }
      );

      // Handle paginated response
      const results = response.data.results || [];
      setEquipments(results);
    } catch (err) {
      console.error("Error fetching equipment:", err);
      setError("❌ Failed to load equipment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipments(activeFilter);
  }, [activeFilter]);

  return (
    <div className="flex">
      <AdminSidebar onLogout={handleLogout} />

      <div className="flex-1 bg-gray-100 p-10 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-cyan-700">All Equipments</h1>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {["All", "Available", "Unavailable"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === filter
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {message && (
          <p
            className={`mb-4 font-semibold ${
              message.includes("❌") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {loading ? (
          <p>Loading equipments...</p>
        ) : equipments.length === 0 ? (
          <p>No equipment found.</p>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-cyan-700 text-white">
                  <th className="py-3 px-4 border">Image</th>
                  <th className="py-3 px-4 border">Name</th>
                  <th className="py-3 px-4 border">Type</th>
                  <th className="py-3 px-4 border">Price</th>
                  <th className="py-3 px-4 border">Available</th>
                  <th className="py-3 px-4 border">Stock</th>
                  <th className="py-3 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {equipments.map((eq) => (
                  <tr key={eq.id} className="text-center border-t hover:bg-gray-50">
                    <td className="py-3 px-4 border">
                      {eq.image ? (
                        <img
                          src={eq.image}
                          alt={eq.name}
                          className="w-16 h-16 object-cover rounded-lg mx-auto"
                        />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </td>
                    <td className="py-3 px-4 border">{eq.name}</td>
                    <td className="py-3 px-4 border capitalize">
                      {eq.equipment_type}
                    </td>
                    <td className="py-3 px-4 border">${eq.price}</td>
                    <td className="py-3 px-4 border">
                      {eq.is_available ? "✅" : "❌"}
                    </td>
                    <td className="py-3 px-4 border">{eq.stock_quantity}</td>
                    <td className="py-3 px-4 border">
                      <button
                        onClick={() => navigate(`/admin/update-equipment/${eq.id}`)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEquipments;
