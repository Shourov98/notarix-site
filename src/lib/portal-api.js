"use client";

const DEFAULT_API_BASE_URL = "http://localhost:5191";
const DEFAULT_API_PREFIX = "/api/v1";
const PORTAL_SESSION_KEY = "notarix_portal_session";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;
export const API_PREFIX =
  process.env.NEXT_PUBLIC_API_PREFIX?.trim() || DEFAULT_API_PREFIX;

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL.replace(/\/+$/, "")}${API_PREFIX}${normalizedPath}`;
};

export const extractApiErrorMessage = (payload) => {
  if (typeof payload?.error?.message === "string" && payload.error.message.trim()) {
    return payload.error.message;
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  return "Request failed.";
};

export const requestJson = async (path, options = {}) => {
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(extractApiErrorMessage(payload));
  }

  return payload?.data || payload;
};

export const savePortalSession = (session) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PORTAL_SESSION_KEY, JSON.stringify(session));
};

export const getPortalSession = () => {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(PORTAL_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};
