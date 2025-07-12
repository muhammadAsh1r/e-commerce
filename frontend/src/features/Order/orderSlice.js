import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/orders",
        orderData
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create order");
    }
  }
);

// Get all orders
export const getAllOrders = createAsyncThunk(
  "orders/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:3000/api/orders");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch orders");
    }
  }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
  "orders/getOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/orders/${orderId}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch order");
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:3000/api/orders/${id}`, {
        orderStatus: status,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to update order status"
      );
    }
  }
);

// Delete order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/orders/${id}`);
      return id; // Return deleted ID to remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete order");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearOrderMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.successMessage = "Order created successfully";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get all orders
      .addCase(getAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get order by ID
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        state.successMessage = "Order status updated";
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
        state.successMessage = "Order deleted";
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderMessages } = orderSlice.actions;

export default orderSlice.reducer;
