const buildBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5191";
  const prefix = process.env.NEXT_PUBLIC_API_PREFIX || "/api/v1";
  return `${baseUrl.replace(/\/+$/, "")}${prefix.replace(/\/+$/, "")}`;
};

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${buildBaseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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

const roleDashboardMap = {
  Client: "/dashboard-client",
  Notary: "/dashboard-notary",
};

export const getClientOverview = async () => requestJson("/site/client/overview");
export const getNotaryOverview = async () => requestJson("/site/notary/overview");
export const getSiteDocument = async (id) => requestJson(`/site/documents/${id}`);
export const getSiteSession = async (id) => requestJson(`/site/sessions/${id}`);
export const getClientBankInfo = async () => requestJson("/site/client/bank-info");
export const getNotaryBankInfo = async () => requestJson("/site/notary/bank-info");
export const saveClientBankInfo = async (body, method = "POST") =>
  requestJson("/site/client/bank-info", {
    method,
    body: JSON.stringify(body),
  });
export const saveNotaryBankInfo = async (body, method = "POST") =>
  requestJson("/site/notary/bank-info", {
    method,
    body: JSON.stringify(body),
  });

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
    dashboardPath: roleDashboardMap[data?.role] || "/",
  };
};
