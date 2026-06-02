"use client";

import { useParams } from "next/navigation";
import LiveRoutePlaceholder from "@/components/portal/LiveRoutePlaceholder";

export default function DocumentPage() {
  const params = useParams();

  return (
    <LiveRoutePlaceholder
      title="Document Preview Not Integrated Yet"
      description="This document route used to render a hardcoded preview with sample identities. It now stays empty until a real document viewer is connected."
      routeId={params?.id}
      kind="document"
    />
  );
}
