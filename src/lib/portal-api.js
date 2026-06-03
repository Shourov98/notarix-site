"use client";

const DEFAULT_API_BASE_URL = "http://localhost:5191";
const DEFAULT_API_PREFIX = "/api/v1";
const PORTAL_SESSION_KEY = "notarix_portal_session";
const portalGetCache = new Map();

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
  const hasFormDataBody = options.body instanceof FormData;
  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers: {
      ...(hasFormDataBody ? {} : { "Content-Type": "application/json" }),
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

export const clearPortalSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PORTAL_SESSION_KEY);
  portalGetCache.clear();
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

export const getPortalAccessToken = () => getPortalSession()?.accessToken || "";

export const requestPortalJson = async (path, options = {}) => {
  const accessToken = getPortalAccessToken();

  return requestJson(path, {
    ...options,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(options.headers || {}),
    },
  });
};

export const requestPortalJsonOnce = async (path) => {
  const cacheKey = `${getPortalAccessToken()}::${path}`;
  const cached = portalGetCache.get(cacheKey);

  if (cached?.data) {
    return cached.data;
  }

  if (cached?.promise) {
    return cached.promise;
  }

  const promise = requestPortalJson(path)
    .then((data) => {
      portalGetCache.set(cacheKey, { data });
      return data;
    })
    .catch((error) => {
      portalGetCache.delete(cacheKey);
      throw error;
    });

  portalGetCache.set(cacheKey, { promise });
  return promise;
};

export const invalidatePortalCache = (path) => {
  const token = getPortalAccessToken();
  if (!token) {
    portalGetCache.clear();
    return;
  }

  for (const key of portalGetCache.keys()) {
    if (!key.startsWith(`${token}::`)) continue;
    if (!path || key === `${token}::${path}`) {
      portalGetCache.delete(key);
    }
  }
};

export const logoutPortalSession = async () => {
  const session = getPortalSession();

  try {
    if (session?.refreshToken) {
      await requestPortalJson("/site/auth/logout", {
        method: "POST",
        body: JSON.stringify({
          refreshToken: session.refreshToken,
        }),
      });
    }
  } catch {
    // Clear local state even if the backend logout request fails.
  } finally {
    clearPortalSession();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notarix:profile-updated"));
    }
  }
};
