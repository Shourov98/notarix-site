"use client";

import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchClientProfileDetails,
  saveClientProfileDetailsThunk,
  selectSitePortal,
  uploadClientProfileDocumentThunk,
} from "@/store/sitePortalSlice";

const defaultForm = {
  organization: { companyName: "", website: "", companyType: "", officePhone: "" },
  address: { line1: "", line2: "", city: "", state: "", zip: "" },
  representatives: {
    primary: { name: "", email: "", phone: "" },
    secondary: { name: "", email: "", phone: "" },
  },
};

export default function ProfileDetailsPage() {
  const dispatch = useAppDispatch();
  const {
    clientProfileDetails,
    clientProfileDetailsStatus,
    clientProfileDetailsSaveStatus,
    clientProfileDocumentUploadStatus,
  } = useAppSelector(selectSitePortal);

  const [form, setForm] = useState(defaultForm);
  const fileInputs = useRef({});

  useEffect(() => {
    dispatch(fetchClientProfileDetails());
  }, [dispatch]);

  useEffect(() => {
    if (clientProfileDetails) {
      setForm({
        organization: {
          companyName: clientProfileDetails.organization?.companyName || "",
          website: clientProfileDetails.organization?.website || "",
          companyType: clientProfileDetails.organization?.companyType || "",
          officePhone: clientProfileDetails.organization?.officePhone || "",
        },
        address: {
          line1: clientProfileDetails.address?.line1 || "",
          line2: clientProfileDetails.address?.line2 || "",
          city: clientProfileDetails.address?.city || "",
          state: clientProfileDetails.address?.state || "",
          zip: clientProfileDetails.address?.zip || "",
        },
        representatives: {
          primary: {
            name: clientProfileDetails.representatives?.primary?.name || "",
            email: clientProfileDetails.representatives?.primary?.email || "",
            phone: clientProfileDetails.representatives?.primary?.phone || "",
          },
          secondary: {
            name: clientProfileDetails.representatives?.secondary?.name || "",
            email: clientProfileDetails.representatives?.secondary?.email || "",
            phone: clientProfileDetails.representatives?.secondary?.phone || "",
          },
        },
      });
    }
  }, [clientProfileDetails]);

  const updateOrg = (field, value) =>
    setForm((c) => ({ ...c, organization: { ...c.organization, [field]: value } }));
  const updateAddress = (field, value) =>
    setForm((c) => ({ ...c, address: { ...c.address, [field]: value } }));
  const updateRep = (which, field, value) =>
    setForm((c) => ({
      ...c,
      representatives: {
        ...c.representatives,
        [which]: { ...c.representatives[which], [field]: value },
      },
    }));

  const handleSave = async () => {
    try {
      await dispatch(saveClientProfileDetailsThunk(form)).unwrap();
      toast.success("Profile details saved.");
      dispatch(fetchClientProfileDetails());
    } catch (error) {
      toast.error(error || "Unable to save profile details.");
    }
  };

  const handleUploadClick = (documentKey) => {
    fileInputs.current[documentKey]?.click();
  };

  const handleFileChange = async (documentKey, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(
        uploadClientProfileDocumentThunk({ documentKey, file })
      ).unwrap();
      toast.success(`${file.name} uploaded.`);
      dispatch(fetchClientProfileDetails());
    } catch (error) {
      toast.error(error || "Upload failed.");
    } finally {
      event.target.value = "";
    }
  };

  const loading = clientProfileDetailsStatus === "loading";
  const saving = clientProfileDetailsSaveStatus === "loading";
  const uploading = clientProfileDocumentUploadStatus === "loading";

  const documents = clientProfileDetails?.documents || [];
  const checks = clientProfileDetails?.checks;
  const profileChecks = checks?.profile || [];
  const documentChecks = checks?.documents || [];
  const completionPercent = checks?.completionPercent || 0;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h1 className="text-2xl font-bold text-zinc-900 mb-1">Client Profile Setup</h1>
        <p className="text-gray-700 font-medium text-sm">Complete all required fields and documentation to finalize the verification process.</p>
      </div>

      <div className="p-8 space-y-10">
        <div className="bg-blue-50/50 border border-blue-100 rounded-[20px] p-5 flex gap-4">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-[#1a4fdb]" />
          </div>
          <p className="text-sm font-medium text-blue-700 leading-relaxed">
            {completionPercent}% complete. 100% completion is required for administrative review and subsequent order creation.
          </p>
        </div>

        {loading ? (
          <p className="text-sm font-medium text-gray-700">Loading profile details…</p>
        ) : null}

        {!loading && (profileChecks.length > 0 || documentChecks.length > 0) ? (
          <div className="border border-blue-200 rounded-[24px] overflow-hidden">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-zinc-900">What Remains</h2>
              <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                {checks?.completedChecks || 0} of {checks?.totalChecks || 0} done
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 border-r border-zinc-100 space-y-4">
                <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest border-b border-zinc-50 pb-2">Profile Fields</h3>
                <div className="space-y-3">
                  {profileChecks.map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-600">{item.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          item.complete
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.complete ? "COMPLETED" : "MISSING"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest border-b border-zinc-50 pb-2">Required Documents</h3>
                <div className="space-y-3">
                  {documentChecks.map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-600">{item.label}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          item.complete
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.complete ? "UPLOADED" : "MISSING"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <Building2 className="w-5 h-5 text-[#1a4fdb]" />
            <h2 className="text-lg font-bold text-zinc-900">Organization Information</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Company Name</label>
              <input
                type="text"
                value={form.organization.companyName}
                onChange={(event) => updateOrg("companyName", event.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Website</label>
                <input
                  type="text"
                  value={form.organization.website}
                  onChange={(event) => updateOrg("website", event.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Company Type</label>
                <div className="relative">
                  <select
                    value={form.organization.companyType}
                    onChange={(event) => updateOrg("companyType", event.target.value)}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                  >
                    <option value="">Select type…</option>
                    <option value="Law Firm">Law Firm</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Financial">Financial</option>
                    <option value="Other">Other</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Office Phone</label>
              <input
                type="text"
                value={form.organization.officePhone}
                onChange={(event) => updateOrg("officePhone", event.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <MapPin className="w-5 h-5 text-[#1a4fdb]" />
            <h2 className="text-lg font-bold text-zinc-900">Mailing Address</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Line 1</label>
              <input
                type="text"
                value={form.address.line1}
                onChange={(event) => updateAddress("line1", event.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Line 2 (Optional)</label>
              <input
                type="text"
                value={form.address.line2}
                onChange={(event) => updateAddress("line2", event.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">City</label>
                <input
                  type="text"
                  value={form.address.city}
                  onChange={(event) => updateAddress("city", event.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">State</label>
                <input
                  type="text"
                  value={form.address.state}
                  onChange={(event) => updateAddress("state", event.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Zip</label>
                <input
                  type="text"
                  value={form.address.zip}
                  onChange={(event) => updateAddress("zip", event.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-10">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <Users className="w-5 h-5 text-[#1a4fdb]" />
            <h2 className="text-lg font-bold text-zinc-900">Representatives</h2>
          </div>

          {["primary", "secondary"].map((which) => (
            <div key={which} className="space-y-6">
              <h3 className={`text-[10px] font-bold ${which === "primary" ? "text-[#1a4fdb]" : "text-gray-700"} uppercase tracking-widest`}>
                {which === "primary" ? "Primary Representative" : "Secondary Representative"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { field: "name", label: "Full Name", type: "text" },
                  { field: "email", label: "Email", type: "email" },
                  { field: "phone", label: "Phone", type: "text" },
                ].map((input) => (
                  <div key={input.field} className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{input.label}</label>
                    <input
                      type={input.type}
                      value={form.representatives[which][input.field]}
                      onChange={(event) => updateRep(which, input.field, event.target.value)}
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
            <div className="flex items-center gap-3">
              <UploadCloud className="w-5 h-5 text-[#1a4fdb]" />
              <h2 className="text-lg font-bold text-zinc-900">Document Workspace</h2>
            </div>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
              {documentChecks.filter((c) => c.complete).length} of {documentChecks.length} Uploaded
            </span>
          </div>

          <div className="space-y-4">
            {documents.length === 0 ? (
              <p className="text-sm font-medium text-gray-700">No required documents yet.</p>
            ) : (
              documents.map((doc) => {
                const uploaded = doc.status && doc.status !== "Missing";
                return (
                  <div
                    key={doc.key}
                    className="p-5 border border-zinc-100 rounded-2xl flex items-center justify-between hover:border-blue-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          uploaded ? "bg-emerald-50" : "bg-blue-50"
                        }`}
                      >
                        {uploaded ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-[#1a4fdb]" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">{doc.title}</h4>
                        <p className="text-xs font-medium text-gray-700">
                          {doc.optional ? "Optional" : "Required"} •{" "}
                          {uploaded ? `Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}` : "Not yet uploaded"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold tracking-widest ${
                          uploaded
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-amber-600 bg-amber-50"
                        }`}
                      >
                        {uploaded ? "UPLOADED" : "MISSING"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUploadClick(doc.key)}
                        disabled={uploading}
                        className="flex items-center gap-2 text-xs font-bold text-[#1a4fdb] hover:underline disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {uploaded ? "Replace" : "Upload"}
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                      <input
                        ref={(el) => {
                          fileInputs.current[doc.key] = el;
                        }}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={(event) => handleFileChange(doc.key, event)}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-end max-w-4xl">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#1a4fdb] text-white px-10 py-3.5 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {saving ? "Saving…" : "Save Details"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
          <div className="bg-white border border-zinc-100 rounded-[32px] p-12 shadow-sm flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full border-4 border-blue-50 flex items-center justify-center shadow-lg shadow-blue-50/50">
              <ShieldCheck className="w-10 h-10 text-[#1a4fdb]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-[4px]">
                {completionPercent === 100 ? "Seal Issued" : "Seal Pending"}
              </h3>
              <p className="text-xs font-medium text-gray-700 leading-relaxed max-w-[240px]">
                The Digital Seal will be issued upon 100% verification of documentation.
              </p>
            </div>
          </div>

          <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-8">
            <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Recent Activity</h3>
            <div className="space-y-6 relative pl-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-zinc-100">
              {(clientProfileDetails?.activity || []).length === 0 ? (
                <p className="text-xs font-medium text-gray-700">No recent activity yet.</p>
              ) : (
                (clientProfileDetails.activity || []).map((entry, idx) => (
                  <div key={entry.id || idx} className="relative">
                    <div className={`absolute left-[-23px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${idx === 0 ? "bg-[#1a4fdb] ring-4 ring-blue-50" : "bg-zinc-200"}`} />
                    <h4 className="text-xs font-bold text-zinc-900">{entry.title}</h4>
                    <p className="text-[9px] font-bold text-gray-700 mt-1">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}