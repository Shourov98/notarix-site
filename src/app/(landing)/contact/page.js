import { Suspense } from "react";
import RequestAccessForm from "@/components/contact_page/RequestAccessForm";

export default function ContactPage() {
  return (
    <main>
      <Suspense fallback={null}>
        <RequestAccessForm />
      </Suspense>
    </main>
  );
}
