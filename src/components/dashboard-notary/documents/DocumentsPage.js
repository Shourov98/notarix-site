import { Calendar, Download, Eye, FileBadge2, FileClock, FileUp, Search, ShieldCheck, Trash2 } from "lucide-react";

const files = [
  { name: "Loan_Agreement_v4.pdf", sub: "Internal Audit Code: 8829", orderId: "#ORD-2024-001", uploadedBy: "Client", date: "Apr 12, 2026", type: "PDF", size: "2.4 MB", badge: "bg-blue-50 text-[#2c49df]" },
  { name: "Notary_Seal_Auth_02.png", sub: "Signature Verified", orderId: "#ORD-2024-042", uploadedBy: "Notary", date: "Apr 11, 2026", type: "PNG", size: "842 KB", badge: "bg-emerald-50 text-emerald-600" },
  { name: "Master_Service_Terms.pdf", sub: "Shared with Compliance Team", orderId: "#ORD-2023-998", uploadedBy: "Admin", date: "Apr 09, 2026", type: "PDF", size: "12.1 MB", badge: "bg-violet-50 text-violet-600" },
  { name: "Draft_Affidavit_New.docx", sub: "Awaiting Notary Review", orderId: "#ORD-2024-115", uploadedBy: "Client", date: "Apr 14, 2026", type: "DOCX", size: "45 KB", badge: "bg-blue-50 text-[#2c49df]" },
];

const timeline = [
  { title: "Document Finalized & Sealed", meta: "Today, 2:45 PM • By Notary John Doe", active: true },
  { title: "Legal Review Approved", meta: "Today, 10:12 AM • System Automatic" },
  { title: "Document Uploaded", meta: "Yesterday, 4:30 PM • By Client Sarah Smith" },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Files", value: "128", icon: FileBadge2 },
          { label: "Recent Uploads", value: "12 / wk", icon: FileUp },
          { label: "Pending Documents", value: "5", icon: FileClock },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-indigo-100 rounded-[24px] p-8 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-[#2c49df] flex items-center justify-center">
              <card.icon className="w-5 h-5" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-zinc-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-100 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by file name, Order ID..."
              className="w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:border-[#2c49df]"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {["Uploaded by", "File Type", "Order ID"].map((item) => (
              <button key={item} className="px-4 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-700 font-medium">
                {item}
              </button>
            ))}
            <button className="px-4 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-700 font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-zinc-50">
              <tr>
                {["File Name", "Order ID", "Uploaded By", "Upload Date", "File Type", "Size", "Actions"].map((head) => (
                  <th key={head} className="px-6 py-5 text-left text-sm font-bold text-zinc-500">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.name} className="border-t border-zinc-100">
                  <td className="px-6 py-5">
                    <div>
                      <p className="text-zinc-900 font-bold">{file.name}</p>
                      <p className="text-zinc-400 text-sm mt-1">{file.sub}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-zinc-600">{file.orderId}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${file.badge}`}>{file.uploadedBy}</span>
                  </td>
                  <td className="px-6 py-5 text-zinc-600">{file.date}</td>
                  <td className="px-6 py-5 text-zinc-600">{file.type}</td>
                  <td className="px-6 py-5 text-zinc-600">{file.size}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 text-[#2c49df]">
                      <button><Eye className="w-5 h-5" /></button>
                      <button><Download className="w-5 h-5" /></button>
                      <button className="text-red-500"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-5 border-t border-zinc-100 flex items-center justify-between text-sm text-zinc-500">
          <p>Showing 1 to 4 of 128 documents</p>
          <div className="flex gap-2">
            {["Previous", "1", "2", "3", "Next"].map((item) => (
              <button key={item} className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#2c49df]" />
            <h2 className="text-xl font-bold text-zinc-900">Audit History Timeline</h2>
          </div>
          <p className="text-sm text-zinc-400">Document UID: 9a8c-f230-11eb</p>
        </div>
        <div className="p-6 space-y-8">
          {timeline.map((item, index) => (
            <div key={item.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${item.active ? "bg-[#2c49df]" : "bg-zinc-300"}`}></div>
                {index < timeline.length - 1 && <div className="w-px h-16 bg-zinc-200 mt-2"></div>}
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-900">{item.title}</p>
                <p className="text-sm font-medium text-zinc-500 mt-1">{item.meta}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
