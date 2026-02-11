import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Вспомогательная функция для обновления итогов, чтоб не дублировать код
const updateCartState = (state) => {
  state.cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  state.totalPrice = state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const checkout = createAsyncThunk(
  'cart/checkout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Имитируем вызов API
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch(clearCart());
    } catch (error) {
      return rejectWithValue('Не удалось оформить заказ.');
    }
  }
);

const initialState = {
  cart: [],
  cartCount: 0,
  totalPrice: 0,
  checkoutStatus: 'idle',   // 'idle' | 'loading' | 'succeeded' | 'failed'
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
      if (quantity <= 0) {
        // если кол-во 0 или меньше -> удаляем
        state.cart = state.cart.filter(item => item.id !== id);
      } else {
        const item = state.cart.find(item => item.id === id);
        if (item) {
          item.quantity = quantity;
        }
      }
      updateCartState(state);
    },

    clearCart: (state) => {
      state.cart = [];
      state.cartCount = 0;
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.checkoutStatus = 'loading';
      })
      .addCase(checkout.fulfilled, (state) => {
        state.checkoutStatus = 'succeeded';
      })
      .addCase(checkout.rejected, (state) => {
        state.checkoutStatus = 'failed';
      });
  }
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
export const selectCheckoutStatus = (state) => state.cart.checkoutStatus;

export default cartSlice.reducer;