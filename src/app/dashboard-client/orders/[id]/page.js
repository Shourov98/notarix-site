"use client";

import { useParams } from "next/navigation";
import NCOrderView from "./NCOrderView";
import RONOrderView from "./RONOrderView";

export default function OrderDetailsRouter() {
  const params = useParams();
  const id = params?.id || "";

  // If the order ID contains 'RON', show the Remote Online Notary view
  if (id.includes("RON")) {
    return <RONOrderView id={id} />;
  }

  // Otherwise, show the default Notary Closing (NC) view
  return <NCOrderView id={id} />;
}
