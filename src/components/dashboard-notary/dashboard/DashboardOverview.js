import { CalendarDays, CircleDollarSign, ClipboardCheck, HandCoins, MapPin, TimerReset } from "lucide-react";

const defaultStats = [
  { label: "Completed Total Assignments", value: "1,284", icon: ClipboardCheck },
  { label: "Open Assignments", value: "04", icon: CalendarDays },
  { label: "Total Earnings", value: "$14,205", icon: CircleDollarSign },
];

const defaultAssignments = [
  { time: "09:30 AM", name: "Benjamin Richardson", detail: "Refinance - 42 Documents", status: "Confirmed", tone: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { time: "01:15 PM", name: "Elena Rodriguez", detail: "Power of Attorney", status: "In Progress", tone: "bg-blue-50 text-blue-600 border-blue-100" },
  { time: "04:00 PM", name: "Samuel Thompson", detail: "Home Equity Line of Credit", status: "Upcoming", tone: "bg-zinc-100 text-zinc-500 border-zinc-200" },
];

const defaultRequests = [
  { title: "First National Bank", type: "Mortgage Deed Signing", time: "Tomorrow, 10:00 AM", location: "Downtown, Seattle (2.4 mi)", amount: "$125.00" },
  { title: "Westside Legal Group", type: "Affidavit Verification", time: "Oct 26, 11:30 AM", location: "Remote / Online", amount: "$85.00" },
];

export default function DashboardOverview({
  stats = defaultStats,
  assignments = defaultAssignments,
  requests = defaultRequests,
}) {
  const iconByLabel = {
    "Completed Total Assignments": ClipboardCheck,
    "Open Assignments": CalendarDays,
    "Total Earnings": CircleDollarSign,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 max-w-[16ch]">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-zinc-900 mt-5">{stat.value}</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-[#2c49df]">
                {(() => {
                  const Icon = stat.icon || iconByLabel[stat.label] || ClipboardCheck;
                  return <Icon className="w-5 h-5" />;
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-white border border-indigo-100 rounded-[24px] overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-zinc-900">Today&apos;s Assignments</h2>
            <button className="text-[#2c49df] text-sm font-bold hover:underline">View Schedule</button>
          </div>
          <div>
            {assignments.map((item) => (
              <div key={item.time} className="px-6 py-6 border-b last:border-b-0 border-zinc-100 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-24 text-2xl font-bold tracking-tight text-zinc-900">{item.time}</div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-zinc-900">{item.name}</p>
                  <p className="text-sm font-medium text-zinc-500 mt-1">{item.detail}</p>
                </div>
                <span className={`self-start md:self-center text-xs font-bold px-4 py-2 rounded-full border ${item.tone}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="bg-[#2c49df] rounded-[24px] p-7 text-white shadow-xl shadow-blue-200">
            <p className="text-xs uppercase tracking-[0.25em] font-bold text-blue-100">Projected Earnings</p>
            <p className="text-4xl font-bold tracking-tight mt-7">$3,450.00</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <h2 className="text-2xl font-bold text-zinc-900">New Assignment Requests</h2>
          <span className="w-8 h-8 rounded-full bg-[#2c49df] text-white text-sm font-bold flex items-center justify-center">
            2
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {requests.map((request) => (
            <div key={request.title} className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
                  <HandCoins className="w-5 h-5" />
                </div>
                <p className="text-lg font-bold tracking-tight text-zinc-700">{request.amount}</p>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-bold text-zinc-900">{request.title}</h3>
                <p className="text-sm font-medium text-zinc-500 mt-2">{request.type}</p>
              </div>
              <div className="space-y-3 mt-6 text-zinc-600">
                <div className="flex items-center gap-3">
                  <TimerReset className="w-4 h-4 text-zinc-400" />
                  <span>{request.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>{request.location}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-7">
                <button className="flex-1 bg-[#2c49df] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#243dcc] transition-colors">
                  Accept
                </button>
                <button className="flex-1 bg-white border border-zinc-200 text-zinc-700 py-3 rounded-xl font-bold text-sm hover:bg-zinc-50 transition-colors">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
