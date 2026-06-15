import { readPortalSession } from "@/lib/portalSession";

const buildBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5191";
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";
  return `${baseUrl.replace(/\/+$/, "")}${prefix.replace(/\/+$/, "")}`;
};

const requestJson = async (path, options = {}) => {
  const { authMode = "none", ...fetchOptions } = options;
  const headers = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };

  if (authMode === "portal" && typeof window !== "undefined") {
    const session = readPortalSession();
    if (session?.accessToken) {
      headers.Authorization = `Bearer ${session.accessToken}`;
    }
  }

  const response = await fetch(`${buildBaseUrl()}${path}`, {
    ...fetchOptions,
    headers,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || payload?.message || "Request failed."
    );
  }

  return payload?.data || payload;
};

const resolveDashboardPath = (role) => {
  const normalized = String(role || "").trim().toLowerCase();
  if (normalized === "client") {
    return "/dashboard-client";
  }
  if (normalized === "notary") {
    return "/dashboard-notary";
  }
  return "/";
};

export const getClientOverview = async () =>
  requestJson("/site/client/overview", {
    authMode: "portal",
  });
export const getNotaryOverview = async () =>
  requestJson("/site/notary/overview", {
    authMode: "portal",
  });
export const getSiteDocument = async (id) => requestJson(`/site/documents/${id}`);
export const getSiteSession = async (id) => requestJson(`/site/sessions/${id}`);
export const getClientBankInfo = async () =>
  requestJson("/site/client/bank-info", {
    authMode: "portal",
  });
export const getNotaryBankInfo = async () =>
  requestJson("/site/notary/bank-info", {
    authMode: "portal",
  });
export const getClientPayments = async () =>
  requestJson("/site/client/payments", {
    authMode: "portal",
  });
export const getNotaryPayments = async () =>
  requestJson("/site/notary/payments", {
    authMode: "portal",
  });
export const saveClientBankInfo = async (body, method = "POST") =>
  requestJson("/site/client/bank-info", {
    method,
    body: JSON.stringify(body),
    authMode: "portal",
  });
export const saveNotaryBankInfo = async (body, method = "POST") =>
  requestJson("/site/notary/bank-info", {
    method,
    body: JSON.stringify(body),
    authMode: "portal",
  });

export const createClientOrder = async (body) =>
  requestJson("/site/orders", {
    method: "POST",
    body: JSON.stringify(body),
    authMode: "portal",
  });

export const getClientOrders = async () =>
  requestJson("/site/client/orders", {
    authMode: "portal",
  });

export const getClientOrder = async (orderId) =>
  requestJson(`/site/client/orders/${String(orderId).replace(/^#/, "")}`, {
    authMode: "portal",
  });

export const getNotaryAssignments = async (query = {}) =>
  requestJson(`/site/notary/assignments${Object.keys(query).length ? `?${new URLSearchParams(query).toString()}` : ""}`, {
    authMode: "portal",
  });

export const getNotaryAssignment = async (orderId) =>
  requestJson(`/site/notary/assignments/${String(orderId).replace(/^#/, "")}`, {
    authMode: "portal",
  });

export const acceptNotaryAssignment = async (orderId, body = {}) =>
  requestJson(`/site/notary/orders/${String(orderId).replace(/^#/, "")}/accept`, {
    method: "PATCH",
    body: JSON.stringify(body),
    authMode: "portal",
  });

export const rejectNotaryAssignment = async (orderId, body) =>
  requestJson(`/site/notary/orders/${String(orderId).replace(/^#/, "")}/reject`, {
    method: "PATCH",
    body: JSON.stringify(body),
    authMode: "portal",
  });

export const startNotaryAssignment = async (orderId, body = {}) =>
  requestJson(`/site/notary/orders/${String(orderId).replace(/^#/, "")}/start`, {
    method: "PATCH",
    body: JSON.stringify(body),
    authMode: "portal",
  });

export const completeNotaryAssignment = async (orderId, body = {}) =>
  requestJson(`/site/notary/orders/${String(orderId).replace(/^#/, "")}/complete`, {
    method: "PATCH",
    body: JSON.stringify(body),
    authMode: "portal",
  });

export const getPortalConversations = async () =>
  requestJson("/conversations", {
    authMode: "portal",
  });

export const getPortalConversationByOrder = async (orderId) =>
  requestJson(`/conversations/order/${String(orderId).replace(/^#/, "")}`, {
    authMode: "portal",
  });

export const getPortalMessages = async (conversationId) =>
  requestJson(`/conversations/${conversationId}/messages`, {
    authMode: "portal",
  });

export const sendPortalMessage = async (conversationId, body) =>
  requestJson(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
    authMode: "portal",
  });

export const markPortalMessageRead = async (messageId) =>
  requestJson(`/messages/${messageId}/read`, {
    method: "PATCH",
    authMode: "portal",
  });

export const uploadClientOrderDocuments = async (orderId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("documents", file);
  });

  const session = typeof window !== "undefined" ? readPortalSession() : null;
  const headers = session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {};

  const response = await fetch(`${buildBaseUrl()}/site/orders/${orderId}/documents`, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || payload?.message || "Upload failed."
    );
  }

  return payload?.data || payload;
};

export const uploadNotaryCompletedDocuments = async (orderId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("documents", file);
  });

  const session = typeof window !== "undefined" ? readPortalSession() : null;
  const headers = session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {};

  const response = await fetch(`${buildBaseUrl()}/site/notary/orders/${String(orderId).replace(/^#/, "")}/completed-documents`, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || payload?.message || "Upload failed."
    );
  }

  return payload?.data || payload;
};

export const uploadPortalAttachments = async (conversationId, files, body = "") => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("attachments", file);
  });
  if (body) {
    formData.append("body", body);
  }

  const session = typeof window !== "undefined" ? readPortalSession() : null;
  const headers = session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {};

  const response = await fetch(`${buildBaseUrl()}/conversations/${conversationId}/attachments`, {
    method: "POST",
    headers,
    body: formData,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || payload?.message || "Upload failed."
    );
  }

  return payload?.data || payload;
};

export const submitAccessRequest = async (body) =>
  requestJson("/requests", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const loginPortalUser = async (body) => {
  const data = await requestJson("/site/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    ...data,
    dashboardPath: resolveDashboardPath(data?.role || body?.role),
  };
};

export const resetPortalFirstLoginPassword = async (body) =>
  requestJson("/site/auth/reset-password", {
    method: "PATCH",
    body: JSON.stringify(body),
    authMode: "portal",
  });
