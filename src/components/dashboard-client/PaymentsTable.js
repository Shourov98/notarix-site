"use client";

import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown
} from "lucide-react";

const transactions = [
  {
    id: "#NP-7421",
    signerName: "Johnnathan Doe",
    signerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    amount: "$450.00",
    status: "Paid",
    statusColor: "bg-emerald-50 text-emerald-600",
    statusDot: "bg-emerald-500",
    method: "Credit Card (**** 4242)",
    transactionId: "1234ABCDRE",
    dueDate: "Apr 12, 2026"
  },
  {
    id: "#NP-7422",
    signerName: "Alice Smith",
    signerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    amount: "$1,200.00",
    status: "Pending",
    statusColor: "bg-blue-50 text-blue-600",
    statusDot: "bg-blue-500",
    method: "Bank Transfer",
    transactionId: "1234ABCDRE",
    dueDate: "Apr 07, 2026"
  },
  {
    id: "#NP-7423",
    signerName: "Marcus Reed",
    signerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    amount: "$750.00",
    status: "Partial",
    statusColor: "bg-orange-50 text-orange-600",
    statusDot: "bg-orange-500",
    method: "Credit Card (**** 9012)",
    transactionId: "1234ABCDRE",
    dueDate: "Apr 06, 2026"
  },
  {
    id: "#NP-7424",
    signerName: "Sarah Lopez",
    signerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    amount: "$225.00",
    status: "Failed",
    statusColor: "bg-rose-50 text-rose-600",
    statusDot: "bg-rose-500",
    method: "Debit Card (**** 1155)",
    transactionId: "1234ABCDRE",
    dueDate: "Apr 06, 2026"
  }
];

export default function PaymentsTable() {
  return (
    <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden">
      {/* Table Header with Search & Filter */}
      <div className="p-6 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <h3 className="font-bold text-zinc-900">Recent Transactions</h3>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 group-focus-within:text-[#1a4fdb] transition-colors" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-bold text-zinc-600 hover:bg-zinc-100 transition-all active:scale-95">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-50 bg-zinc-50/30">
              <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Order ID</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Signer's Name</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-center">Amount</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-center">Method</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-center">Transaction ID</th>
              <th className="px-6 py-5 text-[10px] font-bold text-gray-700 uppercase tracking-widest text-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {transactions.map((tx, i) => (
              <tr key={i} className="hover:bg-zinc-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-[#1a4fdb] hover:underline cursor-pointer">{tx.id}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-100 bg-zinc-50 shrink-0">
                      <img src={tx.signerAvatar} alt={tx.signerName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-bold text-zinc-700">{tx.signerName}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-sm font-bold text-zinc-900">{tx.amount}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.statusColor}`}>
                    <div className={`w-1 h-1 rounded-full ${tx.statusDot}`}></div>
                    {tx.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-sm font-medium text-gray-700">{tx.method}</span>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="text-sm font-medium text-gray-700">{tx.transactionId}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-sm font-medium text-gray-700">{tx.dueDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
        <span className="text-sm text-gray-700 font-medium">Showing <span className="font-bold text-zinc-900">1-10</span> of 48 transactions</span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button className="p-1.5 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
