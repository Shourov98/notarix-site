import { FileText, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

const defaultStats = [
  { label: "TOTAL ORDERS", value: "124", trend: "+ 12% from last month", icon: FileText, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
  { label: "ACTIVE ORDERS", value: "12", trend: "6 due this week", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "COMPLETED ORDERS", value: "108", trend: "98% satisfaction rate", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  { label: "PENDING ORDERS", value: "4", trend: "Awaiting signature", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
];

const iconByLabel = {
  "TOTAL ORDERS": FileText,
  "ACTIVE ORDERS": Clock,
  "COMPLETED ORDERS": CheckCircle2,
  "PENDING ORDERS": AlertCircle,
};

const toneMap = {
  primary: { color: "text-[#1a4fdb]", bg: "bg-blue-50" },
  warning: { color: "text-amber-500", bg: "bg-amber-50" },
  success: { color: "text-emerald-500", bg: "bg-emerald-50" },
  danger: { color: "text-rose-500", bg: "bg-rose-50" },
};

const normalizeStats = (stats) => {
  if (Array.isArray(stats)) {
    return stats;
  }

  if (!stats || typeof stats !== "object") {
    return defaultStats;
  }

  return [
    {
      label: "TOTAL ORDERS",
      value: stats.totalOrders ?? "0",
      trend: "All orders",
      icon: FileText,
      tone: "primary",
    },
    {
      label: "ACTIVE ORDERS",
      value: stats.pendingOrders ?? "0",
      trend: "Pending review or in progress",
      icon: Clock,
      tone: "warning",
    },
    {
      label: "COMPLETED ORDERS",
      value: stats.completedOrders ?? "0",
      trend: "Completed successfully",
      icon: CheckCircle2,
      tone: "success",
    },
    {
      label: "OUTSTANDING PAYMENTS",
      value: stats.outstandingPayments ?? "$0.00",
      trend: "Awaiting payment",
      icon: AlertCircle,
      tone: "danger",
    },
  ];
};

export default function StatsOverview({ stats = defaultStats }) {
  const normalizedStats = normalizeStats(stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {normalizedStats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-zinc-900">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bg || toneMap[stat.tone]?.bg || "bg-blue-50"}`}>
              {(stat.icon || iconByLabel[stat.label]) ? (
                (() => {
                  const Icon = stat.icon || iconByLabel[stat.label];
                  return <Icon className={`w-5 h-5 ${stat.color || toneMap[stat.tone]?.color || "text-[#1a4fdb]"}`} />;
                })()
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stat.label === "TOTAL ORDERS" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
            <p className={`text-xs font-medium ${stat.label === "TOTAL ORDERS" ? "text-emerald-500" : "text-gray-700"}`}>
              {stat.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
