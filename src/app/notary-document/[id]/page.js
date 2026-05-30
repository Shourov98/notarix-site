import { Download, FileText, ShieldCheck, X } from "lucide-react";
import Link from "next/link";

export default async function NotaryDocumentPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || "RON-9402";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-20 px-8 border-b border-zinc-200 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-zinc-900">Document Preview</h1>
          <p className="text-zinc-500 mt-2">Refinance_Agreement_v4.pdf • Order #{id}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold flex items-center gap-3">
            <Download className="w-5 h-5" />
            Download
          </button>
          <Link href={`/dashboard-notary/assignments-orders/${id}`} className="text-zinc-500">
            <X className="w-8 h-8" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex">
        <div className="w-48 border-r border-zinc-200 bg-zinc-50 p-4 space-y-4">
          {[1, 2, 3].map((page) => (
            <div key={page} className={`h-56 rounded-xl border ${page === 1 ? "border-[#2c49df] border-2 bg-white" : "border-zinc-200 bg-white"}`}></div>
          ))}
        </div>

        <div className="flex-1 bg-[#f6f8fd] p-8 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl aspect-[8.5/11] border border-zinc-200 shadow-xl p-16 relative">
            <div className="space-y-6">
              <div className="h-8 w-72 bg-zinc-100 rounded"></div>
              <div className="h-4 w-full bg-zinc-50 rounded"></div>
              <div className="h-4 w-11/12 bg-zinc-50 rounded"></div>
              <div className="h-4 w-full bg-zinc-50 rounded"></div>
              <div className="h-px w-full bg-zinc-200 my-8"></div>
              <div className="space-y-4">
                <div className="h-4 w-1/2 bg-zinc-100 rounded"></div>
                <div className="h-4 w-full bg-zinc-50 rounded"></div>
                <div className="h-4 w-full bg-zinc-50 rounded"></div>
                <div className="h-4 w-3/4 bg-zinc-50 rounded"></div>
              </div>
            </div>

            <button className="absolute left-40 top-1/2 -translate-y-1/2 px-6 py-3 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100">
              Sign Here
            </button>
            <button className="absolute right-40 bottom-32 px-6 py-3 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100">
              Seal Here
            </button>
          </div>
        </div>

        <div className="w-80 border-l border-zinc-200 bg-zinc-50 p-6 space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400">File Details</p>
            <div className="mt-5 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-zinc-200 flex items-center justify-center text-zinc-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-zinc-900">Refinance_Agreement_v4</p>
                <p className="text-zinc-500 mt-2">2.4 MB • PDF Document</p>
              </div>
            </div>
            <div className="mt-5 bg-white border border-zinc-200 rounded-[24px] p-5 space-y-4">
              <div className="flex justify-between"><span className="text-zinc-500">Uploaded By</span><span className="font-bold text-[#2c49df]">Notary</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Date</span><span className="font-semibold">Oct 24, 2023</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Order ID</span><span className="font-semibold">{id}</span></div>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400">Signing Status</p>
            <div className="mt-5 space-y-4">
              {[
                ["Alice Morgan", "Borrower", "Signed", "10:42 AM"],
                ["James Reed", "Co-Borrower", "Pending", ""],
              ].map(([name, role, status, time]) => (
                <div key={name} className="bg-white border border-zinc-200 rounded-[24px] p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-[#2c49df] flex items-center justify-center font-bold">
                      {name.split(" ").map((item) => item[0]).join("")}
                    </div>
                    <div>
                      <p className="font-bold text-zinc-900">{name}</p>
                      <p className="text-zinc-500 text-sm">{role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${status === "Signed" ? "bg-emerald-50 text-emerald-600" : "bg-zinc-100 text-zinc-500"}`}>{status}</span>
                    {time && <p className="text-zinc-400 text-sm mt-2">{time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-zinc-400">Legal Notes</p>
            <div className="mt-5 flex-1 bg-white border border-zinc-200 rounded-[24px] p-5">
              <p className="text-zinc-400">Add a confidential note about this document...</p>
            </div>
            <div className="pt-4 border-t border-zinc-200 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-500">
                <ShieldCheck className="w-4 h-4" />
                <span>Confidential</span>
              </div>
              <button className="text-[#2c49df] font-bold">Save Note</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-zinc-400 border-t border-zinc-100">
        © 2026 Notarix™ Technologies Inc. All rights reserved.
      </footer>
    </div>
  );
}
