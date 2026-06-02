"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { requestPortalJson } from "@/lib/portal-api";

const ClientPortalContext = createContext(null);

const DEFAULT_OVERVIEW = {
  profile: null,
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    outstandingPayments: "$0.00",
  },
  documents: [],
  recentOrders: [],
};

export function ClientPortalProvider({ children }) {
  const [overview, setOverview] = useState(DEFAULT_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      setLoading(true);
      setError("");

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => {
        controller.abort(new Error("Client dashboard request timed out."));
      }, 15000);

      try {
        const payload = await requestPortalJson("/site/client/overview", {
          signal: controller.signal,
        });

        if (!cancelled) {
          setOverview({
            ...DEFAULT_OVERVIEW,
            ...payload,
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          const message =
            loadError?.name === "AbortError"
              ? "Client dashboard took too long to load. Please refresh and try again."
              : loadError.message || "Unable to load dashboard data.";
          setError(message);
        }
      } finally {
        window.clearTimeout(timeoutId);
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadOverview();

    const handleRefresh = () => {
      loadOverview();
    };
    window.addEventListener("notarix:profile-updated", handleRefresh);

    return () => {
      cancelled = true;
      window.removeEventListener("notarix:profile-updated", handleRefresh);
    };
  }, []);

  const value = useMemo(
    () => ({
      overview,
      loading,
      error,
      profile: overview?.profile || null,
      stats: overview?.stats || DEFAULT_OVERVIEW.stats,
      documents: overview?.documents || [],
      recentOrders: overview?.recentOrders || [],
    }),
    [error, loading, overview]
  );

  return (
    <ClientPortalContext.Provider value={value}>
      {children}
    </ClientPortalContext.Provider>
  );
}

export function useClientPortal() {
  const context = useContext(ClientPortalContext);

  if (!context) {
    throw new Error("useClientPortal must be used inside ClientPortalProvider.");
  }

  return context;
}
