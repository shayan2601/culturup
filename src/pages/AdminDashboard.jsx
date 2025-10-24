// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28", "#FF4444"];

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/admin");
        return;
      }

      const response = await axios.get(
        "https://shoaibahmad.pythonanywhere.com/api/dashboard/stats/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );

      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminData");
    navigate("/admin");
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-cyan-700 text-lg font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar onLogout={handleLogout} />

      <div className="flex-1 bg-gray-100 p-10 overflow-y-auto min-h-screen">
        <h1 className="text-3xl font-bold text-cyan-700 mb-8">Admin Dashboard</h1>

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {stats
            ? Object.entries(stats).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all"
                >
                  <h3 className="text-lg font-semibold text-gray-600 capitalize mb-2">
                    {key.replace(/_/g, " ")}
                  </h3>
                  <p className="text-2xl font-bold text-cyan-700">{value}</p>
                </div>
              ))
            : <p>No statistics available</p>}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Monthly User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                  { month: "Jan", users: 120 },
                  { month: "Feb", users: 160 },
                  { month: "Mar", users: 210 },
                  { month: "Apr", users: 260 },
                  { month: "May", users: 310 },
                  { month: "Jun", users: 400 },
                ]}>
                <Line type="monotone" dataKey="users" stroke="#00C49F" strokeWidth={3} />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Artwork Category Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Paintings", value: 35 },
                    { name: "Sculptures", value: 25 },
                    { name: "Photography", value: 20 },
                    { name: "Digital Art", value: 15 },
                    { name: "Other", value: 5 },
                  ]}
                  cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label
                >
                  {COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
