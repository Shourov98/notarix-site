"use client";

import { 
  Info, 
  Building2, 
  MapPin, 
  Users, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ShieldCheck,
  ChevronDown,
  Upload,
  Clock
} from "lucide-react";

export default function ProfileDetailsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Client Profile Setup</h1>
        <p className="text-zinc-500 font-medium text-sm">Complete all required fields and documentation to finalize the verification process.</p>
      </div>

      <div className="p-8 space-y-10">
        {/* Info Alert */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-[20px] p-5 flex gap-4">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-[#1a4fdb]" />
          </div>
          <p className="text-sm font-medium text-blue-700 leading-relaxed">
            100% completion is required for administrative review and subsequent order creation. Please ensure all uploaded documents are clear and legible.
          </p>
        </div>

        {/* What Remains Table-like Section */}
        <div className="border border-blue-200 rounded-[24px] overflow-hidden">
          <div className="p-4 border-b border-zinc-100">
            <h2 className="text-lg font-bold text-zinc-900">What Remains</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Col: Profile Fields */}
            <div className="p-6 border-r border-zinc-100 space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-50 pb-2">Profile Fields</h3>
              <div className="space-y-3">
                {[
                  { label: "Company Logo", status: "MISSING", color: "bg-amber-50 text-amber-600" },
                  { label: "Website URL", status: "COMPLETED", color: "bg-emerald-50 text-emerald-600" },
                  { label: "Full Office Address", status: "MISSING", color: "bg-amber-50 text-amber-600" },
                  { label: "Primary Office Phone", status: "COMPLETED", color: "bg-emerald-50 text-emerald-600" },
                  { label: "Secondary Contact Details", status: "MISSING", color: "bg-amber-50 text-amber-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-600">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Right Col: Required Documents */}
            <div className="p-6 space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-50 pb-2">Required Documents</h3>
              <div className="space-y-3">
                {[
                  { label: "Service Agreement", status: "MISSING", color: "bg-amber-50 text-amber-600" },
                  { label: "W-9 Form", status: "COMPLETED", color: "bg-emerald-50 text-emerald-600" },
                  { label: "E&O Certificate", status: "MISSING", color: "bg-amber-50 text-amber-600" },
                  { label: "Business License", status: "MISSING", color: "bg-amber-50 text-amber-600" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-600">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Organization Information */}
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <Building2 className="w-5 h-5 text-[#1a4fdb]" />
            <h2 className="text-lg font-bold text-zinc-900">Organization Information</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Company Name</label>
              <input type="text" defaultValue="Acme Legal Services Corp." className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Website</label>
                <input type="text" defaultValue="https://www.example.com" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Company Type</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all">
                    <option>Law Firm</option>
                    <option>Real Estate</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Office Phones</label>
              <input type="text" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all" />
            </div>
          </div>
        </div>

        {/* Section: Mailing Address */}
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <MapPin className="w-5 h-5 text-[#1a4fdb]" />
            <h2 className="text-lg font-bold text-zinc-900">Mailing Address</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Line 1</label>
              <input type="text" placeholder="Street address or P.O. Box" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Line 2 (Optional)</label>
              <input type="text" placeholder="Apartment, suite, unit, building, floor" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">City</label>
                <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">State</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm appearance-none">
                    <option>NY</option>
                    <option>CA</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zip</label>
                <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Representatives */}
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-10">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <Users className="w-5 h-5 text-[#1a4fdb]" />
            <h2 className="text-lg font-bold text-zinc-900">Representatives</h2>
          </div>
          
          {/* Primary */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest">Primary Representative</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone</label>
                <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Secondary Representative</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone</label>
                <input type="text" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Document Workspace */}
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
            <div className="flex items-center gap-3">
              <UploadCloud className="w-5 h-5 text-[#1a4fdb]" />
              <h2 className="text-lg font-bold text-zinc-900">Document Workspace</h2>
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">2 of 7 Uploaded</span>
          </div>
          
          <div className="space-y-4">
            {[
              { label: "Service Agreement", sub: "Master services and confidentiality agreement.", status: "MISSING", statusColor: "text-amber-600 bg-amber-50" },
              { label: "W-9 Form", sub: "Request for Taxpayer Identification Number.", status: "UPLOADED", statusColor: "text-emerald-600 bg-emerald-50", uploaded: true },
              { label: "E&O Certificate", sub: "Proof of Errors and Omissions Insurance.", status: "MISSING", statusColor: "text-amber-600 bg-amber-50" },
            ].map((doc) => (
              <div key={doc.label} className="p-5 border border-zinc-100 rounded-2xl flex items-center justify-between hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.uploaded ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                    {doc.uploaded ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <FileText className="w-5 h-5 text-[#1a4fdb]" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{doc.label}</h4>
                    <p className="text-xs font-medium text-zinc-400">{doc.sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-widest ${doc.statusColor}`}>{doc.status}</span>
                  <button className="flex items-center gap-2 text-xs font-bold text-[#1a4fdb] hover:underline">
                    {doc.uploaded ? "Replace" : "Upload"}
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          {/* Seal Status Card */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full border-4 border-blue-50 flex items-center justify-center shadow-lg shadow-blue-50/50">
              <ShieldCheck className="w-10 h-10 text-[#1a4fdb]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[4px]">Seal Pending</h3>
              <p className="text-xs font-medium text-zinc-400 leading-relaxed max-w-[240px]">
                The Digital Seal will be issued upon 100% verification of documentation.
              </p>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-8">
            <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Recent Activity</h3>
            <div className="space-y-8 relative pl-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-zinc-100">
              {[
                { title: "W-9 Form Uploaded", time: "2 HOURS AGO • BY SYSTEM", current: true },
                { title: "Company Type Modified", time: "YESTERDAY • BY USER" },
                { title: "Client Profile Created", time: "OCT 10, 2023 • BY SYSTEM" },
              ].map((activity, i) => (
                <div key={i} className="relative">
                  <div className={`absolute left-[-23px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${activity.current ? 'bg-[#1a4fdb] ring-4 ring-blue-50' : 'bg-zinc-200'}`}></div>
                  <h4 className={`text-xs font-bold ${activity.current ? 'text-zinc-900' : 'text-zinc-500'}`}>{activity.title}</h4>
                  <p className="text-[9px] font-bold text-zinc-400 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
