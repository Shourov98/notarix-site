import { CircleDollarSign, Download, Landmark, TrendingUp, Wallet, WalletCards } from "lucide-react";

const earnings = [
  { id: "ORD-4921", name: "Jane Doe", service: "Online Notary", date: "Apr 12, 2026", amount: "$75.00", status: "Paid", tone: "bg-emerald-50 text-emerald-600", method: "Visa (****4242)" },
  { id: "ORD-4920", name: "Mark Smith", service: "Loan Signing", date: "Apr 12, 2026", amount: "$250.00", status: "Processing", tone: "bg-blue-50 text-[#2c49df]", method: "Bank Transfer" },
  { id: "ORD-4919", name: "Robert Lee", service: "Mobile Notary", date: "Apr 12, 2026", amount: "$120.00", status: "Pending", tone: "bg-orange-50 text-orange-600", method: "Stripe Connect" },
];

const payouts = [
  { id: "PAY-882193", date: "Oct 12, 2023", method: "Chase Bank (**** 8821)", amount: "$1,240.00", status: "Success" },
  { id: "PAY-881042", date: "Sept 28, 2023", method: "Chase Bank (**** 8821)", amount: "$980.50", status: "Success" },
];

const chartHeights = ["h-28", "h-36", "h-32", "h-44", "h-40", "h-52", "h-58", "h-48", "h-56", "h-44", "h-50", "h-60"];

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Earnings &amp; Payments</h1>
          <p className="text-zinc-500 font-medium text-sm mt-1">Monitor your income and manage payouts with precision.</p>
        </div>
        <button className="px-6 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-800 font-bold flex items-center gap-3 shadow-sm">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Total Earned", value: "$12,450.00", icon: Wallet },
          { label: "This Month", value: "$3,842.15", icon: TrendingUp },
          { label: "Pending", value: "$850.50", icon: CircleDollarSign },
          { label: "Paid Out", value: "$11,599.50", icon: WalletCards },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2c49df] flex items-center justify-center">
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">{card.label}</p>
                <p className="text-3xl font-bold text-zinc-900 mt-2">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-zinc-900">Revenue Performance</h2>
            <div className="flex bg-zinc-50 border border-zinc-200 rounded-2xl p-1">
              {["Weekly", "Monthly", "Yearly"].map((item, index) => (
                <button
                  key={item}
                  className={`px-5 py-2 rounded-xl text-sm font-bold ${index === 2 ? "bg-[#2c49df] text-white" : "text-zinc-600"}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[340px] mt-8 flex items-end gap-3">
            {chartHeights.map((height, index) => (
              <div key={height} className="flex-1 flex flex-col items-center justify-end gap-4">
                <div className={`w-full rounded-t-xl bg-indigo-200/80 ${height}`}></div>
                <span className="text-xs font-bold text-zinc-500">
                  {["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#2c49df] rounded-[24px] p-6 text-white shadow-xl shadow-blue-200">
            <p className="text-blue-100">Available for Withdrawal</p>
            <p className="text-4xl font-bold tracking-tight mt-4">$4,230.15</p>
            <div className="mt-8 pt-6 border-t border-white/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Landmark className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Chase Business Checking</p>
                <p className="text-blue-100 text-sm">Ending in **** 8821</p>
              </div>
            </div>
            <button className="w-full mt-8 bg-white text-[#2c49df] py-4 rounded-2xl font-bold">
              Withdraw Funds
            </button>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.18em] font-bold text-zinc-400">Last Payout</p>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-3xl font-bold text-zinc-900">$1,240.00</p>
                <p className="text-sm font-medium text-zinc-500 mt-2">Apr 12, 2026</p>
              </div>
              <span className="text-emerald-600 font-bold">Success</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] p-4 shadow-sm flex flex-col xl:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Client Name or Order ID..."
          className="flex-1 px-5 py-4 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:border-[#2c49df]"
        />
        <div className="flex flex-wrap gap-3">
          {["All Statuses", "Last 30 Days", "All Services"].map((item) => (
            <button key={item} className="px-5 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-700 font-medium">
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900">Recent Earnings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-zinc-50">
              <tr>
                {["Order ID", "Client Name", "Service Type", "Date", "Amount", "Status", "Method", "Actions"].map((head) => (
                  <th key={head} className="px-6 py-5 text-left text-sm font-bold text-zinc-500">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {earnings.map((row) => (
                <tr key={row.id} className="border-t border-zinc-100">
                  <td className="px-6 py-6 text-zinc-900 font-bold">#{row.id}</td>
                  <td className="px-6 py-6 text-zinc-800">{row.name}</td>
                  <td className="px-6 py-6 text-zinc-700">{row.service}</td>
                  <td className="px-6 py-6 text-zinc-600">{row.date}</td>
                  <td className="px-6 py-6 text-zinc-900 font-bold">{row.amount}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${row.tone}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-6 text-zinc-600">{row.method}</td>
                  <td className="px-6 py-6 text-[#2c49df] font-bold">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-5 border-t border-zinc-100 flex items-center justify-between text-sm text-zinc-500">
          <p>Showing 1 to 3 of 152 transactions</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700">Previous</button>
            <button className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700">Next</button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-zinc-100">
          <h2 className="text-xl font-bold text-zinc-900">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-zinc-50">
              <tr>
                {["Payout ID", "Date", "Method", "Amount", "Status"].map((head) => (
                  <th key={head} className="px-6 py-5 text-left text-sm font-bold text-zinc-500">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payouts.map((row) => (
                <tr key={row.id} className="border-t border-zinc-100">
                  <td className="px-6 py-6 text-zinc-900 font-bold">#{row.id}</td>
                  <td className="px-6 py-6 text-zinc-600">{row.date}</td>
                  <td className="px-6 py-6 text-zinc-600">{row.method}</td>
                  <td className="px-6 py-6 text-zinc-900 font-bold">{row.amount}</td>
                  <td className="px-6 py-6 text-emerald-600 font-bold">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
