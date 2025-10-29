import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import Navbar from '@components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useCart } from 'src/context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    removeFromCart,
    totalPrice,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-4xl p-6">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                      <p className="text-sm text-cyan-600 font-medium">
                        Rs. {item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => decreaseQuantity(item.id, item.type)}
                      className="text-gray-500 hover:text-cyan-600"
                    >
                      <MinusCircle size={20} />
                    </button>
                    <span className="font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.id, item.type)}
                      className="text-gray-500 hover:text-cyan-600"
                    >
                      <PlusCircle size={20} />
                    </button>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 flex justify-between items-center border-t pt-4">
              <h3 className="text-xl font-bold">Total: Rs. {totalPrice}</h3>
              <div className="space-x-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-2 rounded bg-cyan-600 text-white hover:bg-cyan-700"
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
