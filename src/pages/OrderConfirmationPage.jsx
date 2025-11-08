import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  Download,
  Home,
  Mail,
  Package,
  Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const orderData = location.state || {};
  console.log('orderData;: ', orderData);
  const {
    artworkTitle = 'Your Artwork',
    artworkImage,
    artistName = 'Artist',
    price = '$0.00',
    orderId,
    transactionId,
    paymentMethod = 'Stripe',
    email = 'your-email@example.com',
    purchaseDate,
  } = orderData;

  useEffect(() => {
    setIsVisible(true);

    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'][Math.floor(Math.random() * 5)],
    }));
    setConfettiPieces(pieces);
  }, []);

  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 px-4 py-12'>
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className='absolute h-2 w-2 rounded-full'
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            backgroundColor: piece.color,
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .gradient-border {
          position: relative;
          background: white;
          border-radius: 1.5rem;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 1.5rem;
          padding: 2px;
          background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `}</style>

      <div className='mx-auto max-w-3xl'>
        <div className={`mb-8 flex justify-center ${isVisible ? 'animate-scale-in' : 'opacity-0'}`}>
          <div className='relative'>
            <div className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 opacity-50 blur-2xl' />
            <div className='relative rounded-full bg-white p-6 shadow-2xl'>
              <CheckCircle
                className='h-20 w-20 bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent'
                strokeWidth={2}
                stroke='url(#gradient)'
              />
              <svg width='0' height='0'>
                <defs>
                  <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='#06b6d4' />
                    <stop offset='100%' stopColor='#8b5cf6' />
                  </linearGradient>
                </defs>
              </svg>
              <Sparkles className='animate-float absolute -top-2 -right-2 h-8 w-8 text-yellow-400' />
            </div>
          </div>
        </div>

        <div
          className={`gradient-border shadow-2xl ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.2s' }}
        >
          <div className='rounded-3xl bg-white p-8 md:p-12'>
            <div className='mb-8 text-center'>
              <h1 className='mb-4 bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl'>
                Payment Successful!
              </h1>
              <p className='text-lg text-gray-600'>
                Your order has been confirmed and is being processed
              </p>
            </div>

            {artworkImage && (
              <div className='mb-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
                <div className='flex items-center gap-6'>
                  <img
                    src={artworkImage}
                    alt={artworkTitle}
                    className='h-24 w-24 rounded-xl object-cover shadow-lg md:h-32 md:w-32'
                  />
                  <div className='flex-1'>
                    <p className='mb-1 text-sm text-gray-500'>Artwork Purchased</p>
                    <p className='mb-2 text-xl font-bold text-gray-900 md:text-2xl'>
                      {artworkTitle}
                    </p>
                    <p className='text-sm text-gray-600'>
                      by <span className='font-semibold text-purple-600'>{artistName}</span>
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='mb-1 text-sm text-gray-500'>Amount Paid</p>
                    <p className='text-2xl font-bold text-cyan-600 md:text-3xl'>{price}</p>
                  </div>
                </div>
              </div>
            )}

            <div className='mb-8 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='flex items-start gap-3'>
                  <Package className='mt-1 h-5 w-5 flex-shrink-0 text-cyan-600' />
                  <div>
                    <p className='mb-1 text-sm text-gray-500'>Order ID</p>
                    <p className='font-mono text-sm font-semibold text-gray-800'>{orderId}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <CreditCard className='mt-1 h-5 w-5 flex-shrink-0 text-purple-600' />
                  <div>
                    <p className='mb-1 text-sm text-gray-500'>Transaction ID</p>
                    <p className='font-mono text-sm font-semibold text-gray-800'>{transactionId}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Mail className='mt-1 h-5 w-5 flex-shrink-0 text-pink-600' />
                  <div>
                    <p className='mb-1 text-sm text-gray-500'>Email Address</p>
                    <p className='text-sm font-medium break-all text-gray-800'>{email}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <div className='mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center text-green-600'>
                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                  </div>
                  <div>
                    <p className='mb-1 text-sm text-gray-500'>Purchase Date</p>
                    <p className='text-sm font-medium text-gray-800'>{purchaseDate}</p>
                  </div>
                </div>
              </div>

              <div className='mt-4 border-t border-gray-300 pt-4'>
                <p className='text-xs text-gray-500'>
                  Payment Method:{' '}
                  <span className='font-semibold text-gray-700'>{paymentMethod}</span>
                </p>
              </div>
            </div>

            <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='transform rounded-xl border border-cyan-200 bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 transition-transform hover:scale-105'>
                <div className='mb-2 flex items-center gap-3'>
                  <div className='rounded-lg bg-cyan-600 p-2'>
                    <Mail className='h-5 w-5 text-white' />
                  </div>
                  <h3 className='font-semibold text-gray-800'>Email Delivery</h3>
                </div>
                <p className='text-sm text-gray-600'>
                  Your artwork will be sent to{' '}
                  <span className='font-medium text-cyan-700'>{email}</span> within 5-10 minutes
                </p>
              </div>

              <div className='transform rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-5 transition-transform hover:scale-105'>
                <div className='mb-2 flex items-center gap-3'>
                  <div className='rounded-lg bg-purple-600 p-2'>
                    <Download className='h-5 w-5 text-white' />
                  </div>
                  <h3 className='font-semibold text-gray-800'>High Quality</h3>
                </div>
                <p className='text-sm text-gray-600'>
                  Download link for full resolution artwork included in email
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-4 sm:flex-row'>
              <button
                onClick={() => navigate('/gallery')}
                className='group flex flex-1 transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg'
              >
                Browse More Artworks
                <ArrowRight className='h-5 w-5 transition-transform group-hover:translate-x-1' />
              </button>

              <button
                onClick={() => navigate('/')}
                className='flex flex-1 transform items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 transition-all hover:scale-105 hover:border-gray-400 hover:shadow-md'
              >
                <Home className='h-5 w-5' />
                Go to Homepage
              </button>
            </div>

            <div className='mt-8 border-t border-gray-200 pt-6 text-center'>
              <p className='text-sm text-gray-500'>
                Need help? Contact us at{' '}
                <span className='font-medium text-cyan-600'>support@artgallery.com</span>
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mt-8 text-center ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.4s' }}
        >
          <p className='text-lg text-gray-600'>
            Thank you for supporting{' '}
            <span className='font-semibold text-purple-600'>{artistName}</span>! 🎨
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
