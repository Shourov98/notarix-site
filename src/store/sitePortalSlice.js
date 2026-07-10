import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  acceptNotaryAssignment as acceptNotaryAssignmentApi,
  completeNotaryAssignment as completeNotaryAssignmentApi,
  createClientOrder as createClientOrderApi,
  getClientBankInfo,
  getClientOrder,
  getClientOrders,
  getClientOverview,
  getNotaryAssignment,
  getNotaryAssignments,
  getNotaryBankInfo,
  getNotaryNotificationPreferences as getNotaryNotificationPreferencesApi,
  getNotaryOverview,
  getNotaryProfileDetails as getNotaryProfileDetailsApi,
  getPortalConversations,
  getPortalConversationByOrder,
  getPortalMessages,
  getPortalNotifications,
  markAllPortalNotificationsRead as markAllPortalNotificationsReadApi,
  markPortalMessageRead as markPortalMessageReadApi,
  markPortalNotificationRead as markPortalNotificationReadApi,
  rejectNotaryAssignment as rejectNotaryAssignmentApi,
  saveClientBankInfo as saveClientBankInfoApi,
  saveNotaryBankInfo as saveNotaryBankInfoApi,
  saveNotaryNotificationPreferences as saveNotaryNotificationPreferencesApi,
  saveNotaryProfile as saveNotaryProfileApi,
  saveNotaryProfileDetails as saveNotaryProfileDetailsApi,
  sendPortalMessage as sendPortalMessageApi,
  startNotaryAssignment as startNotaryAssignmentApi,
  submitAccessRequest as submitAccessRequestApi,
  submitNotaryVerification as submitNotaryVerificationApi,
  uploadNotaryCompletedDocuments as uploadNotaryCompletedDocumentsApi,
  uploadNotaryProfilePhoto as uploadNotaryProfilePhotoApi,
  uploadNotaryTrackedDocument as uploadNotaryTrackedDocumentApi,
  uploadPortalAttachments as uploadPortalAttachmentsApi,
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

export const fetchNotaryAssignments = createAsyncThunk(
  "sitePortal/fetchNotaryAssignments",
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await getNotaryAssignments(filters);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load notary assignments.");
    }
  }
);

export const fetchNotaryAssignment = createAsyncThunk(
  "sitePortal/fetchNotaryAssignment",
  async (orderId, { rejectWithValue }) => {
    try {
      return await getNotaryAssignment(orderId);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load assignment details.");
    }
  }
);

export const acceptNotaryAssignment = createAsyncThunk(
  "sitePortal/acceptNotaryAssignment",
  async ({ orderId, note }, { rejectWithValue }) => {
    try {
      return await acceptNotaryAssignmentApi(orderId, note ? { note } : {});
    } catch (error) {
      return rejectWithValue(error.message || "Unable to accept assignment.");
    }
  }
);

export const rejectNotaryAssignment = createAsyncThunk(
  "sitePortal/rejectNotaryAssignment",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      return await rejectNotaryAssignmentApi(orderId, { reason });
    } catch (error) {
      return rejectWithValue(error.message || "Unable to reject assignment.");
    }
  }
);

export const startNotaryAssignment = createAsyncThunk(
  "sitePortal/startNotaryAssignment",
  async ({ orderId, note }, { rejectWithValue }) => {
    try {
      return await startNotaryAssignmentApi(orderId, note ? { note } : {});
    } catch (error) {
      return rejectWithValue(error.message || "Unable to start assignment.");
    }
  }
);

export const completeNotaryAssignment = createAsyncThunk(
  "sitePortal/completeNotaryAssignment",
  async ({ orderId, note, files = [] }, { rejectWithValue }) => {
    try {
      if (files.length > 0) {
        await uploadNotaryCompletedDocumentsApi(orderId, files);
      }
      return await completeNotaryAssignmentApi(orderId, note ? { note } : {});
    } catch (error) {
      return rejectWithValue(error.message || "Unable to complete assignment.");
    }
  }
);

export const fetchPortalConversations = createAsyncThunk(
  "sitePortal/fetchPortalConversations",
  async (_, { rejectWithValue }) => {
    try {
      return await getPortalConversations();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load conversations.");
    }
  }
);

export const fetchPortalConversationByOrder = createAsyncThunk(
  "sitePortal/fetchPortalConversationByOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      return await getPortalConversationByOrder(orderId);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load order conversation.");
    }
  }
);

export const fetchPortalMessages = createAsyncThunk(
  "sitePortal/fetchPortalMessages",
  async (conversationId, { rejectWithValue }) => {
    try {
      return await getPortalMessages(conversationId);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load messages.");
    }
  }
);

export const sendPortalMessage = createAsyncThunk(
  "sitePortal/sendPortalMessage",
  async ({ conversationId, body }, { rejectWithValue }) => {
    try {
      return await sendPortalMessageApi(conversationId, body);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to send message.");
    }
  }
);

export const uploadPortalAttachments = createAsyncThunk(
  "sitePortal/uploadPortalAttachments",
  async ({ conversationId, files, body = "" }, { rejectWithValue }) => {
    try {
      return await uploadPortalAttachmentsApi(conversationId, files, body);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to upload attachments.");
    }
  }
);

export const markPortalMessageRead = createAsyncThunk(
  "sitePortal/markPortalMessageRead",
  async (messageId, { rejectWithValue }) => {
    try {
      return await markPortalMessageReadApi(messageId);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to update message status.");
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

export const fetchNotaryProfileDetails = createAsyncThunk(
  "sitePortal/fetchNotaryProfileDetails",
  async (_, { rejectWithValue }) => {
    try {
      return await getNotaryProfileDetailsApi();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load profile details.");
    }
  }
);

export const updateNotaryProfile = createAsyncThunk(
  "sitePortal/updateNotaryProfile",
  async (body, { rejectWithValue }) => {
    try {
      return await saveNotaryProfileApi(body);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to update profile.");
    }
  }
);

export const updateNotaryProfileDetails = createAsyncThunk(
  "sitePortal/updateNotaryProfileDetails",
  async (body, { rejectWithValue }) => {
    try {
      return await saveNotaryProfileDetailsApi(body);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to update profile details.");
    }
  }
);

export const uploadNotaryAvatar = createAsyncThunk(
  "sitePortal/uploadNotaryAvatar",
  async (file, { rejectWithValue }) => {
    try {
      return await uploadNotaryProfilePhotoApi(file);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to upload profile photo.");
    }
  }
);

export const uploadNotaryVerificationDocument = createAsyncThunk(
  "sitePortal/uploadNotaryVerificationDocument",
  async ({ documentKey, file }, { rejectWithValue }) => {
    try {
      return await uploadNotaryTrackedDocumentApi(documentKey, file);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to upload verification document.");
    }
  }
);

export const submitNotaryVerificationForReview = createAsyncThunk(
  "sitePortal/submitNotaryVerification",
  async (_, { rejectWithValue }) => {
    try {
      return await submitNotaryVerificationApi();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to submit verification for review.");
    }
  }
);

export const fetchNotaryNotificationPreferences = createAsyncThunk(
  "sitePortal/fetchNotaryNotificationPreferences",
  async (_, { rejectWithValue }) => {
    try {
      return await getNotaryNotificationPreferencesApi();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load notification preferences.");
    }
  }
);

export const saveNotaryNotificationPrefs = createAsyncThunk(
  "sitePortal/saveNotaryNotificationPreferences",
  async (body, { rejectWithValue }) => {
    try {
      return await saveNotaryNotificationPreferencesApi(body);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to save notification preferences.");
    }
  }
);

export const fetchPortalNotifications = createAsyncThunk(
  "sitePortal/fetchPortalNotifications",
  async (query = {}, { rejectWithValue }) => {
    try {
      const data = await getPortalNotifications(query);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load notifications.");
    }
  }
);

export const markPortalNotificationRead = createAsyncThunk(
  "sitePortal/markPortalNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      return await markPortalNotificationReadApi(id);
    } catch (error) {
      return rejectWithValue(error.message || "Unable to mark notification as read.");
    }
  }
);

export const markAllPortalNotificationsRead = createAsyncThunk(
  "sitePortal/markAllPortalNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      return await markAllPortalNotificationsReadApi();
    } catch (error) {
      return rejectWithValue(
        error.message || "Unable to mark all notifications as read."
      );
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
    notaryAssignments: [],
    notaryAssignmentsStatus: "idle",
    notaryAssignmentsError: null,
    activeNotaryAssignment: null,
    activeNotaryAssignmentStatus: "idle",
    activeNotaryAssignmentError: null,
    notaryAssignmentActionStatus: "idle",
    notaryAssignmentActionError: null,
    conversations: [],
    conversationsStatus: "idle",
    conversationsError: null,
    activeConversation: null,
    messages: [],
    messagesStatus: "idle",
    messagesError: null,
    messageActionStatus: "idle",
    messageActionError: null,
    createOrderStatus: "idle",
    createOrderError: null,
    clientBankInfoStatus: "idle",
    notaryBankInfoStatus: "idle",
    accessRequestStatus: "idle",
    accessRequestError: null,
    notaryProfileDetails: null,
    notaryProfileDetailsStatus: "idle",
    notaryProfileDetailsError: null,
    notaryProfileSaveStatus: "idle",
    notaryProfileSaveError: null,
    notaryAvatarUploadStatus: "idle",
    notaryAvatarUploadError: null,
    notaryVerificationUploadStatus: "idle",
    notaryVerificationUploadError: null,
    notaryVerificationSubmitStatus: "idle",
    notaryVerificationSubmitError: null,
    notaryNotificationPreferences: null,
    notaryNotificationPreferencesStatus: "idle",
    notaryNotificationPreferencesError: null,
    notaryNotificationSaveStatus: "idle",
    notaryNotificationSaveError: null,
    notifications: [],
    notificationsStatus: "idle",
    notificationsError: null,
    notificationsUnreadCount: 0,
    notificationActionStatus: "idle",
    notificationActionError: null,
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
      .addCase(fetchNotaryAssignments.pending, (state) => {
        state.notaryAssignmentsStatus = "loading";
        state.notaryAssignmentsError = null;
      })
      .addCase(fetchNotaryAssignments.fulfilled, (state, action) => {
        state.notaryAssignments = Array.isArray(action.payload) ? action.payload : [];
        state.notaryAssignmentsStatus = "ready";
        state.notaryAssignmentsError = null;
      })
      .addCase(fetchNotaryAssignments.rejected, (state, action) => {
        state.notaryAssignments = [];
        state.notaryAssignmentsStatus = "error";
        state.notaryAssignmentsError = action.payload || "Unable to load notary assignments.";
      })
      .addCase(fetchNotaryAssignment.pending, (state) => {
        state.activeNotaryAssignmentStatus = "loading";
        state.activeNotaryAssignmentError = null;
      })
      .addCase(fetchNotaryAssignment.fulfilled, (state, action) => {
        state.activeNotaryAssignment = action.payload || null;
        state.activeNotaryAssignmentStatus = "ready";
        state.activeNotaryAssignmentError = null;
      })
      .addCase(fetchNotaryAssignment.rejected, (state, action) => {
        state.activeNotaryAssignment = null;
        state.activeNotaryAssignmentStatus = "error";
        state.activeNotaryAssignmentError = action.payload || "Unable to load assignment details.";
      })
      .addCase(fetchPortalConversations.pending, (state) => {
        state.conversationsStatus = "loading";
        state.conversationsError = null;
      })
      .addCase(fetchPortalConversations.fulfilled, (state, action) => {
        state.conversations = Array.isArray(action.payload) ? action.payload : [];
        state.conversationsStatus = "ready";
        state.conversationsError = null;
      })
      .addCase(fetchPortalConversations.rejected, (state, action) => {
        state.conversations = [];
        state.conversationsStatus = "error";
        state.conversationsError = action.payload || "Unable to load conversations.";
      })
      .addCase(fetchPortalConversationByOrder.fulfilled, (state, action) => {
        state.activeConversation = action.payload || null;
      })
      .addCase(fetchPortalMessages.pending, (state) => {
        state.messagesStatus = "loading";
        state.messagesError = null;
      })
      .addCase(fetchPortalMessages.fulfilled, (state, action) => {
        state.activeConversation = action.payload?.conversation || state.activeConversation;
        state.messages = action.payload?.messages || [];
        state.messagesStatus = "ready";
        state.messagesError = null;
      })
      .addCase(fetchPortalMessages.rejected, (state, action) => {
        state.messages = [];
        state.messagesStatus = "error";
        state.messagesError = action.payload || "Unable to load messages.";
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
      .addCase(acceptNotaryAssignment.pending, (state) => {
        state.notaryAssignmentActionStatus = "loading";
        state.notaryAssignmentActionError = null;
      })
      .addCase(acceptNotaryAssignment.fulfilled, (state, action) => {
        state.notaryAssignmentActionStatus = "ready";
        state.activeNotaryAssignment = action.payload || state.activeNotaryAssignment;
      })
      .addCase(acceptNotaryAssignment.rejected, (state, action) => {
        state.notaryAssignmentActionStatus = "error";
        state.notaryAssignmentActionError = action.payload || "Unable to accept assignment.";
      })
      .addCase(rejectNotaryAssignment.pending, (state) => {
        state.notaryAssignmentActionStatus = "loading";
        state.notaryAssignmentActionError = null;
      })
      .addCase(rejectNotaryAssignment.fulfilled, (state, action) => {
        state.notaryAssignmentActionStatus = "ready";
        state.activeNotaryAssignment = action.payload || state.activeNotaryAssignment;
      })
      .addCase(rejectNotaryAssignment.rejected, (state, action) => {
        state.notaryAssignmentActionStatus = "error";
        state.notaryAssignmentActionError = action.payload || "Unable to reject assignment.";
      })
      .addCase(startNotaryAssignment.pending, (state) => {
        state.notaryAssignmentActionStatus = "loading";
        state.notaryAssignmentActionError = null;
      })
      .addCase(startNotaryAssignment.fulfilled, (state, action) => {
        state.notaryAssignmentActionStatus = "ready";
        state.activeNotaryAssignment = action.payload || state.activeNotaryAssignment;
      })
      .addCase(startNotaryAssignment.rejected, (state, action) => {
        state.notaryAssignmentActionStatus = "error";
        state.notaryAssignmentActionError = action.payload || "Unable to start assignment.";
      })
      .addCase(completeNotaryAssignment.pending, (state) => {
        state.notaryAssignmentActionStatus = "loading";
        state.notaryAssignmentActionError = null;
      })
      .addCase(completeNotaryAssignment.fulfilled, (state, action) => {
        state.notaryAssignmentActionStatus = "ready";
        state.activeNotaryAssignment = action.payload || state.activeNotaryAssignment;
      })
      .addCase(completeNotaryAssignment.rejected, (state, action) => {
        state.notaryAssignmentActionStatus = "error";
        state.notaryAssignmentActionError = action.payload || "Unable to complete assignment.";
      })
      .addCase(sendPortalMessage.pending, (state) => {
        state.messageActionStatus = "loading";
        state.messageActionError = null;
      })
      .addCase(sendPortalMessage.fulfilled, (state, action) => {
        state.messageActionStatus = "ready";
        state.messages.push(action.payload);
      })
      .addCase(sendPortalMessage.rejected, (state, action) => {
        state.messageActionStatus = "error";
        state.messageActionError = action.payload || "Unable to send message.";
      })
      .addCase(uploadPortalAttachments.pending, (state) => {
        state.messageActionStatus = "loading";
        state.messageActionError = null;
      })
      .addCase(uploadPortalAttachments.fulfilled, (state, action) => {
        state.messageActionStatus = "ready";
        state.messages.push(action.payload);
      })
      .addCase(uploadPortalAttachments.rejected, (state, action) => {
        state.messageActionStatus = "error";
        state.messageActionError = action.payload || "Unable to upload attachments.";
      })
      .addCase(markPortalMessageRead.fulfilled, (state, action) => {
        state.messages = state.messages.map((message) =>
          message.id === action.payload?.id ? action.payload : message
        );
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
      })
      .addCase(fetchNotaryProfileDetails.pending, (state) => {
        state.notaryProfileDetailsStatus = "loading";
        state.notaryProfileDetailsError = null;
      })
      .addCase(fetchNotaryProfileDetails.fulfilled, (state, action) => {
        state.notaryProfileDetails = action.payload || null;
        state.notaryProfileDetailsStatus = "ready";
        state.notaryProfileDetailsError = null;
      })
      .addCase(fetchNotaryProfileDetails.rejected, (state, action) => {
        state.notaryProfileDetails = null;
        state.notaryProfileDetailsStatus = "error";
        state.notaryProfileDetailsError = action.payload || "Unable to load profile details.";
      })
      .addCase(updateNotaryProfile.pending, (state) => {
        state.notaryProfileSaveStatus = "loading";
        state.notaryProfileSaveError = null;
      })
      .addCase(updateNotaryProfile.fulfilled, (state) => {
        state.notaryProfileSaveStatus = "ready";
      })
      .addCase(updateNotaryProfile.rejected, (state, action) => {
        state.notaryProfileSaveStatus = "error";
        state.notaryProfileSaveError = action.payload || "Unable to update profile.";
      })
      .addCase(updateNotaryProfileDetails.pending, (state) => {
        state.notaryProfileSaveStatus = "loading";
        state.notaryProfileSaveError = null;
      })
      .addCase(updateNotaryProfileDetails.fulfilled, (state, action) => {
        state.notaryProfileSaveStatus = "ready";
        state.notaryProfileDetails = action.payload || state.notaryProfileDetails;
      })
      .addCase(updateNotaryProfileDetails.rejected, (state, action) => {
        state.notaryProfileSaveStatus = "error";
        state.notaryProfileSaveError = action.payload || "Unable to update profile details.";
      })
      .addCase(uploadNotaryAvatar.pending, (state) => {
        state.notaryAvatarUploadStatus = "loading";
        state.notaryAvatarUploadError = null;
      })
      .addCase(uploadNotaryAvatar.fulfilled, (state) => {
        state.notaryAvatarUploadStatus = "ready";
      })
      .addCase(uploadNotaryAvatar.rejected, (state, action) => {
        state.notaryAvatarUploadStatus = "error";
        state.notaryAvatarUploadError = action.payload || "Unable to upload profile photo.";
      })
      .addCase(uploadNotaryVerificationDocument.pending, (state) => {
        state.notaryVerificationUploadStatus = "loading";
        state.notaryVerificationUploadError = null;
      })
      .addCase(uploadNotaryVerificationDocument.fulfilled, (state, action) => {
        state.notaryVerificationUploadStatus = "ready";
        state.notaryProfileDetails = action.payload || state.notaryProfileDetails;
      })
      .addCase(uploadNotaryVerificationDocument.rejected, (state, action) => {
        state.notaryVerificationUploadStatus = "error";
        state.notaryVerificationUploadError = action.payload || "Unable to upload verification document.";
      })
      .addCase(submitNotaryVerificationForReview.pending, (state) => {
        state.notaryVerificationSubmitStatus = "loading";
        state.notaryVerificationSubmitError = null;
      })
      .addCase(submitNotaryVerificationForReview.fulfilled, (state, action) => {
        state.notaryVerificationSubmitStatus = "ready";
        state.notaryProfileDetails = action.payload || state.notaryProfileDetails;
      })
      .addCase(submitNotaryVerificationForReview.rejected, (state, action) => {
        state.notaryVerificationSubmitStatus = "error";
        state.notaryVerificationSubmitError = action.payload || "Unable to submit verification for review.";
      })
      .addCase(fetchNotaryNotificationPreferences.pending, (state) => {
        state.notaryNotificationPreferencesStatus = "loading";
        state.notaryNotificationPreferencesError = null;
      })
      .addCase(fetchNotaryNotificationPreferences.fulfilled, (state, action) => {
        state.notaryNotificationPreferences = action.payload || null;
        state.notaryNotificationPreferencesStatus = "ready";
        state.notaryNotificationPreferencesError = null;
      })
      .addCase(fetchNotaryNotificationPreferences.rejected, (state, action) => {
        state.notaryNotificationPreferences = null;
        state.notaryNotificationPreferencesStatus = "error";
        state.notaryNotificationPreferencesError = action.payload || "Unable to load notification preferences.";
      })
      .addCase(saveNotaryNotificationPrefs.pending, (state) => {
        state.notaryNotificationSaveStatus = "loading";
        state.notaryNotificationSaveError = null;
      })
      .addCase(saveNotaryNotificationPrefs.fulfilled, (state, action) => {
        state.notaryNotificationSaveStatus = "ready";
        state.notaryNotificationPreferences = action.payload || state.notaryNotificationPreferences;
      })
      .addCase(saveNotaryNotificationPrefs.rejected, (state, action) => {
        state.notaryNotificationSaveStatus = "error";
        state.notaryNotificationSaveError = action.payload || "Unable to save notification preferences.";
      })
      .addCase(fetchPortalNotifications.pending, (state) => {
        state.notificationsStatus = "loading";
        state.notificationsError = null;
      })
      .addCase(fetchPortalNotifications.fulfilled, (state, action) => {
        const list = Array.isArray(action.payload) ? action.payload : [];
        state.notifications = list;
        state.notificationsUnreadCount = list.filter((item) => !item.read).length;
        state.notificationsStatus = "ready";
        state.notificationsError = null;
      })
      .addCase(fetchPortalNotifications.rejected, (state, action) => {
        state.notifications = [];
        state.notificationsStatus = "error";
        state.notificationsError = action.payload || "Unable to load notifications.";
      })
      .addCase(markPortalNotificationRead.pending, (state) => {
        state.notificationActionStatus = "loading";
        state.notificationActionError = null;
      })
      .addCase(markPortalNotificationRead.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated && updated.id) {
          state.notifications = state.notifications.map((item) =>
            item.id === updated.id ? { ...item, ...updated } : item
          );
          state.notificationsUnreadCount = state.notifications.filter(
            (item) => !item.read
          ).length;
        }
        state.notificationActionStatus = "ready";
      })
      .addCase(markPortalNotificationRead.rejected, (state, action) => {
        state.notificationActionStatus = "error";
        state.notificationActionError =
          action.payload || "Unable to mark notification as read.";
      })
      .addCase(markAllPortalNotificationsRead.pending, (state) => {
        state.notificationActionStatus = "loading";
        state.notificationActionError = null;
      })
      .addCase(markAllPortalNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((item) => ({
          ...item,
          read: true,
        }));
        state.notificationsUnreadCount = 0;
        state.notificationActionStatus = "ready";
      })
      .addCase(markAllPortalNotificationsRead.rejected, (state, action) => {
        state.notificationActionStatus = "error";
        state.notificationActionError =
          action.payload || "Unable to mark all notifications as read.";
      });
  },
});

export const sitePortalReducer = sitePortalSlice.reducer;
export const selectSitePortal = (state) => state.sitePortal;
