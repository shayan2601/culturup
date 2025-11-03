import Navbar from '@components/Navbar';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { ArrowLeft, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'src/context/CartContext';

const stripePromise = loadStripe(
  'pk_test_51SMAaaKqTb4RI19EFCKN7pNOkdc73E1DenvwJY6jFkjtepystR8vDiVzCAZAMLlJZ94hHeFcxuGfd8jzGklyMJP000jwL7RcBN'
);

const CheckoutForm = ({ totalAmount, cartItems, clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setProcessing(true);
    setError('');

    const authtoken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId'); // you can replace this with your logged-in user's ID
    const userEmail = localStorage.getItem('userEmail') || 'your-email@example.com';

    try {
      // 1️⃣ Create payment record (for entire cart)
      const paymentRes = await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/payments/',
        {
          payer: userId || 1,
          payee: null, // You can handle per-artist distribution later
          amount: totalAmount,
          payment_method: 'stripe',
          status: 'pending',
        },
        {
          headers: { Authorization: `Token ${authtoken}` },
        }
      );

      const transactionId = paymentRes.data.transaction_id;

      // 2️⃣ Request Stripe PaymentIntent
      const processRes = await axios.post(
        `https://shoaibahmad.pythonanywhere.com/api/payments/${paymentRes.data.id}/process/`,
        { transaction_id: transactionId },
        {
          headers: { Authorization: `Token ${authtoken}` },
        }
      );

      const clientSecret = processRes.data.client_secret;

      // 3️⃣ Confirm card payment
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: userEmail },
        },
      });

      if (stripeError) throw stripeError;

      // 4️⃣ Confirm payment on backend
      await axios.post(
        'https://shoaibahmad.pythonanywhere.com/api/payments/confirm_stripe_payment/',
        { payment_intent_id: paymentIntent.id },
        {
          headers: { Authorization: `Token ${authtoken}` },
        }
      );

      // ✅ Success
      setSuccess(true);
      clearCart();

      navigate('/order-confirmation', {
        state: {
          orderId: `ORD-${paymentRes.data.id}`,
          transactionId,
          paymentMethod: 'Stripe',
          email: userEmail,
          purchaseDate: new Date().toLocaleString(),
          totalAmount: totalAmount,
          items: cartItems.map((i) => ({
            name: i.name,
            type: i.type,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      });
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
    } finally {
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

//
// ---- Main Checkout Page ----
//
const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  if (cartItems.length === 0)
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50'>
        <Navbar />
        <p className='mt-10 text-lg text-gray-600'>Your cart is empty.</p>
        <button
          onClick={() => navigate('/shop')}
          className='mt-4 rounded bg-cyan-600 px-4 py-2 text-white hover:bg-cyan-700'
        >
          Go to Shop
        </button>
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />

      <div className='mx-auto mt-10 max-w-3xl rounded-xl bg-white p-6 shadow-md'>
        <button
          onClick={() => navigate(-1)}
          className='mb-6 flex items-center text-gray-600 hover:text-gray-900'
        >
          <ArrowLeft className='mr-2 h-5 w-5' />
          Back to Cart
        </button>

        <h1 className='mb-6 text-2xl font-bold text-gray-900'>Checkout</h1>

        {/* Cart Summary */}
        <div className='mb-6 space-y-4'>
          {cartItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className='flex items-center justify-between border-b pb-2'
            >
              <div>
                <h3 className='font-medium text-gray-800'>{item.name}</h3>
                <p className='text-sm text-gray-500 capitalize'>
                  {item.type} × {item.quantity}
                </p>
              </div>
              <p className='font-semibold text-gray-800'>
                ₨ {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}

          <div className='flex justify-between border-t pt-3 text-lg font-semibold'>
            <span>Total:</span>
            <span>₨ {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Stripe Payment Form */}
        <Elements stripe={stripePromise}>
          <CheckoutForm totalAmount={totalPrice} cartItems={cartItems} clearCart={clearCart} />
        </Elements>
      </div>
    </div>
  );
};

export default CheckoutPage;
