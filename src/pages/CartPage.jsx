import Navbar from '@components/Navbar';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'src/context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, totalPrice, clearCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='mx-auto max-w-4xl p-6'>
        <h2 className='mb-6 text-3xl font-bold'>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className='text-gray-600'>Your cart is empty.</p>
        ) : (
          <>
            <div className='space-y-4'>
              {cartItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className='flex items-center justify-between rounded-lg bg-white p-4 shadow'
                >
                  <div className='flex items-center space-x-4'>
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className='h-16 w-16 rounded object-cover'
                    />
                    <div>
                      <h3 className='font-semibold'>{item.name}</h3>
                      <p className='text-sm text-gray-600 capitalize'>{item.type}</p>
                      <p className='text-sm font-medium text-cyan-600'>
                        Rs. {item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className='flex items-center space-x-3'>
                    <button
                      onClick={() => decreaseQuantity(item.id, item.type)}
                      className='text-gray-500 hover:text-cyan-600'
                    >
                      <MinusCircle size={20} />
                    </button>
                    <span className='w-6 text-center font-medium'>{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id, item.type)}
                      className='text-gray-500 hover:text-cyan-600'
                    >
                      <PlusCircle size={20} />
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className='mt-8 flex items-center justify-between border-t pt-4'>
              <h3 className='text-xl font-bold'>Total: Rs. {totalPrice}</h3>
              <div className='space-x-3'>
                <button
                  onClick={clearCart}
                  className='rounded bg-gray-200 px-4 py-2 hover:bg-gray-300'
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className='rounded bg-cyan-600 px-6 py-2 text-white hover:bg-cyan-700'
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
