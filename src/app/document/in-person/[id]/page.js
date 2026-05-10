"use client";

import { 
  Printer, 
  Download, 
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function InPersonDocumentViewPage() {
  return (
    <div className="h-screen bg-[#eef0f4] flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-20 px-8 bg-white border-b border-zinc-200 flex items-center justify-between shrink-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 leading-tight">Document Preview</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
            Real Estate Closing Affidavit / ORD-77291-TX
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-50 transition-colors shadow-sm">
            Download
          </button>
          <button className="flex items-center gap-2 bg-[#1a4fdb] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-[#1541b8] transition-all">
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar: Pages */}
        <div className="w-40 bg-white border-r border-zinc-200 shrink-0 overflow-y-auto flex flex-col items-center py-6 gap-6 z-10">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Pages (28)</span>
          
          <div className="relative cursor-pointer group">
            <div className="w-24 h-32 bg-zinc-50 border-2 border-[#1a4fdb] rounded-lg shadow-sm"></div>
            <div className="absolute -bottom-2 -right-2 bg-[#1a4fdb] text-white text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center shadow-sm">
              1
            </div>
          </div>

          <div className="relative cursor-pointer group">
            <div className="w-24 h-32 bg-white border border-zinc-200 rounded-lg shadow-sm group-hover:border-zinc-300 transition-colors"></div>
            <div className="absolute -bottom-2 -right-2 bg-zinc-400 text-white text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center shadow-sm">
              2
            </div>
          </div>

          <div className="relative cursor-pointer group">
            <div className="w-24 h-32 bg-white border border-zinc-200 rounded-lg shadow-sm group-hover:border-zinc-300 transition-colors"></div>
            <div className="absolute -bottom-2 -right-2 bg-zinc-400 text-white text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center shadow-sm">
              3
            </div>
          </div>
          
          <div className="relative cursor-pointer group">
            <div className="w-24 h-32 bg-white border border-zinc-200 rounded-lg shadow-sm group-hover:border-zinc-300 transition-colors flex items-center justify-center">
              <span className="text-zinc-300 text-xs font-medium">description</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-zinc-400 text-white text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center shadow-sm">
              4
            </div>
          </div>
        </div>

        {/* Center: Document Viewer */}
        <div className="flex-1 overflow-y-auto p-12 flex justify-center relative">
          
          {/* Document Sheet */}
          <div className="bg-white w-full max-w-4xl shadow-2xl p-24 relative border border-zinc-200 min-h-[1000px] flex flex-col">
            
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[120px] font-black transform -rotate-45 tracking-widest">NOTARIX</span>
            </div>

            {/* Document Header */}
            <div className="flex justify-between items-start mb-16 relative z-10">
              <div>
                <h2 className="text-3xl font-bold text-zinc-900 mb-2">Affidavit of Title</h2>
                <p className="text-zinc-500 font-medium">State of Texas | County of Travis</p>
              </div>
              <div className="text-right">
                <p className="text-[#1a4fdb] font-bold text-lg">NOTARIX™ Verified</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">ID: TX-99201-B</p>
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-6 text-sm text-zinc-800 leading-loose relative z-10">
              <p>
                <strong>BE IT KNOWN</strong>, that on this day, before me, the undersigned Notary Public, personally
                appeared <strong>Jonathan Miller</strong>, known to me to be the person whose name is subscribed
                to the foregoing instrument, and acknowledged that he executed the same for the
                purposes therein contained.
              </p>
              <p>
                The affiant further deposes and says that they are the legal owner of the property
                situated at <strong>742 Evergreen Terrace, Austin, TX 78701</strong> and that no liens,
                encumbrances, or adverse claims exist against said property except as noted herein.
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-32 space-y-16 relative z-10">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">Affiant Signature</p>
                <div className="w-80 h-px bg-zinc-900"></div>
              </div>

              <div className="flex items-end gap-6">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest mb-2">Notary Public Signature & Seal</p>
                  <div className="w-96 border-b-2 border-dashed border-[#1a4fdb]"></div>
                </div>
                <div className="w-24 h-24 rounded-full border-4 border-blue-100 flex items-center justify-center bg-white shadow-sm shrink-0">
                  <ShieldCheck className="w-10 h-10 text-blue-200" />
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-auto pt-16 relative z-10">
              <p className="text-xs text-zinc-400 italic">
                This document was digitally prepared via Notarix™ Authority Systems. For verification purposes
                only. Physical seal required for finalization.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Details & Tools */}
        <div className="w-[380px] bg-white border-l border-zinc-200 shrink-0 flex flex-col z-10 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          
          {/* Status Header */}
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-bold">Ready for Signing</span>
            </div>
            <Lock className="w-4 h-4 text-zinc-400" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Document Details */}
            <div className="p-6 border-b border-zinc-100 space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Document Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">File Name</span>
                  <span className="text-zinc-900 font-bold">Affidavit_Title_TX.pdf</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Uploaded By</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-900 font-bold">Sarah Jenkins</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1a4fdb]" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Date</span>
                  <span className="text-zinc-900 font-bold">Oct 24, 2023</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500 font-medium">Total Pages</span>
                  <span className="text-zinc-900 font-bold">28 Pages</span>
                </div>
              </div>
            </div>

            {/* Preparation Checklist */}
            <div className="p-6 border-b border-zinc-100 space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Preparation Checklist</h3>
              <div className="space-y-3">
                {[
                  { label: "Document printed", checked: true },
                  { label: "Pages verified", checked: true },
                  { label: "ID verified", checked: false },
                  { label: "Signature spots checked", checked: false },
                  { label: "Notary tools ready", checked: false },
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      item.checked ? 'bg-[#1a4fdb] border-[#1a4fdb]' : 'bg-white border-zinc-300 group-hover:border-[#1a4fdb]'
                    }`}>
                      {item.checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${item.checked ? 'text-zinc-900' : 'text-zinc-700'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="p-6 space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Special Instructions</h3>
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl relative">
                <p className="text-sm font-medium text-zinc-700 leading-relaxed mb-6">
                  Bring extra blue pens, signer prefers physical copies. Ensure the property map on page 14 is highlighted for clear reference during signing.
                </p>
                <span className="absolute bottom-3 right-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Auto-saved</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-zinc-50 border-t border-zinc-200 mt-auto">
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[2px] text-center">Confidential Legal Workspace</p>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <footer className="h-12 bg-white border-t border-zinc-200 flex items-center justify-center z-10 px-6 shrink-0 relative">
        <span className="text-zinc-500 text-xs font-medium mx-auto">© 2026 Notarix™ Technologies Inc. All rights reserved.</span>
      </footer>
    </div>
  );
}
