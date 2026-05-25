"use client";

import { useEffect } from "react";
import DashboardOverview from "@/components/dashboard-notary/dashboard/DashboardOverview";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNotaryOverview, selectSitePortal } from "@/store/sitePortalSlice";

export default function DashboardNotaryPage() {
  const dispatch = useAppDispatch();
  const { notaryOverview } = useAppSelector(selectSitePortal);

  useEffect(() => {
    dispatch(fetchNotaryOverview());
  }, [dispatch]);

  return (
    <DashboardOverview
      stats={notaryOverview?.stats}
      assignments={notaryOverview?.assignments}
      requests={notaryOverview?.requests}
    />
  );
}
