import React, { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCart,
  selectCartCount,
  selectTotalPrice,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/slices/cartSlice';
import t from '../locales/ru.json';
import CartItem from './CartItem';

export const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const cartCount = useSelector(selectCartCount);
  const totalPrice = useSelector(selectTotalPrice);

  const [isOpen, setIsOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleToggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleCloseCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleUpdateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  }, [dispatch]);

  const handleRemoveFromCart = useCallback((id) => {
    dispatch(removeFromCart(id));
  }, [dispatch]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      alert(t.cart.checkout.alert);
      dispatch(clearCart());
      setIsCheckingOut(false);
      setIsOpen(false);
    }, 1000);
  };

  return (
    <div className="cart">
      <button className="cart-toggle" onClick={handleToggleCart}>
        {t.cart.toggle.replace('%COUNT%', cartCount)}
      </button>

      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-header">
            <h3>{t.cart.title}</h3>
            <button onClick={handleCloseCart}>×</button>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <p>{t.cart.empty}</p>
            ) : (
              cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveFromCart}
                />
              ))
            )}
          </div>

          <div className="cart-footer">
            <div className="total">{t.cart.total.replace('%TOTAL_PRICE%', totalPrice)}</div>
            <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0 || isCheckingOut}>
              {isCheckingOut ? t.cart.checkout.loading : t.cart.checkout.button}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};