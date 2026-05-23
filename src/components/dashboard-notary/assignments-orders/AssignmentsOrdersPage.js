import { Calendar, Eye, Filter, Hourglass, MoreVertical, Search, SquareChartGantt, Timer, WalletCards } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Total", value: "124", sub: "Assigned orders", icon: SquareChartGantt },
  { label: "Pending", value: "12", sub: "Awaiting acceptance", icon: Hourglass },
  { label: "In Progress", value: "43", sub: "Currently active", icon: Timer },
  { label: "Completed", value: "69", sub: "Successfully signed", icon: WalletCards },
];

const rows = [
  { id: "RON-9402", orderType: "RON", title: "Sarah Mitchell", borrower: "Sarah Mitchell", location: "Austin, TX-12546", date: "Apr 24 2026", fee: "$150.00", status: "In Progress", tone: "bg-orange-50 text-orange-600", action: "Start Session" },
  { id: "IP-8210", orderType: "In-Person", title: "James Rodriguez", borrower: "James Rodriguez", location: "Miami, FL-12546", date: "Apr 24 2026", fee: "$225.00", status: "Pending", tone: "bg-amber-50 text-amber-600", action: "Accept" },
  { id: "RON-7104", orderType: "RON", title: "Elena Vance", borrower: "Elena Vance", location: "Seattle, WA12546", date: "Apr 24 2026", fee: "$150.00", status: "Completed", tone: "bg-emerald-50 text-emerald-600", action: "View" },
  { id: "IP-5502", orderType: "In-Person", title: "Kevin Baker", borrower: "Kevin Baker", location: "Chicago, IL-12546", date: "Apr 24 2026", fee: "$195.00", status: "Accepted", tone: "bg-blue-50 text-blue-600", action: "View" },
];

export default function AssignmentsOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Assignments</h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">Manage your assigned orders and verification workflow</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full sm:w-64 pl-11 pr-4 py-3 bg-white border border-indigo-100 rounded-2xl focus:outline-none focus:border-[#2c49df]"
            />
          </div>
          <button className="px-5 py-3 bg-white border border-indigo-100 rounded-2xl text-zinc-700 font-medium flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-5 py-3 bg-white border border-indigo-100 rounded-2xl text-zinc-900 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            This Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2c49df] flex items-center justify-center">
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{stat.value}</p>
            <p className="mt-2 text-sm font-medium text-zinc-500">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-zinc-50">
              <tr className="text-left text-zinc-500">
                {["Order ID", "Order Type", "Title Company&apos;s Name", "Borrower Name", "Location", "Date & Time", "Fee", "Status", "Actions"].map((head) => (
                  <th key={head} className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-zinc-100">
                  <td className="px-6 py-6">
                    <Link href={`/dashboard-notary/assignments-orders/${row.id}`} className="text-[#2c49df] font-bold hover:underline">
                      #{row.id}
                    </Link>
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-sm font-bold">
                      {row.orderType}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-zinc-700">{row.title}</td>
                  <td className="px-6 py-6 text-sm font-bold text-zinc-700">{row.borrower}</td>
                  <td className="px-6 py-6 text-sm font-medium text-zinc-500">{row.location}</td>
                  <td className="px-6 py-6 text-sm font-medium text-zinc-500">{row.date}</td>
                  <td className="px-6 py-6 text-zinc-900 font-bold">{row.fee}</td>
                  <td className="px-6 py-6">
                    <span className={`text-sm font-bold px-4 py-2 rounded-full ${row.tone}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard-notary/assignments-orders/${row.id}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                          row.action === "Start Session" ? "bg-[#2c49df] text-white" : "bg-blue-50 text-[#2c49df]"
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        {row.action}
                      </Link>
                      <button className="text-zinc-400 hover:text-zinc-700">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-5 border-t border-zinc-100 flex items-center justify-between gap-4 text-sm">
          <p className="text-zinc-500">Showing 4 of 124 assignments</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-400">Previous</button>
            <button className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-800">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
