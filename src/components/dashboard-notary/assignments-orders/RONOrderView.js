import { BadgeCheck, Download, Eye, FileText, MessageSquare, Play, ShieldCheck, Upload, Video } from "lucide-react";
import Link from "next/link";

const steps = ["Created", "Submitted", "Review", "Assigned", "In Progress", "Completed"];

export default function RONOrderView({ id }) {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <p className="text-sm font-medium text-zinc-500">Orders &nbsp;&gt;&nbsp; Details</p>
        <div className="flex flex-wrap items-center gap-4 mt-3">
          <h1 className="text-2xl font-bold text-zinc-900">Order #{id}</h1>
          <span className="px-4 py-2 rounded-full bg-orange-50 text-orange-600 font-bold">In Progress</span>
        </div>
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] p-8 shadow-sm">
        <div className="grid grid-cols-2 xl:grid-cols-6 gap-6">
          {steps.map((step, index) => (
            <div key={step} className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold ${index < 5 ? "bg-[#2c49df] text-white" : "bg-white border border-zinc-300 text-zinc-400"}`}>
                {index + 1}
              </div>
              <p className={`mt-3 text-sm font-bold ${index < 5 ? "text-[#2c49df]" : "text-zinc-400"}`}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {[
          ["Fee Amount", "$150.00"],
          ["Signing Date", "Apr 24, 2026"],
          ["Location", "Austin, TX-15423"],
          ["Order Type", "Remote Online"],
        ].map(([label, value]) => (
          <div key={label} className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">{label}</p>
            <p className="text-xl font-bold text-zinc-900 mt-4">{value}</p>
            {label === "Signing Date" && <p className="text-sm font-medium text-zinc-500 mt-2">2:30 PM CST</p>}
            {label === "Location" && <p className="text-sm font-medium text-zinc-500 mt-2">Remote Portal</p>}
            {label === "Order Type" && <p className="text-sm font-medium text-zinc-500 mt-2">Digital Notarization</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-zinc-900">Client Info</h2>
                <button className="text-[#2c49df] font-bold">Edit</button>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Organization</p>
                  <p className="text-zinc-900 font-semibold mt-2">Lone Star Title Services</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Contact Agent</p>
                  <p className="text-zinc-900 font-semibold mt-2">Robert Sterling</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Phone Number</p>
                  <p className="text-zinc-900 font-semibold mt-2">+1 (555) 012-3456</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Email</p>
                  <p className="text-[#2c49df] font-semibold mt-2">r.sterling@lonestartitle.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-zinc-900">Borrower Info</h2>
                <button className="text-[#2c49df] font-bold">Verify ID</button>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Full Name</p>
                  <p className="text-zinc-900 font-semibold mt-2">Sarah Mitchell</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Location</p>
                  <p className="text-zinc-900 font-semibold mt-2">Austin, TX</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">KBA Status</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-bold">Passed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Property &amp; Signing Details</h2>
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Full Address</p>
                <p className="text-xl font-bold text-zinc-900 mt-2">7822 Barton Creek Dr</p>
                <p className="text-xl font-bold text-zinc-900 mt-1">Austin, TX 78735</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Scheduled Time</p>
                <p className="text-zinc-700 mt-2">October 24, 2024 at 2:30 PM CST</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Notary Access Code</p>
                <p className="text-[#2c49df] text-2xl font-bold mt-2">RON-992-X1</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-zinc-900">Documents</h2>
              <button className="text-[#2c49df] font-bold">+ Add Documents</button>
            </div>
            <div className="mt-6 space-y-4">
              {["Closing_Disclosure_Final.pdf", "Warranty_Deed_Signed.pdf"].map((file) => (
                <div key={file} className="flex items-center justify-between p-4 rounded-2xl border border-zinc-200">
                  <div className="flex items-center gap-4">
                    <FileText className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="text-zinc-900 font-semibold">{file}</p>
                      <p className="text-zinc-500 text-sm">2.4 MB • 12 Pages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-400">
                    <Link href={`/notary-document/${id}`}><Eye className="w-5 h-5" /></Link>
                    <Download className="w-5 h-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-zinc-900">Message Center</h2>
              <div className="flex -space-x-2">
                {["CM", "AD", "NY"].map((initial) => (
                  <div key={initial} className={`w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold ${initial === "AD" ? "bg-[#2c49df] text-white" : "bg-zinc-100 text-zinc-700"}`}>
                    {initial}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 min-h-[280px] space-y-6">
              <div className="max-w-2xl bg-zinc-50 rounded-[24px] p-5">
                <p className="text-zinc-900 font-bold">Robert Sterling <span className="text-xs text-zinc-400">Client</span> <span className="text-zinc-400 font-medium">10:45 AM</span></p>
                <p className="text-sm font-medium text-zinc-700 mt-3">Hi Team, I&apos;ve just uploaded the finalized Disclosure. Sarah is ready for the session at 2:30.</p>
              </div>
              <div className="max-w-2xl bg-[#eef2ff] rounded-[24px] p-5">
                <p className="text-zinc-900 font-bold">Admin Support <span className="text-xs text-[#2c49df]">Admin</span> <span className="text-zinc-400 font-medium">10:48 AM</span></p>
                <p className="text-sm font-medium text-zinc-700 mt-3">Confirmed, Robert. Sarah&apos;s KBA and ID verification have been successfully validated.</p>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 border border-zinc-200 rounded-2xl px-4 py-3">
                <MessageSquare className="w-5 h-5 text-zinc-400" />
                <input type="text" placeholder="Type a message to participants..." className="flex-1 focus:outline-none" />
                <button className="text-[#2c49df] font-bold">Send</button>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#141c32] text-white rounded-[24px] p-6 shadow-xl">
            <p className="text-xs uppercase tracking-[0.2em] font-bold text-blue-200">RON Ready</p>
            <h2 className="text-xl font-bold mt-4">Remote Session</h2>
            <p className="text-blue-100 mt-4 leading-relaxed">
              Start the encrypted video session for legally binding signatures.
            </p>
            <div className="mt-8 space-y-4">
              <Link href={`/notary-session/${id}`} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#2c49df] text-white font-bold">
                <Video className="w-5 h-5" />
                Start Video Session
              </Link>
              <button className="w-full py-4 rounded-2xl bg-white/10 font-bold flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Documents
              </button>
              <button className="w-full py-4 rounded-2xl bg-white/10 font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Mark Complete
              </button>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900">Payment</h3>
              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-bold text-sm">Pending</span>
            </div>
            <div className="space-y-5 mt-6">
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Amount</span>
                <span className="font-bold text-zinc-900">$150.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Due Date</span>
                <span className="font-bold text-zinc-900">Upon Completion</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl border border-[#2c49df] text-[#2c49df] font-bold">
              Download Invoice
            </button>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900">Audit Trail</h3>
            <div className="mt-6 space-y-6">
              {[
                ["KBA Identification Passed", "Oct 24, 10:15 AM"],
                ["Witnesses Confirmed", "Oct 24, 09:30 AM"],
                ["Order Initialized", "Oct 23, 04:15 PM"],
              ].map(([title, time]) => (
                <div key={title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${title === "Order Initialized" ? "bg-blue-500" : "bg-emerald-500"}`}></div>
                    <div className="w-px h-12 bg-zinc-200 mt-2"></div>
                  </div>
                  <div>
                    <p className="font-bold text-zinc-900">{title}</p>
                    <p className="text-zinc-400 mt-2">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
