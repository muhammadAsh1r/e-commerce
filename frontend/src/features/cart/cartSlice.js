import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch cart for a user
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      return res.data; // cart object
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch cart failed");
    }
  }
);

// Async thunk to add or update an item in cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/cart/add`, {
        userId,
        productId,
        quantity,
      });
      return res.data; // updated cart object
    } catch (err) {
      return rejectWithValue(err.response?.data || "Add item failed");
    }
  }
);

// Async thunk to remove an item from cart
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/cart/${userId}/item/${productId}`
      );
      return res.data; // updated cart object
    } catch (err) {
      return rejectWithValue(err.response?.data || "Remove item failed");
    }
  }
);

// Async thunk to clear the entire cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${userId}`);
      return { items: [], totalPrice: 0 }; // reset cart
    } catch (err) {
      return rejectWithValue(err.response?.data || "Clear cart failed");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    userId: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.userId = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.userId = action.payload.userId || null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add or update item
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove item
      .addCase(removeItemFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.totalPrice = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
