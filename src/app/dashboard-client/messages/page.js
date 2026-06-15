"use client";

import { Suspense } from "react";
import PortalMessagesPage from "@/components/portal/PortalMessagesPage";

export default function ClientMessagesPage() {
  return (
    <Suspense fallback={<div className="py-12 text-sm text-gray-700">Loading messages...</div>}>
      <PortalMessagesPage roleLabel="Client" />
    </Suspense>
  );
}
