import { CreditCard, Clock, FileText, BarChart3, TrendingUp } from "lucide-react";

const stats = [
  { 
    label: "TOTAL PAID", 
    value: "$42,850.00", 
    trend: "+12%", 
    icon: CreditCard, 
    color: "text-[#1a4fdb]", 
    bg: "bg-blue-50",
    badge: null
  },
  { 
    label: "PENDING PAYMENTS", 
    value: "$5,240.00", 
    trend: null, 
    icon: Clock, 
    color: "text-zinc-600", 
    bg: "bg-zinc-100",
    badge: { text: "8 Active", color: "bg-blue-50 text-blue-600" }
  },
  { 
    label: "PARTIAL PAYMENTS", 
    value: "$2,100.50", 
    trend: null, 
    icon: FileText, 
    color: "text-orange-500", 
    bg: "bg-orange-50",
    badge: { text: "3 Invoices", color: "bg-orange-50 text-orange-600" }
  },
  { 
    label: "TOTAL ORDER VALUE", 
    value: "$50,190.50", 
    trend: null, 
    icon: BarChart3, 
    color: "text-purple-500", 
    bg: "bg-purple-50",
    badge: { text: "YTD", color: "bg-[#1a4fdb] text-white" }
  },
];

export default function PaymentsStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white border border-zinc-100 p-6 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {stat.trend && (
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            )}
            {stat.badge && (
              <div className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${stat.badge.color}`}>
                {stat.badge.text}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-bold text-zinc-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
