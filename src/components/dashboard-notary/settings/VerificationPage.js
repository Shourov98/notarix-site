import { CircleAlert, CircleCheckBig, Eye, Upload } from "lucide-react";

const fields = [
  { label: "Company Logo", complete: true },
  { label: "Website", action: "Add URL" },
  { label: "Address Line 1", complete: true },
  { label: "City", complete: true },
  { label: "ZIP", complete: true },
  { label: "Main Office Phone", action: "Enter Phone" },
  { label: "Secondary Contact Name", complete: true },
  { label: "Secondary Contact Email", complete: true },
  { label: "Secondary Contact Phone", action: "Enter Phone" },
];

const documents = [
  { label: "Service Agreement", alert: "Action Req." },
  { label: "Billing Setup Form", complete: true, view: true },
  { label: "Primary & Secondary Contact Confirmation", complete: true, view: true },
  { label: "W-9", upload: true },
  { label: "Business License or Registration", upload: true },
  { label: "E&O Certificate", complete: true, view: true },
  { label: "Portal Access Authorization", upload: true },
];

export default function VerificationPage() {
  return (
    <div className="p-8">
      <div className="bg-white border border-indigo-100 rounded-[24px] overflow-hidden">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="p-6 border-r border-zinc-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Profile fields</h2>
              <p className="text-sm font-medium text-gray-700">5/8 Completed</p>
            </div>
            <div className="mt-6 space-y-4">
              {fields.map((field) => (
                <div key={field.label} className="flex items-center justify-between px-4 py-4 rounded-2xl border border-zinc-200">
                  <div className="flex items-center gap-4">
                    {field.complete ? (
                      <CircleCheckBig className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-zinc-200"></div>
                    )}
                    <span className="text-zinc-700">{field.label}</span>
                  </div>
                  {field.action && <button className="text-[#2c49df] font-bold text-sm">{field.action}</button>}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900">Required documents</h2>
              <p className="text-sm font-medium text-gray-700">3/7 Uploaded</p>
            </div>
            <div className="mt-6 space-y-4">
              {documents.map((document) => (
                <div key={document.label} className="flex items-center justify-between px-4 py-4 rounded-2xl border border-zinc-200">
                  <div className="flex items-center gap-4">
                    {document.complete ? (
                      <CircleCheckBig className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-zinc-200"></div>
                    )}
                    <span className="text-zinc-700">{document.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {document.alert && <span className="text-orange-500 text-sm font-bold uppercase">{document.alert}</span>}
                    {document.view && <Eye className="w-4 h-4 text-gray-700" />}
                    {document.upload && <Upload className="w-4 h-4 text-[#2c49df]" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-[#eef2ff] rounded-[24px] p-6 flex gap-4">
              <CircleAlert className="w-6 h-6 text-[#2c49df] shrink-0 mt-1" />
              <div>
                <p className="text-[#2c49df] font-bold">Processing Time</p>
                <p className="text-zinc-600 mt-3 leading-relaxed">
                  Required documents are typically reviewed within 24 business hours. You will receive a notification once your verification level is upgraded.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-t border-zinc-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-32 h-3 rounded-full bg-zinc-100 overflow-hidden">
              <div className="w-[53%] h-full bg-[#2c49df]"></div>
            </div>
            <p className="text-sm font-medium text-gray-700">Overall Progress: 53%</p>
          </div>
          <button className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100">
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}
