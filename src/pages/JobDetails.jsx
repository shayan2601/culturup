import Navbar from '@components/Navbar';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const stripePromise = loadStripe(
  'pk_test_51SMAaaKqTb4RI19EFCKN7pNOkdc73E1DenvwJY6jFkjtepystR8vDiVzCAZAMLlJZ94hHeFcxuGfd8jzGklyMJP000jwL7RcBN'
);

const StripePaymentForm = ({ paymentId, transactionId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const token = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const processRes = await axios.post(
        `https://shoaibahmad.pythonanywhere.com/api/payments/${paymentId}/process/`,
        { transaction_id: transactionId },
        { headers: { Authorization: `Token ${token}` } }
      );

      const clientSecret = processRes.data.client_secret;
      const cardElement = elements.getElement(CardElement);

      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: userData?.email || 'User' },
        },
      });

      if (stripeError) throw stripeError;

      await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/payments/confirm_stripe_payment/',
        { payment_intent_id: paymentIntent.id },
        { headers: { Authorization: `Token ${token}` } }
      );

      alert('✅ Payment successful! Artist has been hired.');
      onSuccess?.();
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className='mt-6 space-y-4 border-t pt-6'>
      <h3 className='text-lg font-semibold text-gray-800'>💳 Complete Payment</h3>

      <div className='mb-4 rounded-lg border bg-gray-50 p-4'>
        <CardElement className='rounded-md border bg-white p-2' />
      </div>

      {error && <p className='text-sm text-red-600'>{error}</p>}

      <button
        type='submit'
        disabled={!stripe || loading}
        className='w-full rounded-lg bg-cyan-600 py-2.5 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60'
      >
        {loading ? 'Processing Payment...' : 'Pay Now'}
      </button>
    </form>
  );
};

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

  const [pendingPayment, setPendingPayment] = useState(null);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setJob(res.data);
      } catch (err) {
        console.log('err: ', err);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

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

  useEffect(() => {
    if (!job) return;

    const fetchBids = async () => {
      try {
        const res = await axios.get(`https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/bids/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setBids(res.data?.results || []);
      } catch (err) {
        console.error('Failed to load bids.');
      }
    };

    fetchBids();
  }, [id, token, job, bidPlaced]);

  const handleOrderComplete = async () => {
    if (!window.confirm('Are you sure you want to mark this order as complete?')) return;

    try {
      const res = await axios.post(
        `https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/complete_job/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert(res.data?.message || '✅ Order marked as complete!');
      setJob((prev) => ({ ...prev, status: 'completed' }));
    } catch (err) {
      console.error('Failed to complete order:', err);
      alert(err.response?.data?.message || '❌ Failed to mark order as complete.');
    }
  };

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
        (Array.isArray(err.response?.data) ? err.response.data[0] : 'Failed to place bid.');
      alert(msg);
    } finally {
      setBidding(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    if (!window.confirm('Are you sure you want to accept this bid?')) return;

    try {
      const res = await axios.post(
        `https://shoaibahmad.pythonanywhere.com/api/jobs/${id}/hire/`,
        { bid_id: bidId },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      console.error('Failed to accept bid:', err);
      // alert(err.response?.data?.message || 'Failed to accept bid.');

      if (err?.response?.data?.error == 'Payment not completed for this job. Please pay first.') {
        alert('Payment not completed for this job. Please pay first.');
      }

      const acceptedBid = bids.find((b) => b.id === bidId);
      const amountToCharge =
        acceptedBid && (acceptedBid.bid_amount || acceptedBid.bid_amount === 0)
          ? parseFloat(acceptedBid.bid_amount)
          : parseFloat(job?.budget_max || 0);

      const paymentRes = await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/payments/hire_artist_payment/',
        {
          amount: amountToCharge,
          payment_method: 'stripe',
          job_id: id,
          bid_id: acceptedBid?.id,
        },
        { headers: { Authorization: `Token ${token}` } }
      );
      console.log('paymentRes: ', paymentRes);
      const newPaymentId = paymentRes.data.payment_id;
      const newTransactionId = paymentRes.data.transaction_id;

      setPendingPayment({ paymentId: newPaymentId, transactionId: newTransactionId });

      setBids((prev) =>
        prev.map((b) =>
          b.id === bidId ? { ...b, status: 'accepted' } : { ...b, status: 'rejected' }
        )
      );
      setJob((prev) => ({ ...prev, status: prev?.status }));
    }
  };

  if (loading) return <div className='p-8 text-center'>Loading job details...</div>;
  if (error) return <div className='p-8 text-center text-red-500'>{error}</div>;
  if (!job) return null;

  return (
    <>
      <Navbar />
      <div className='mx-auto mt-8 max-w-5xl rounded-xl bg-white p-6 shadow-lg'>
        <button
          onClick={() => navigate(-1)}
          className='mb-4 flex items-center gap-1 text-cyan-600 hover:underline'
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className='mb-2 text-3xl font-bold text-gray-900'>{job.title}</h1>
        <p className='mb-6 leading-relaxed text-gray-600'>{job.description}</p>

        <div className='mb-6 grid gap-4 sm:grid-cols-2'>
          <div>
            <span className='font-semibold'>Category:</span> {job.category?.name}
          </div>
          <div>
            <span className='font-semibold'>Budget:</span> ${job.budget_min} - ${job.budget_max}
          </div>
          <div>
            <span className='font-semibold'>Experience:</span> {job.experience_level}
          </div>
          <div>
            <span className='font-semibold'>Duration:</span> {job.duration_days} days
          </div>
          <div>
            <span className='font-semibold'>Deadline:</span>{' '}
            {new Date(job.deadline).toLocaleDateString()}
          </div>
          <div>
            <span className='font-semibold'>Status:</span> {job.status}
          </div>
          <div className='sm:col-span-2'>
            <span className='font-semibold'>Skills:</span> {job.required_skills || 'N/A'}
          </div>
        </div>

        {isOwner ? (
          <>
            <div className='mt-10'>
              <h2 className='mb-4 text-2xl font-semibold text-gray-800'>
                💰 Bids on this Job ({bids.length})
              </h2>

              {bids.length > 0 ? (
                <div className='space-y-4'>
                  {bids.map((bid) => (
                    <div
                      key={bid.id}
                      className='rounded-lg border bg-gray-50 p-4 transition hover:shadow-md'
                    >
                      <div className='mb-2 flex items-center justify-between'>
                        <span className='flex items-center gap-1 font-semibold text-gray-800'>
                          <User size={16} /> {bid.artist_name}
                        </span>
                        <span className='flex items-center gap-1 font-semibold text-cyan-700'>
                          Rs.{bid.bid_amount}
                        </span>
                      </div>

                      {bid.cover_letter && (
                        <p className='mb-2 text-gray-600 italic'>{bid.cover_letter}</p>
                      )}

                      <div className='flex justify-between text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <Clock size={14} /> Delivery: {bid.delivery_time} days
                        </div>
                        <span
                          className={`font-medium capitalize ${
                            bid.status === 'accepted'
                              ? 'text-green-600'
                              : bid.status === 'rejected'
                                ? 'text-red-600'
                                : 'text-yellow-600'
                          }`}
                        >
                          {bid?.status === 'pending' && (
                            <button
                              onClick={() => handleAcceptBid(bid.id)}
                              className='mt-3 w-full cursor-pointer rounded-md bg-cyan-600 px-3 py-2 font-semibold text-white transition hover:bg-cyan-700'
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
                <p className='text-gray-500'>No bids have been placed yet.</p>
              )}
            </div>
            {pendingPayment && (
              <Elements stripe={stripePromise}>
                <StripePaymentForm
                  paymentId={pendingPayment.paymentId}
                  transactionId={pendingPayment.transactionId}
                  onSuccess={() => setPendingPayment(null)}
                />
              </Elements>
            )}
            {isOwner && job?.status === 'in_progress' && (
              <div className='mt-8 text-center'>
                <button
                  onClick={handleOrderComplete}
                  className='rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700'
                >
                  ✅ Mark Order Complete
                </button>
              </div>
            )}
          </>
        ) : // ---------- If Artist: Place Bid ----------
        !bidPlaced ? (
          <form onSubmit={handleBidSubmit} className='mt-10 space-y-4'>
            <h2 className='mb-2 text-xl font-semibold text-gray-800'>🎯 Place Your Bid</h2>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Bid Amount ($)
                </label>
                <input
                  type='number'
                  step='0.01'
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className='w-full rounded-lg border px-3 py-2 focus:border-cyan-500 focus:ring focus:ring-cyan-100'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  Delivery Time
                </label>
                <input
                  type='text'
                  placeholder='e.g. 5 days'
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className='w-full rounded-lg border px-3 py-2 focus:border-cyan-500 focus:ring focus:ring-cyan-100'
                />
              </div>
            </div>

            <div>
              <label className='mb-1 block text-sm font-medium text-gray-700'>Cover Letter</label>
              <textarea
                rows='4'
                placeholder='Explain why you’re perfect for this job...'
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className='w-full rounded-lg border px-3 py-2 focus:border-cyan-500 focus:ring focus:ring-cyan-100'
              />
            </div>

            <button
              type='submit'
              disabled={bidding}
              className='mt-4 w-full rounded-lg bg-cyan-600 py-2.5 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-60'
            >
              {bidding ? 'Submitting...' : 'Place Bid'}
            </button>
          </form>
        ) : (
          <div className='mt-8 rounded-md bg-green-100 p-4 text-center font-medium text-green-700'>
            ✅ You have already placed a bid for this job!
          </div>
        )}
      </div>
    </>
  );
};

export default JobDetails;
