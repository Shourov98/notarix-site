import { FileText, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { useMemo } from "react";

const ACTIVE_STATUSES = new Set([
  "Pending Admin Review",
  "Accepted By Admin",
  "Notary Assigned",
  "Accepted By Notary",
  "In Progress",
  "Needs Reassignment",
]);

const COMPLETED_STATUSES = new Set(["Completed"]);
const PENDING_STATUSES = new Set(["Pending Admin Review"]);

const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const computeStatsFromOrders = (orders) => {
  const list = Array.isArray(orders) ? orders : [];
  const total = list.length;
  let active = 0;
  let completed = 0;
  let pending = 0;
  let outstandingPayments = 0;

  for (const order of list) {
    const status = String(order?.status || "").trim();
    if (ACTIVE_STATUSES.has(status)) active += 1;
    if (COMPLETED_STATUSES.has(status)) completed += 1;
    if (PENDING_STATUSES.has(status)) pending += 1;

    const paymentStatus = String(order?.paymentStatus || "").trim();
    const feeAmount = Number(order?.feeAmount) || 0;
    if (feeAmount > 0 && paymentStatus && paymentStatus.toLowerCase() !== "paid") {
      outstandingPayments += feeAmount;
    }
  }

  return { totalOrders: total, activeOrders: active, completedOrders: completed, pendingOrders: pending, outstandingPayments };
};

export default function StatsOverview({ stats, orders }) {
  const computed = useMemo(() => {
    if (stats && typeof stats === "object" && !Array.isArray(stats)) {
      return {
        totalOrders: stats.totalOrders ?? (Array.isArray(orders) ? orders.length : 0),
        activeOrders: stats.activeOrders ?? stats.pendingOrders ?? 0,
        completedOrders: stats.completedOrders ?? 0,
        pendingOrders: stats.pendingOrders ?? stats.activeOrders ?? 0,
        outstandingPayments:
          stats.outstandingPayments !== undefined ? stats.outstandingPayments : 0,
      };
    }
    return computeStatsFromOrders(orders);
  }, [stats, orders]);

  const cards = [
    {
      label: "TOTAL ORDERS",
      value: String(computed.totalOrders ?? 0),
      trend: "All orders",
      Icon: FileText,
      tone: "primary",
    },
    {
      label: "ACTIVE ORDERS",
      value: String(computed.activeOrders ?? 0),
      trend: "Pending or in progress",
      Icon: Clock,
      tone: "warning",
    },
    {
      label: "COMPLETED ORDERS",
      value: String(computed.completedOrders ?? 0),
      trend: "Completed successfully",
      Icon: CheckCircle2,
      tone: "success",
    },
    {
      label: "OUTSTANDING PAYMENTS",
      value: formatCurrency(computed.outstandingPayments),
      trend: "Awaiting payment",
      Icon: AlertCircle,
      tone: "danger",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map(({ label, value, trend, Icon, tone }) => {
        const { color, bg } = toneMap[tone] || toneMap.primary;
        const isTotal = label === "TOTAL ORDERS";
        return (
          <div
            key={label}
            className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">{label}</p>
                <h3 className="text-3xl font-bold text-zinc-900">{value}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isTotal ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : null}
              <p className={`text-xs font-medium ${isTotal ? "text-emerald-500" : "text-gray-700"}`}>
                {trend}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const toneMap = {
  primary: { color: "text-[#1a4fdb]", bg: "bg-blue-50" },
  warning: { color: "text-amber-500", bg: "bg-amber-50" },
  success: { color: "text-emerald-500", bg: "bg-emerald-50" },
  danger: { color: "text-rose-500", bg: "bg-rose-50" },
};
