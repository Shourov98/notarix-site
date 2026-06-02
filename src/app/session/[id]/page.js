"use client";

import { useParams } from "next/navigation";
import LiveRoutePlaceholder from "@/components/portal/LiveRoutePlaceholder";

export default function SessionPage() {
  const params = useParams();

  return (
    <LiveRoutePlaceholder
      title="Client Session View Not Integrated Yet"
      description="This route used to show a sample signing session with hardcoded participants. It now stays neutral until a real live session viewer is connected to backend session data."
      routeId={params?.id}
      kind="session"
    />
  );
}
