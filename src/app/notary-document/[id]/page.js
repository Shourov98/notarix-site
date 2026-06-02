"use client";

import { useParams } from "next/navigation";
import LiveRoutePlaceholder from "@/components/portal/LiveRoutePlaceholder";

export default function NotaryDocumentPage() {
  const params = useParams();

  return (
    <LiveRoutePlaceholder
      title="Notary Document Preview Not Integrated Yet"
      description="This route no longer shows sample borrower or notary data. It will remain neutral until a real backend-driven document preview is implemented."
      routeId={params?.id}
      kind="document"
    />
  );
}
