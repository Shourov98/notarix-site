import { BadgeCheck, Calendar, CircleDollarSign, Download, FileText, Home, MapPin, MessageSquare, Play, ShieldCheck, Upload, UserRound, Video } from "lucide-react";
import Link from "next/link";

const steps = ["Created", "Assigned", "On the Way", "Checked-In", "Signing Completed", "Completed"];

export default function InPersonOrderView({ id }) {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Order Details</h1>
        <p className="text-sm font-medium text-zinc-500 mt-1">
          Order #{id} • In-Person
        </p>
      </div>

      <div className="bg-white border border-indigo-100 rounded-[24px] p-8 shadow-sm">
        <div className="grid grid-cols-2 xl:grid-cols-6 gap-6">
          {steps.map((step, index) => (
            <div key={step} className="text-center relative">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold ${index < 2 ? "bg-[#2c49df] text-white" : index === 0 ? "bg-emerald-500 text-white" : "bg-zinc-100 text-zinc-400"}`}>
                {index + 1}
              </div>
              <p className={`mt-3 text-sm font-bold ${index < 2 ? "text-[#2c49df]" : "text-zinc-400"}`}>{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {[
          ["Date & Time", "Oct 26, 2024, 10:00 AM", Calendar],
          ["Location", "Austin, TX-12356", MapPin],
          ["Estimated Fee", "$175.00", CircleDollarSign],
          ["Order Type", "In-Person Signing", UserRound],
        ].map(([label, value, Icon]) => (
          <div key={label} className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center gap-3 text-[#2c49df]">
              <Icon className="w-5 h-5" />
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">{label}</p>
            </div>
              <p className={`mt-5 ${label === "Estimated Fee" ? "text-emerald-600" : "text-zinc-900"} text-xl font-bold`}>
                {value}
              </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 text-[#2c49df]">
                <FileText className="w-5 h-5" />
                <h2 className="text-lg font-bold text-zinc-900">Client Info</h2>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Vendor</p>
                <p className="text-zinc-900 font-bold mt-2">Reliant Title &amp; Escrow</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Service Type</p>
                <p className="text-zinc-900 font-bold mt-2">Purchase</p>
              </div>
            </div>

            <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 text-[#2c49df]">
                <UserRound className="w-5 h-5" />
                <h2 className="text-lg font-bold text-zinc-900">Borrower Info</h2>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Primary Signer</p>
                <p className="text-zinc-900 font-bold mt-2">Kevin Baker</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Phone Number</p>
                <p className="text-[#2c49df] font-bold mt-2">+1 512-555-0123</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-100">
              <div className="flex items-center gap-3 text-[#2c49df]">
                <Home className="w-5 h-5" />
                <h2 className="text-lg font-bold text-zinc-900">Property &amp; Signing Location</h2>
              </div>
              <p className="text-zinc-900 font-semibold mt-5">123 Maple St, Austin, TX 78701</p>
              <p className="text-zinc-500 mt-2">Residential Property • Single Family Home</p>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Appointment Details</p>
              <p className="italic text-zinc-600 mt-4">&quot;Call upon arrival, park in driveway.&quot;</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
              <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">Documents</h2>
                <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2c49df] text-sm font-bold">2 Files</span>
              </div>
              <div className="mt-6 space-y-4">
                {["Purchase_Agreement.pdf", "Closing_Disclosure.pdf"].map((file) => (
                  <div key={file} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-zinc-800">{file}</span>
                    </div>
                    <button className="text-zinc-400 hover:text-[#2c49df]">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
              <h2 className="text-lg font-bold text-zinc-900">Signing Checklist</h2>
              <div className="mt-6 space-y-4">
                {["Verify ID", "Sign Documents", "Apply Seal", "Upload Signed Copies"].map((item) => (
                  <label key={item} className="flex items-center gap-3 text-zinc-700">
                    <input type="checkbox" className="w-5 h-5 rounded" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
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
            <div className="p-6 min-h-[220px]">
              <div className="max-w-2xl bg-zinc-50 rounded-[24px] p-5">
                <p className="text-zinc-400 text-sm font-bold">Vendor • 08:15 AM</p>
                <p className="text-sm font-medium text-zinc-700 mt-3">Hi, please ensure the signer has their current TX driver&apos;s license ready for verification.</p>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-100">
              <div className="flex items-center gap-3 border border-zinc-200 rounded-2xl px-4 py-3">
                <input type="text" placeholder="Type a message to participants..." className="flex-1 focus:outline-none" />
                <button className="text-[#2c49df] font-bold">Send</button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-zinc-900">Payment Details</h2>
              <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-sm font-bold">Pending</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {[
                ["Notary Fee", "$150.00"],
                ["Travel Fee", "$25.00"],
                ["Total Payout", "$175.00"],
              ].map(([label, value], index) => (
                <div key={label}>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">{label}</p>
                  <p className={`mt-3 text-3xl font-bold ${index === 2 ? "text-[#2c49df]" : "text-zinc-900"}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white border border-indigo-100 rounded-[24px] p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Workflow Actions</h2>
            <div className="mt-6 space-y-4">
              <button className="w-full py-4 rounded-2xl border border-[#2c49df] text-[#2c49df] font-bold">Accept Assignment</button>
              <button className="w-full py-4 rounded-2xl bg-[#2c49df] text-white font-bold flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Start Signing
              </button>
              <button className="w-full py-4 rounded-2xl bg-zinc-100 text-zinc-500 font-bold flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Documents
              </button>
              <button className="w-full py-4 rounded-2xl bg-zinc-100 text-zinc-400 font-bold">
                Mark as Completed
              </button>
              <p className="text-center text-sm text-zinc-400">Available after document upload</p>
            </div>
          </div>

          <div className="bg-white border border-indigo-100 rounded-[24px] p-6 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full border-2 border-blue-100 flex items-center justify-center text-[#2c49df] mx-auto">
              <BadgeCheck className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-[#2c49df] mt-6">Digital Seal Enabled</p>
            <p className="text-sm font-medium text-zinc-500 mt-3">This order is protected by Notarix real-time verification logs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
