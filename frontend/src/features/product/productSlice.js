// features/product/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "/api/products";

// Thunks
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const res = await axios.get(BASE_URL);
  return res.data; // res.data = { products: [...] }
});

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id) => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data; // res.data = { product: {...} }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (productData) => {
    const res = await axios.post(BASE_URL, productData);
    return res.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, updates }) => {
    const res = await axios.put(`${BASE_URL}/${id}`, updates);
    return res.data;
  }
);

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  await axios.delete(`${BASE_URL}/${id}`);
  return id;
});

export const fetchByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (categoryId) => {
    const res = await axios.get(`${BASE_URL}/category/${categoryId}`);
    return res.data; // res.data = { products: [...] }
  }
);

const initialState = {
  items: [], // array of products
  singleProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSingleProduct(state) {
      state.singleProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Extract the products array from payload
        state.items = action.payload.products || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        // product is inside action.payload.product
        state.singleProduct = action.payload.product || null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create
      .addCase(createProduct.fulfilled, (state, action) => {
        // new product is inside action.payload.product (check your backend)
        const newProduct = action.payload.product || action.payload;
        state.items.push(newProduct);
      })

      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updated = action.payload.product || action.payload;
        const index = state.items.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.items[index] = updated;
      })

      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
      })

      // Fetch by Category
      .addCase(fetchByCategory.fulfilled, (state, action) => {
        state.items = action.payload.products || [];
      });
  },
});

export const { clearSingleProduct } = productSlice.actions;
export default productSlice.reducer;
