"use client";

import { 
  FileText, 
  UploadCloud, 
  Files, 
  Search, 
  ChevronDown, 
  Calendar,
  Eye,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  History,
  FileIcon
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const stats = [
  { label: "Total Files", value: "128", icon: Files, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
  { label: "Recent Uploads", value: "12 / wk", icon: UploadCloud, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
  { label: "Pending Documents", value: "5", icon: FileText, color: "text-[#1a4fdb]", bg: "bg-blue-50" },
];

const documents = [
  {
    name: "Loan_Agreement_v4.pdf",
    subName: "Internal Audit Code: 8829",
    orderId: "#ORD-2024-001",
    uploadedBy: "Client",
    uploadedByColor: "bg-blue-50 text-blue-600",
    date: "Apr 12, 2026",
    type: "PDF",
    size: "2.4 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  },
  {
    name: "Notary_Seal_Auth_02.png",
    subName: "Signature Verified",
    orderId: "#ORD-2024-042",
    uploadedBy: "Notary",
    uploadedByColor: "bg-emerald-50 text-emerald-600",
    date: "Apr 11, 2026",
    type: "PNG",
    size: "842 KB",
    icon: CheckCircle2,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50"
  },
  {
    name: "Loan_Agreement_v4.pdf",
    subName: "Internal Audit Code: 8829",
    orderId: "#ORD-2024-001",
    uploadedBy: "Client",
    uploadedByColor: "bg-blue-50 text-blue-600",
    date: "Apr 12, 2026",
    type: "PDF",
    size: "2.4 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  },
  {
    name: "Master_Service_Terms.pdf",
    subName: "Shared with Compliance Team",
    orderId: "#ORD-2023-998",
    uploadedBy: "Admin",
    uploadedByColor: "bg-purple-50 text-purple-600",
    date: "Apr 09, 2026",
    type: "PDF",
    size: "12.1 MB",
    icon: FileText,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50"
  },
  {
    name: "Draft_Affidavit_New.docx",
    subName: "Awaiting Notary Review",
    subNameColor: "text-amber-500",
    orderId: "#ORD-2024-115",
    uploadedBy: "Client",
    uploadedByColor: "bg-blue-50 text-blue-600",
    date: "Apr 14, 2026",
    type: "DOCX",
    size: "45 KB",
    icon: FileIcon,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50"
  }
];

const auditTrail = [
  { title: "Document Finalized & Sealed", info: "Today, 2:45 PM • By Notary John Doe", current: true },
  { title: "Legal Review Approved", info: "Today, 10:12 AM • System Automatic", current: false },
  { title: "Document Uploaded", info: "Yesterday, 4:30 PM • By Client Sarah Smith", current: false },
];

export default function NotaryDocumentsPage() {
  const [activeDoc, setActiveDoc] = useState(documents[0]);

  return (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-8 rounded-[32px] shadow-sm flex flex-col items-center justify-center text-center space-y-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white border border-zinc-100 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
        {/* Filter Bar */}
        <div className="p-6 border-b border-zinc-100 flex flex-col xl:flex-row items-center gap-4 bg-white">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-[#1a4fdb] transition-colors" />
            <input 
              type="text" 
              placeholder="Search by file name, Order ID..." 
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
              Uploaded by <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
              File Type <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
              Order ID <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-all">
              Date Range <Calendar className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">File Name</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Uploaded By</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Upload Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">File Type</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">Size</th>
                <th className="px-6 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {documents.map((doc, i) => (
                <tr key={i} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${doc.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                        <doc.icon className={`w-5 h-5 ${doc.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-800">{doc.name}</p>
                        <p className={`text-[10px] font-medium ${doc.subNameColor || 'text-zinc-400'}`}>{doc.subName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-zinc-500">{doc.orderId}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider ${doc.uploadedByColor}`}>
                      {doc.uploadedBy}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-medium text-zinc-500">{doc.date}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-medium text-zinc-500">{doc.type}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-medium text-zinc-500">{doc.size}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/document/${i}`}>
                        <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-white rounded-lg transition-all shadow-sm"><Eye className="w-4 h-4" /></button>
                      </Link>
                      <button className="p-2 text-zinc-400 hover:text-[#1a4fdb] hover:bg-white rounded-lg transition-all shadow-sm"><Download className="w-4 h-4" /></button>
                      <button className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-zinc-100 flex items-center justify-between bg-zinc-50/10">
          <span className="text-sm text-zinc-500 font-medium">Showing 1 to 4 of 128 documents</span>
          <div className="flex items-center gap-1">
            <button className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-500 hover:bg-zinc-50 transition-colors">Previous</button>
            <button className="w-8 h-8 bg-white border border-zinc-200 text-[#1a4fdb] rounded-lg text-xs font-bold shadow-sm">1</button>
            <button className="w-8 h-8 text-zinc-400 hover:bg-zinc-50 rounded-lg text-xs font-bold transition-colors">2</button>
            <button className="w-8 h-8 text-zinc-400 hover:bg-zinc-50 rounded-lg text-xs font-bold transition-colors">3</button>
            <button className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-500 hover:bg-zinc-50 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Audit History Timeline Section */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-[#1a4fdb]" />
            <h3 className="font-bold text-zinc-900">Audit History Timeline</h3>
          </div>
          <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Document UID: 9a8c-f230-11eb</span>
        </div>
        
        <div className="space-y-12 relative pl-8 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-zinc-50">
          {auditTrail.map((item, i) => (
            <div key={i} className="relative">
              <div className={`absolute left-[-25px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white transition-all ${
                item.current ? 'bg-[#1a4fdb] ring-4 ring-blue-50' : 'bg-zinc-200'
              }`}></div>
              <div className="space-y-1">
                <h4 className={`text-sm font-bold ${item.current ? 'text-zinc-900' : 'text-zinc-500'}`}>{item.title}</h4>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{item.info}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
