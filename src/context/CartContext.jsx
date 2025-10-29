import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist cart in localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // ➕ Add to Cart
  const addToCart = (item, type = 'artwork') => {
    const existing = cartItems.find((i) => i.id === item.id && i.type === type);

    if (existing) {
      setCartItems((prev) =>
        prev.map((i) =>
          i.id === item.id && i.type === type
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...item, type, quantity: 1 }]);
    }
  };

  // ❌ Remove item completely
  const removeFromCart = (id, type) => {
    setCartItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  // ➕ Increase quantity
  const increaseQuantity = (id, type) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id && i.type === type
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  // ➖ Decrease quantity
  const decreaseQuantity = (id, type) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.type === type
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0) // remove if zero
    );
  };

  // 🧹 Clear entire cart
  const clearCart = () => setCartItems([]);

  // 💰 Total price
  const totalPrice = cartItems.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * i.quantity,
    0
  );

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
