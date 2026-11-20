import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'pxs_cart_v1';
const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 70;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [items]);

  /**
   * SECURITY NOTICE:
   * The item prices and subtotal calculated here are strictly for instant client UI display.
   * When placing the order, the backend recalculates every line item price and shipping fee
   * directly from PostgreSQL. The server NEVER trusts client financial calculations.
   */
  const addToCart = (product, size, quantity = 1) => {
    const variant = product.variants?.find(v => v.size === size);
    if (!variant || variant.stock <= 0) return;

    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.variantId === variant.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, variant.stock);
        updated[existingIndex].quantity = newQty;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            variantId: variant.id,
            title: product.title,
            slug: product.slug,
            size,
            price: Number(product.base_price),
            image: product.primary_image || product.images?.[0]?.image_url,
            quantity: Math.min(quantity, variant.stock),
            maxStock: variant.stock
          }
        ];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (variantId) => {
    setItems(prev => prev.filter(item => item.variantId !== variantId));
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.variantId === variantId) {
          return { ...item, quantity: Math.min(newQuantity, item.maxStock || 10) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingFee,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
