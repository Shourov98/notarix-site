import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createClientOrder as createClientOrderApi,
  getClientBankInfo,
  getClientOrder,
  getClientOrders,
  getClientOverview,
  getNotaryBankInfo,
  getNotaryOverview,
  saveClientBankInfo as saveClientBankInfoApi,
  saveNotaryBankInfo as saveNotaryBankInfoApi,
  submitAccessRequest as submitAccessRequestApi,
} from "@/lib/siteApi";

export const fetchClientOverview = createAsyncThunk(
  "sitePortal/fetchClientOverview",
  async (_, { rejectWithValue }) => {
    try {
      return await getClientOverview();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load client overview.");
    }
  }
);

export const fetchNotaryOverview = createAsyncThunk(
  "sitePortal/fetchNotaryOverview",
  async (_, { rejectWithValue }) => {
    try {
      return await getNotaryOverview();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load notary overview.");
    }
  }
);

export const fetchClientOrders = createAsyncThunk(
  "sitePortal/fetchClientOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await getClientOrders();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load client orders.");
    }
  }
);

export const createClientOrder = createAsyncThunk(
  "sitePortal/createClientOrder",
  async (payload, { rejectWithValue }) => {
    try {
      return await createClientOrderApi(payload);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to create order.");
    }
  }
);

export const fetchClientOrder = createAsyncThunk(
  "sitePortal/fetchClientOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      return await getClientOrder(orderId);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load order details.");
    }
  }
);

export const submitAccessRequest = createAsyncThunk(
  "sitePortal/submitAccessRequest",
  async (payload, { rejectWithValue }) => {
    try {
      return await submitAccessRequestApi(payload);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to submit access request.");
    }
  }
);

export const fetchClientBankInfo = createAsyncThunk(
  "sitePortal/fetchClientBankInfo",
  async (_, { rejectWithValue }) => {
    try {
      return await getClientBankInfo();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load client bank info.");
    }
  }
);

export const fetchNotaryBankInfo = createAsyncThunk(
  "sitePortal/fetchNotaryBankInfo",
  async (_, { rejectWithValue }) => {
    try {
      return await getNotaryBankInfo();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load notary bank info.");
    }
  }
);

export const saveClientBankInfo = createAsyncThunk(
  "sitePortal/saveClientBankInfo",
  async ({ values, method = "PATCH" }, { rejectWithValue }) => {
    try {
      return await saveClientBankInfoApi(values, method);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to save client bank info.");
    }
  }
);

export const saveNotaryBankInfo = createAsyncThunk(
  "sitePortal/saveNotaryBankInfo",
  async ({ values, method = "PATCH" }, { rejectWithValue }) => {
    try {
      return await saveNotaryBankInfoApi(values, method);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to save notary bank info.");
    }
  }
);

const sitePortalSlice = createSlice({
  name: "sitePortal",
  initialState: {
    clientOverview: null,
    notaryOverview: null,
    clientBankInfo: null,
    notaryBankInfo: null,
    clientStatus: "idle",
    notaryStatus: "idle",
    clientOrders: [],
    clientRecentOrders: [],
    clientOrdersStatus: "idle",
    clientOrdersError: null,
    activeClientOrder: null,
    activeClientOrderStatus: "idle",
    activeClientOrderError: null,
    createOrderStatus: "idle",
    createOrderError: null,
    clientBankInfoStatus: "idle",
    notaryBankInfoStatus: "idle",
    accessRequestStatus: "idle",
    accessRequestError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientOverview.pending, (state) => {
        state.clientStatus = "loading";
      })
      .addCase(fetchClientOverview.fulfilled, (state, action) => {
        state.clientOverview = action.payload;
        state.clientStatus = "ready";
      })
      .addCase(fetchClientOverview.rejected, (state) => {
        state.clientStatus = "error";
      })
      .addCase(fetchNotaryOverview.pending, (state) => {
        state.notaryStatus = "loading";
      })
      .addCase(fetchNotaryOverview.fulfilled, (state, action) => {
        state.notaryOverview = action.payload;
        state.notaryStatus = "ready";
      })
      .addCase(fetchNotaryOverview.rejected, (state) => {
        state.notaryStatus = "error";
      })
      .addCase(fetchClientOrders.pending, (state) => {
        state.clientOrdersStatus = "loading";
        state.clientOrdersError = null;
      })
      .addCase(fetchClientOrders.fulfilled, (state, action) => {
        state.clientOrders = action.payload?.orders || [];
        state.clientRecentOrders = action.payload?.recentOrders || [];
        state.clientOrdersStatus = "ready";
        state.clientOrdersError = null;
      })
      .addCase(fetchClientOrders.rejected, (state, action) => {
        state.clientOrdersStatus = "error";
        state.clientOrdersError = action.payload || "Unable to load client orders.";
      })
      .addCase(fetchClientOrder.pending, (state) => {
        state.activeClientOrderStatus = "loading";
        state.activeClientOrderError = null;
      })
      .addCase(fetchClientOrder.fulfilled, (state, action) => {
        state.activeClientOrder = action.payload || null;
        state.activeClientOrderStatus = "ready";
        state.activeClientOrderError = null;
      })
      .addCase(fetchClientOrder.rejected, (state, action) => {
        state.activeClientOrder = null;
        state.activeClientOrderStatus = "error";
        state.activeClientOrderError = action.payload || "Unable to load order details.";
      })
      .addCase(createClientOrder.pending, (state) => {
        state.createOrderStatus = "loading";
        state.createOrderError = null;
      })
      .addCase(createClientOrder.fulfilled, (state) => {
        state.createOrderStatus = "ready";
        state.createOrderError = null;
      })
      .addCase(createClientOrder.rejected, (state, action) => {
        state.createOrderStatus = "error";
        state.createOrderError = action.payload || "Unable to create order.";
      })
      .addCase(fetchClientBankInfo.pending, (state) => {
        state.clientBankInfoStatus = "loading";
      })
      .addCase(fetchClientBankInfo.fulfilled, (state, action) => {
        state.clientBankInfo = action.payload;
        state.clientBankInfoStatus = "ready";
      })
      .addCase(fetchClientBankInfo.rejected, (state) => {
        state.clientBankInfoStatus = "error";
      })
      .addCase(fetchNotaryBankInfo.pending, (state) => {
        state.notaryBankInfoStatus = "loading";
      })
      .addCase(fetchNotaryBankInfo.fulfilled, (state, action) => {
        state.notaryBankInfo = action.payload;
        state.notaryBankInfoStatus = "ready";
      })
      .addCase(fetchNotaryBankInfo.rejected, (state) => {
        state.notaryBankInfoStatus = "error";
      })
      .addCase(saveClientBankInfo.fulfilled, (state, action) => {
        state.clientBankInfo = action.payload;
        state.clientBankInfoStatus = "ready";
      })
      .addCase(saveNotaryBankInfo.fulfilled, (state, action) => {
        state.notaryBankInfo = action.payload;
        state.notaryBankInfoStatus = "ready";
      })
      .addCase(submitAccessRequest.pending, (state) => {
        state.accessRequestStatus = "loading";
        state.accessRequestError = null;
      })
      .addCase(submitAccessRequest.fulfilled, (state) => {
        state.accessRequestStatus = "ready";
      })
      .addCase(submitAccessRequest.rejected, (state, action) => {
        state.accessRequestStatus = "error";
        state.accessRequestError = action.payload || "Unable to submit access request.";
      });
  },
});

export const sitePortalReducer = sitePortalSlice.reducer;
export const selectSitePortal = (state) => state.sitePortal;
