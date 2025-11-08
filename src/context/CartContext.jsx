import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, type = 'artwork') => {
    const existing = cartItems.find((i) => i.id === item.id && i.type === type);

    if (existing) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === item.id && i.type === type ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...item, type, quantity: 1 }]);
    }
  };

  const removeFromCart = (id, type) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  const increaseQuantity = (id, type) => {
    setCartItems((prev) =>
      prev.map((i) => (i.id === id && i.type === type ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQuantity = (id, type) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id && i.type === type ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
