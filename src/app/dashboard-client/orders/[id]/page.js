"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchClientOrder, selectSitePortal } from "@/store/sitePortalSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import NCOrderView from "./NCOrderView";
import RONOrderView from "./RONOrderView";

export default function ClientOrderDetailsPage() {
  const params = useParams();
  const id = params?.id || "";
  const dispatch = useAppDispatch();
  const { activeClientOrder, activeClientOrderStatus, activeClientOrderError } =
    useAppSelector(selectSitePortal);

  useEffect(() => {
    if (id) {
      dispatch(fetchClientOrder(id));
    }
  }, [dispatch, id]);

  if (activeClientOrderStatus === "loading" && !activeClientOrder) {
    return (
      <div className="mx-auto max-w-5xl py-12 text-sm text-zinc-600">
        Loading order details...
      </div>
    );
  }

  if (!activeClientOrder) {
    return (
      <div className="space-y-4">
        <div className="mx-auto max-w-5xl rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {activeClientOrderError || "Order not found."}
        </div>
        <div>
          <Link
            href="/dashboard-client/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return activeClientOrder.isRon ? (
    <RONOrderView order={activeClientOrder} />
  ) : (
    <NCOrderView order={activeClientOrder} />
  );
}