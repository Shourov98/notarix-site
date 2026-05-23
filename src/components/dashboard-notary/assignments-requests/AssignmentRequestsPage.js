import { Calendar, Clock3, LocateFixed, Search, SlidersHorizontal } from "lucide-react";

const requests = [
  { id: "ORD-4492", type: "RON Service", location: "Virtual - Online Platform", sub: "Nationwide Connectivity", date: "Oct 24, 2023 • 02:30 PM", zone: "Eastern Standard Time (EST)", amount: "$80", docs: "12 Pages", notes: "Loan modifications...", expires: "08:45" },
  { id: "ORD-4510", type: "In-Person", location: "Austin, TX", sub: "4.2 miles away", date: "Oct 25, 2023 • 10:00 AM", zone: "Central Standard Time (CST)", amount: "$125", docs: "45 Pages", notes: "Full closing docs...", expires: "15:20" },
  { id: "ORD-4512", type: "RON Service", location: "Virtual - Online Platform", sub: "Nationwide Connectivity", date: "ASAP • Priority", zone: "Ready for connection now", amount: "$65", docs: "4 Pages", notes: "Power of Attorney...", expires: "02:15" },
];

export default function AssignmentRequestsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">New Assignment Requests</h1>
        <p className="text-zinc-500 font-medium text-sm mt-1">Review and accept available job requests in real-time.</p>
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] p-4 shadow-sm flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search Location or Order ID"
            className="w-full pl-12 pr-4 py-4 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:border-[#2c49df]"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          {["Service Type", "Date Range", "Distance"].map((item) => (
            <button key={item} className="px-5 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-700 font-medium">
              {item}
            </button>
          ))}
          <button className="px-5 py-4 rounded-2xl bg-zinc-100 text-zinc-700 font-semibold flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            All Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {requests.map((request) => (
          <div key={request.id} className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Order ID</p>
                <h2 className="text-2xl font-bold text-zinc-900 mt-3">#{request.id}</h2>
              </div>
              <div className="space-y-2 text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#2c49df] text-[10px] font-bold uppercase tracking-[0.15em]">
                  {request.type}
                </span>
                <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-500 text-[10px] font-bold uppercase tracking-[0.15em]">
                  New Request
                </span>
              </div>
            </div>

            <div className="mt-7 space-y-5 text-zinc-700">
              <div className="flex gap-3">
                <LocateFixed className="w-5 h-5 text-zinc-400 shrink-0 mt-1" />
                <div>
                  <p className="text-xl font-bold text-zinc-900">{request.location}</p>
                  <p className="text-sm font-medium text-zinc-500 mt-1">{request.sub}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-zinc-400 shrink-0 mt-1" />
                <div>
                  <p className="text-xl font-bold text-zinc-900">{request.date}</p>
                  <p className="text-sm font-medium text-zinc-500 mt-1">{request.zone}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-[#eef2ff] border border-indigo-100 rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-zinc-700">Estimated Earnings</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#2c49df]">You Earn:</p>
                <p className="text-3xl font-bold text-[#2c49df] mt-2">{request.amount}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Docs</p>
                <p className="text-2xl font-bold text-zinc-900 mt-2">{request.docs}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Special Instructions</p>
                <p className="text-zinc-700 mt-2">{request.notes}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-6 text-red-500 font-semibold">
              <Clock3 className="w-4 h-4" />
              <span>Expires in {request.expires}</span>
            </div>

            <div className="flex gap-3 mt-7">
              <button className="flex-1 bg-[#2c49df] text-white py-3 rounded-xl font-bold hover:bg-[#243dcc] transition-colors">
                Accept Request
              </button>
              <button className="flex-1 bg-white border border-zinc-200 text-zinc-700 py-3 rounded-xl font-medium hover:bg-zinc-50 transition-colors">
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#f7f8ff] border border-dashed border-indigo-200 rounded-[24px] p-16 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
          <LocateFixed className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 mt-8">No more requests?</h3>
        <p className="text-zinc-500 text-sm font-medium mt-4 max-w-2xl mx-auto">
          We&apos;ll notify you as soon as new jobs matching your profile become available in your area.
        </p>
        <button className="text-[#2c49df] font-bold mt-6 hover:underline">Update Service Area Radius</button>
      </div>
    </div>
  );
}
