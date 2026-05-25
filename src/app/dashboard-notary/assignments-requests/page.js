"use client";

import { useEffect } from "react";
import AssignmentRequestsPage from "@/components/dashboard-notary/assignments-requests/AssignmentRequestsPage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNotaryOverview, selectSitePortal } from "@/store/sitePortalSlice";

export default function NotaryAssignmentsRequestsPage() {
  const dispatch = useAppDispatch();
  const { notaryOverview } = useAppSelector(selectSitePortal);

  useEffect(() => {
    dispatch(fetchNotaryOverview());
  }, [dispatch]);

  return <AssignmentRequestsPage requests={notaryOverview?.requests} />;
}
