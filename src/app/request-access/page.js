import { Suspense } from "react";
import RequestAccessForm from "@/components/contact_page/RequestAccessForm";

export default function RequestAccessPage() {
  return (
    <Suspense fallback={null}>
      <RequestAccessForm />
    </Suspense>
  );
}
