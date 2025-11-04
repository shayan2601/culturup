import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Clock, DollarSign } from 'lucide-react';
import Navbar from '@components/Navbar';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidPlaced, setBidPlaced] = useState(false);
  const [bidding, setBidding] = useState(false);

  const [bidAmount, setBidAmount] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const [isOwner, setIsOwner] = useState(false);
  const token = localStorage.getItem('authToken');

  // 🔹 Redirect if not logged in
  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // 🔹 Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(
          `https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        setJob(res.data);
      } catch (err) {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  // 🔹 Determine ownership after job is loaded
  useEffect(() => {
    if (!job) return;

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData?.id && job?.buyer?.id) {
        setIsOwner(userData.id === job.buyer.id);
      }
    } catch (err) {
      console.error('Failed to check ownership:', err);
    }
  }, [job]);

  // 🔹 Fetch bids
  useEffect(() => {
    if (!job) return;

    const fetchBids = async () => {
      try {
        const res = await axios.get(
          `https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/bids/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        setBids(res.data?.results || []);
      } catch (err) {
        console.error('Failed to load bids.');
      }
    };

    fetchBids();
  }, [id, token, job, bidPlaced]);

  // 🔹 Submit new bid
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!bidAmount || !deliveryTime || !coverLetter.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setBidding(true);

      const res = await axios.post(
        `https://shoaibahmad.pythonanywhere.com/api/bids/`,
        {
          job_id: id,
          bid_amount: parseFloat(bidAmount),
          delivery_time: deliveryTime,
          cover_letter: coverLetter,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle “already bid” case
      if (Array.isArray(res.data) && res.data[0]?.includes('already bid')) {
        alert('You have already bid on this job.');
        setBidPlaced(true);
        return;
      }

      alert('✅ Bid placed successfully!');
      setBidPlaced(true);
      setBidAmount('');
      setDeliveryTime('');
      setCoverLetter('');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data)
          ? err.response.data[0]
          : 'Failed to place bid.');
      alert(msg);
    } finally {
      setBidding(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to accept this bid?")) return;

    try {
      const res = await axios.post(
        `https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/hire/`,
        { bid_id: bidId },
        {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(res.data?.message || "Artist hired successfully!");
      // Refresh bids & job after accepting
      setBids((prev) =>
        prev.map((b) =>
          b.id === bidId ? { ...b, status: "accepted" } : { ...b, status: "rejected" }
        )
      );
    } catch (err) {
      console.error("Failed to accept bid:", err);
      alert(err.response?.data?.message || "Failed to accept bid.");
    }
  };


  // 🔹 Loading / Error states
  if (loading) return <div className="p-8 text-center">Loading job details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!job) return null;

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-5xl p-6 mt-8 bg-white rounded-xl shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1 text-cyan-600 hover:underline"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* ---------- Job Info ---------- */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{job.description}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div><span className="font-semibold">Category:</span> {job.category?.name}</div>
          <div><span className="font-semibold">Budget:</span> ${job.budget_min} - ${job.budget_max}</div>
          <div><span className="font-semibold">Experience:</span> {job.experience_level}</div>
          <div><span className="font-semibold">Duration:</span> {job.duration_days} days</div>
          <div><span className="font-semibold">Deadline:</span> {new Date(job.deadline).toLocaleDateString()}</div>
          <div><span className="font-semibold">Status:</span> {job.status}</div>
          <div className="sm:col-span-2">
            <span className="font-semibold">Skills:</span> {job.required_skills || 'N/A'}
          </div>
        </div>

        {/* ---------- If Owner: Show Bids ---------- */}
        {isOwner ? (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              💰 Bids on this Job ({bids.length})
            </h2>

            {bids.length > 0 ? (
              <div className="space-y-4">
                {bids.map((bid) => (
                  <div
                    key={bid.id}
                    className="border rounded-lg p-4 bg-gray-50 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800 flex items-center gap-1">
                        <User size={16} /> {bid.artist_name}
                      </span>
                      <span className="text-cyan-700 font-semibold flex items-center gap-1">
                         Rs.{bid.bid_amount}
                      </span>
                    </div>

                    {bid.cover_letter && (
                      <p className="text-gray-600 italic mb-2">{bid.cover_letter}</p>
                    )}

                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={14} /> Delivery: {bid.delivery_time} days
                      </div>
                      <span
                        className={`capitalize font-medium ${
                          bid.status === 'accepted'
                            ? 'text-green-600'
                            : bid.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {bid?.status === "pending" && (
                          <button
                            onClick={() => handleAcceptBid(bid.id)}
                            className="mt-3 w-full rounded-md bg-cyan-600 py-2 text-white font-semibold hover:bg-cyan-700 transition"
                          >
                            Accept Bid
                          </button>
                        )}
                      </span>
                      
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No bids have been placed yet.</p>
            )}
          </div>
        ) : (
          // ---------- If Artist: Place Bid ----------
          !bidPlaced ? (
            <form onSubmit={handleBidSubmit} className="mt-10 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">🎯 Place Your Bid</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-cyan-100 focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 days"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-cyan-100 focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                <textarea
                  rows="4"
                  placeholder="Explain why you’re perfect for this job..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-cyan-100 focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={bidding}
                className="w-full mt-4 rounded-lg bg-cyan-600 py-2.5 text-white font-semibold hover:bg-cyan-700 transition disabled:opacity-60"
              >
                {bidding ? 'Submitting...' : 'Place Bid'}
              </button>
            </form>
          ) : (
            <div className="mt-8 rounded-md bg-green-100 p-4 text-green-700 text-center font-medium">
              ✅ You have already placed a bid for this job!
            </div>
          )
        )}
      </div>
    </>
  );
};

export default JobDetails;
