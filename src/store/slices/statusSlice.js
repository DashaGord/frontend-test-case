import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
};

const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setLoading, setError } = statusSlice.actions;

export const selectLoading = (state) => state.status.loading;
export const selectError = (state) => state.status.error;

export default statusSlice.reducer;