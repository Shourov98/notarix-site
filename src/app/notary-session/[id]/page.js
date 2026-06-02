"use client";

import { useParams } from "next/navigation";
import LiveRoutePlaceholder from "@/components/portal/LiveRoutePlaceholder";

export default function NotarySessionPage() {
  const params = useParams();

  return (
    <LiveRoutePlaceholder
      title="Notary Session View Not Integrated Yet"
      description="This route previously displayed sample notary session data. It now avoids mock participants until a real live session experience is backed by the API."
      routeId={params?.id}
      kind="session"
    />
  );
}
