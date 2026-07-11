"use client";

import { useEffect } from "react";
import DocumentsTable from "@/components/dashboard-client/DocumentsTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClientDocuments, selectSitePortal } from "@/store/sitePortalSlice";

export default function DocumentsPage() {
  const dispatch = useAppDispatch();
  const { clientDocuments, clientDocumentsStatus, clientDocumentsError } =
    useAppSelector(selectSitePortal);

  useEffect(() => {
    dispatch(fetchClientDocuments());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Documents</h1>
        <p className="text-gray-700 font-medium text-sm">Manage and access all uploaded files within the secure registry.</p>
      </div>

      {/* Documents Table */}
      <DocumentsTable
        documents={clientDocuments}
        status={clientDocumentsStatus}
        error={clientDocumentsError}
        currentActorRole="CLIENT"
      />
    </div>
  );
}
