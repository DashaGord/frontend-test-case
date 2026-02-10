import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  cartCount: 0,
  totalPrice: 0,
};

// Helper function to update cart totals and avoid code duplication
const updateCartState = (state) => {
  state.cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  state.totalPrice = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
      updateCartState(state);
    },

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      updateCartState(state);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);

      if (item) {
        item.quantity = quantity;
      }
      updateCartState(state);
    },

    clearCart: (state) => {
      state.cart = [];
      state.cartCount = 0;
      state.totalPrice = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export const selectCart = (state) => state.cart.cart;
export const selectCartCount = (state) => state.cart.cartCount;
export const selectTotalPrice = (state) => state.cart.totalPrice;

export default cartSlice.reducer;