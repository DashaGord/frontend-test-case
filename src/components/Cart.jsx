import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCart,
  selectCartCount,
  selectTotalPrice,
  removeFromCart,
  updateQuantity,
  checkout,
  selectCheckoutStatus,
} from '../store/slices/cartSlice';
import t from '../locales/ru.json';
import CartItem from './CartItem';

export const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const cartCount = useSelector(selectCartCount);
  const totalPrice = useSelector(selectTotalPrice);
  const checkoutStatus = useSelector(selectCheckoutStatus);

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleCart = () => {
    setIsOpen(prev => !prev);
  };

  const handleCloseCart = () => {
    setIsOpen(false);
  };

  const handleUpdateQuantity = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = () => {
    dispatch(checkout());
  };

  useEffect(() => {
    if (checkoutStatus === 'succeeded') {
      alert(t.cart.checkout.alert);
      setIsOpen(false);
    }
  }, [checkoutStatus]);

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
            <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0 || checkoutStatus === 'loading'}>
              {checkoutStatus === 'loading' ? t.cart.checkout.loading : t.cart.checkout.button}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};