import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { ArrowLeft, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const stripePromise = loadStripe(
  'pk_test_51SMAaaKqTb4RI19EFCKN7pNOkdc73E1DenvwJY6jFkjtepystR8vDiVzCAZAMLlJZ94hHeFcxuGfd8jzGklyMJP000jwL7RcBN'
); // Replace with your own publishable key

// ---- Inner Checkout Form Component ----
const CheckoutForm = ({ artwork }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    let authtoken = localStorage.getItem('authToken');

    try {
      // 1️⃣ Create payment record
      const paymentRes = await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/payments/',
        {
          payer: 1, // Replace with logged-in user ID
          payee: artwork.artist?.id,
          amount: artwork.price,
          payment_method: 'stripe',
          status: 'pending',
        },
        {
          headers: { Authorization: `Token ${authtoken}` },
        }
      );

      const transactionId = paymentRes.data.transaction_id;

      // 2️⃣ Process Stripe PaymentIntent
      const processRes = await axios.post(
        `https://shoaibahmad.pythonanywhere.com/api/payments/${paymentRes.data.id}/process/`,
        {
          transaction_id: transactionId,
        },
        {
          headers: { Authorization: `Token ${authtoken}` },
        }
      );

      const clientSecret = processRes.data.client_secret;

      // 3️⃣ Confirm payment using Stripe.js
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: 'Test Buyer' }, // Replace with real buyer name
        },
      });

      if (stripeError) throw stripeError;

      // 4️⃣ Confirm payment on backend
      await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/payments/confirm_stripe_payment/',
        { payment_intent_id: paymentIntent.id },
        { headers: { Authorization: `Token ${authtoken}` } }
      );

      setSuccess(true);
      setProcessing(false);

      // 🎯 Navigate with ALL order details
      navigate('/order-confirmation', {
        state: {
          artworkTitle: artwork.title,
          artworkImage: artwork.image || artwork.image_url, // Adjust based on your API
          artistName: artwork.artist?.name || artwork.artist?.username,
          price: `$${artwork.price}`,
          orderId: `ORD-${paymentRes.data.id}`, // Use payment ID or generate unique ID
          transactionId: transactionId,
          paymentMethod: 'Stripe',
          email: localStorage.getItem('userEmail') || 'your-email@example.com', // Get from user data
          purchaseDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <div>
      <div className='mb-4 rounded-lg border bg-gray-50 p-4'>
        <CardElement className='rounded-md border bg-white p-2' />
      </div>
      <button
        onClick={handlePayment}
        disabled={processing}
        className={`flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white transition-all hover:bg-cyan-700 ${
          processing ? 'cursor-not-allowed opacity-70' : ''
        }`}
      >
        <Lock className='h-5 w-5' />
        {processing ? 'Processing...' : 'Pay Securely'}
      </button>
      {error && <p className='mt-3 text-sm text-red-500'>{error}</p>}
      {success && <p className='mt-3 text-sm text-green-600'>Payment successful! Redirecting...</p>}
    </div>
  );
};

// ---- Main Page ----
const PurchasePage = () => {
  const { artworkId } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token] = useState('your_auth_token_here'); // TODO: Replace with your actual user token

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
      console.error('Error fetching artwork:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-lg text-gray-600'>Loading artwork...</p>
      </div>
    );

  if (!artwork)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <p className='text-lg text-gray-600'>Artwork not found.</p>
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-10'>
      <div className='mx-auto max-w-3xl rounded-xl bg-white p-6 shadow-md'>
        <button
          onClick={() => navigate(-1)}
          className='mb-6 flex items-center text-gray-600 hover:text-gray-900'
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Back to Artwork
        </button>

        <h1 className='mb-6 text-2xl font-bold text-gray-900'>Complete Your Purchase</h1>

        <div className='mb-8 flex flex-col gap-6 sm:flex-row'>
          <img
            src={artwork.watermarked_image || artwork.image}
            alt={artwork.title}
            className='h-48 w-full rounded-lg object-cover shadow-sm sm:w-48'
          />
          <div>
            <h2 className='mb-1 text-xl font-semibold text-gray-800'>{artwork.title}</h2>
            <p className='mb-2 text-gray-600'>{artwork.description}</p>
            <p className='text-lg font-bold text-gray-800'>₨ {artwork.price.toLocaleString()}</p>
            <p className='mt-1 text-sm text-gray-500'>
              Category: {artwork.category?.name || 'N/A'}
            </p>
          </div>
        </div>

        {/* Stripe Payment Form */}
        <Elements stripe={stripePromise}>
          <CheckoutForm artwork={artwork} token={token} />
        </Elements>
      </div>
    </div>
  );
};

export default PurchasePage;
