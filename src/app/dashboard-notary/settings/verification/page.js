"use client";

import { 
  Check, 
  Upload, 
  Eye, 
  Info
} from "lucide-react";

export default function NotaryVerificationPage() {
  const profileFields = [
    { label: "Company Logo", completed: true },
    { label: "Website", completed: false, actionText: "Add URL" },
    { label: "Address Line 1", completed: true },
    { label: "City", completed: true },
    { label: "ZIP", completed: true },
    { label: "Main Office Phone", completed: false, actionText: "Enter Phone" },
    { label: "Secondary Contact Name", completed: true },
    { label: "Secondary Contact Email", completed: true },
    { label: "Secondary Contact Phone", completed: false, actionText: "Enter Phone" },
  ];

  const requiredDocuments = [
    { label: "Service Agreement", completed: false, actionReq: true },
    { label: "Billing Setup Form", completed: true },
    { label: "Primary & Secondary Contact Confirmation", completed: true },
    { label: "W-9", completed: false },
    { label: "Business License or Registration", completed: false },
    { label: "E&O Certificate", completed: true },
    { label: "Portal Access Authorization", completed: false },
  ];

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          
          {/* Left Column: Profile fields */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Profile fields</h2>
              <span className="text-sm font-medium text-zinc-500">5/8 Completed</span>
            </div>
            
            <div className="space-y-3">
              {profileFields.map((field, i) => (
                <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
                  field.completed ? "bg-zinc-50/50 border-zinc-200" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      field.completed ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100"
                    }`}>
                      {field.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-medium text-zinc-700">{field.label}</span>
                  </div>
                  {!field.completed && field.actionText && (
                    <button className="text-xs font-bold text-[#1a4fdb] hover:underline">
                      {field.actionText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Required documents */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Required documents</h2>
              <span className="text-sm font-medium text-zinc-500">3/7 Uploaded</span>
            </div>

            <div className="space-y-3">
              {requiredDocuments.map((doc, i) => (
                <div key={i} className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
                  doc.completed ? "bg-zinc-50/50 border-zinc-200" : "bg-white border-zinc-200"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      doc.completed ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100"
                    }`}>
                      {doc.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-sm font-medium text-zinc-700">{doc.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {!doc.completed && doc.actionReq && (
                       <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Action Req.</span>
                    )}
                    {doc.completed ? (
                      <button className="text-zinc-400 hover:text-zinc-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="text-[#1a4fdb] hover:text-[#1541b8] transition-colors">
                        <Upload className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 flex gap-4 mt-6">
              <div className="shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-[#1a4fdb]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1a4fdb] mb-1">Processing Time</h4>
                <p className="text-xs font-medium text-zinc-600 leading-relaxed">
                  Required documents are typically reviewed within 24 business hours. You will receive a notification once your verification level is upgraded.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Fixed Bar */}
      <div className="p-6 border-t border-zinc-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-48 h-2 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#1a4fdb] w-[53%] rounded-full"></div>
          </div>
          <span className="text-xs font-medium text-zinc-500">Overall Progress: 53%</span>
        </div>
        <button className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
          Submit for Review
        </button>
      </div>

    </div>
  );
}
