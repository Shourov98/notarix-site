"use client";

import { useEffect } from "react";
import AssignmentsOrdersPage from "@/components/dashboard-notary/assignments-orders/AssignmentsOrdersPage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNotaryOverview, selectSitePortal } from "@/store/sitePortalSlice";

export default function NotaryAssignmentsOrdersPage() {
  const dispatch = useAppDispatch();
  const { notaryOverview } = useAppSelector(selectSitePortal);

  useEffect(() => {
    dispatch(fetchNotaryOverview());
  }, [dispatch]);

  return (
    <AssignmentsOrdersPage
      stats={notaryOverview?.assignmentOrderStats}
      rows={notaryOverview?.assignmentOrders}
    />
  );
}
