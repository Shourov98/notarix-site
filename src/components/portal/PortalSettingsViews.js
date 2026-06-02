"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  CreditCard,
  FileBadge2,
  FileText,
  Loader2,
  MapPin,
  Save,
  ShieldCheck,
  UploadCloud,
  UserRound,
  Users,
} from "lucide-react";
import {
  invalidatePortalCache,
  requestPortalJson,
} from "@/lib/portal-api";

const rolePath = {
  client: "client",
  notary: "notary",
};

function SettingsShell({ title, description, icon: Icon, children }) {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-zinc-100 bg-zinc-50/50 p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1a4fdb]">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">{title}</h2>
            <p className="mt-2 text-sm leading-7 text-zinc-500">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}

function SettingsError({ message }) {
  return (
    <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        <p className="text-sm leading-7">{message}</p>
      </div>
    </div>
  );
}

function SettingsLoading() {
  return (
    <div className="flex items-center justify-center gap-3 rounded-[24px] border border-zinc-100 bg-white px-6 py-16 text-zinc-500">
      <Loader2 className="h-5 w-5 animate-spin" />
      Loading live account data...
    </div>
  );
}

function SettingsNotice({ title, description }) {
  return (
    <div className="rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50/60 p-6">
      <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-zinc-500">{description}</p>
    </div>
  );
}

function usePortalOverview(role) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const payload = await requestPortalJson(`/site/${rolePath[role]}/overview`);
        if (!cancelled) {
          setData(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load account overview.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [role]);

  return { data, loading, error };
}

function usePortalBankInfo(role, enabled = false) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const payload = await requestPortalJson(`/site/${rolePath[role]}/bank-info`);
        if (!cancelled) {
          setData(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load bank information.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [enabled, role]);

  return { data, loading, error };
}

export function PortalProfileSettings({ role }) {
  const { data, loading, error } = usePortalOverview(role);
  const profile = data?.profile || {};
  const [liveProfile, setLiveProfile] = useState(profile);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLiveProfile(profile);
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      company: profile.company || "",
    });
  }, [profile.company, profile.email, profile.name, profile.phone]);

  const initials = useMemo(() => {
    const source = form.name || form.email || "";
    const letter = source.trim().charAt(0).toUpperCase();
    return letter || (role === "client" ? "C" : "N");
  }, [form.email, form.name, role]);

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const refreshProfile = async () => {
    invalidatePortalCache(`/site/${rolePath[role]}/overview`);
    const payload = await requestPortalJson(`/site/${rolePath[role]}/overview`);
    const nextProfile = payload?.profile || null;
    setLiveProfile(nextProfile);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notarix:profile-updated"));
    }
    return nextProfile;
  };

  const handleSave = async () => {
    setSaving(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await requestPortalJson(`/site/${rolePath[role]}/profile`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      await refreshProfile();
      setSubmitSuccess("Profile updated successfully.");
    } catch (saveError) {
      setSubmitError(saveError.message || "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const formData = new FormData();
      formData.append("profilePhoto", file);
      await requestPortalJson(`/site/${rolePath[role]}/profile-photo`, {
        method: "POST",
        body: formData,
      });
      await refreshProfile();
      setSubmitSuccess("Profile photo updated successfully.");
    } catch (uploadError) {
      setSubmitError(uploadError.message || "Unable to upload profile photo.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <SettingsShell
      title="Profile Information"
      description="Manage account preferences"
      icon={UserRound}
    >
      {loading ? <SettingsLoading /> : null}
      {!loading && error ? <SettingsError message={error} /> : null}
      {!loading && !error ? (
        <div className="overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-8 py-5">
            <h3 className="text-xl font-semibold text-zinc-900">Profile Information</h3>
          </div>

          <div className="space-y-8 px-8 py-8">
            {submitError ? <SettingsError message={submitError} /> : null}
            {submitSuccess ? (
              <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                {submitSuccess}
              </div>
            ) : null}

            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="relative">
                {liveProfile?.avatar ? (
                  <img
                    src={liveProfile.avatar}
                    alt={liveProfile.name || liveProfile.email || "Profile"}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-3xl font-bold text-zinc-700">
                    {initials}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white text-[#1a4fdb] shadow-md transition hover:bg-zinc-50"
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhoto}
                />
              </div>

              <div>
                <h4 className="text-2xl font-bold text-zinc-900">{form.name || "Profile User"}</h4>
                <p className="mt-1 text-sm text-zinc-500">
                  {liveProfile?.status || "Active"} • {liveProfile?.verification || "Pending"} • {role === "client" ? "Client" : "Notary"}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-sm font-bold text-[#1a4fdb] hover:underline"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Change photo"}
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField("name")}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={updateField("phone")}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Company Name
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={updateField("company")}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1a4fdb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SettingsShell>
  );
}

export function PortalProfileDetailsSettings({ role }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(role === "client");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [form, setForm] = useState({
    organization: {
      companyName: "",
      website: "",
      companyType: "",
      officePhone: "",
    },
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
    },
    primaryRepresentative: {
      name: "",
      email: "",
      phone: "",
    },
    secondaryRepresentative: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (role !== "client") return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const payload = await requestPortalJson("/site/client/profile-details");
        if (!cancelled) {
          setData(payload);
          setForm({
            organization: payload.organization || {
              companyName: "",
              website: "",
              companyType: "",
              officePhone: "",
            },
            address: payload.address || {
              line1: "",
              line2: "",
              city: "",
              state: "",
              zip: "",
            },
            primaryRepresentative: payload.representatives?.primary || {
              name: "",
              email: "",
              phone: "",
            },
            secondaryRepresentative: payload.representatives?.secondary || {
              name: "",
              email: "",
              phone: "",
            },
          });
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load profile details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [role]);

  const refreshDetails = async () => {
    invalidatePortalCache("/site/client/profile-details");
    invalidatePortalCache("/site/client/overview");
    const payload = await requestPortalJson("/site/client/profile-details");
    setData(payload);
    setForm({
      organization: payload.organization || form.organization,
      address: payload.address || form.address,
      primaryRepresentative: payload.representatives?.primary || form.primaryRepresentative,
      secondaryRepresentative:
        payload.representatives?.secondary || form.secondaryRepresentative,
    });
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("notarix:profile-updated"));
    }
    return payload;
  };

  const updateNestedField = (section, key) => (event) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: event.target.value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await requestPortalJson("/site/client/profile-details", {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      await refreshDetails();
      setSubmitSuccess("Profile details updated successfully.");
    } catch (saveError) {
      setSubmitError(saveError.message || "Unable to update profile details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDocumentUpload = (documentKey) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingKey(documentKey);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const formData = new FormData();
      formData.append("document", file);
      await requestPortalJson(`/site/client/profile-documents/${documentKey}`, {
        method: "POST",
        body: formData,
      });
      await refreshDetails();
      setSubmitSuccess("Document uploaded successfully.");
    } catch (uploadError) {
      setSubmitError(uploadError.message || "Unable to upload document.");
    } finally {
      setUploadingKey("");
      event.target.value = "";
    }
  };

  const profile = data?.profile || {};
  const checks = data?.checks || { profile: [], documents: [], completedChecks: 0, totalChecks: 0, completionPercent: 0 };
  const documents = data?.documents || [];
  const activity = data?.activity || [];

  const statusClasses = {
    Missing: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    Uploaded: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    Verified: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    Rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    Pending: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  };

  return (
    <SettingsShell
      title="Profile Details"
      description="Track profile completeness, representatives, and the client documents your team wants monitored."
      icon={UserRound}
    >
      {role !== "client" ? (
        <SettingsNotice
          title="Client profile setup only"
          description="This detailed setup screen is currently enabled for the client portal. Notary profile tracking can be expanded in the same way when you want it."
        />
      ) : null}
      {loading ? <SettingsLoading /> : null}
      {!loading && error ? <SettingsError message={error} /> : null}
      {!loading && !error && role === "client" ? (
        <div className="space-y-8">
          {submitError ? <SettingsError message={submitError} /> : null}
          {submitSuccess ? (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {submitSuccess}
            </div>
          ) : null}

          <div>
            <h3 className="text-4xl font-bold tracking-tight text-zinc-900">Client Profile Setup</h3>
            <p className="mt-3 text-base leading-7 text-zinc-500">
              Complete the live company profile and keep the tracked client documents up to date. The tracked documents below are optional, but we still monitor whether they are missing or already on file.
            </p>
          </div>

          <div className="rounded-[24px] border border-blue-200 bg-blue-50/70 px-5 py-4 text-sm leading-7 text-blue-700">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                {checks.completionPercent}% completion across profile details and tracked documents.
                Uploading the optional client documents is not mandatory, but this page will still track whether each one is currently missing, uploaded, verified, or rejected.
              </p>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_360px]">
            <div className="space-y-8">
              <div className="rounded-[28px] border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#1a4fdb]">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-zinc-900">What Remains</h4>
                    <p className="mt-1 text-sm text-zinc-500">
                      {checks.completedChecks} of {checks.totalChecks} tracked items completed.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                      Profile Fields
                    </p>
                    <div className="mt-4 space-y-3">
                      {checks.profile.map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3">
                          <span className="text-sm font-medium text-zinc-700">{item.label}</span>
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
                              item.complete
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {item.complete ? "Completed" : "Missing"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                      Tracked Client Documents
                    </p>
                    <div className="mt-4 space-y-3">
                      {checks.documents.map((item) => (
                        <div key={item.key} className="flex items-center justify-between gap-4 rounded-2xl bg-zinc-50 px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-zinc-700">{item.label}</p>
                            <p className="mt-1 text-xs text-zinc-400">Optional but tracked</p>
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
                              statusClasses[item.status] || statusClasses.Missing
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-zinc-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#1a4fdb]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-zinc-900">Organization Information</h4>
                    <p className="mt-1 text-sm text-zinc-500">Live company details stored against the client account.</p>
                  </div>
                </div>
                <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={form.organization.companyName}
                      onChange={updateNestedField("organization", "companyName")}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Website
                    </label>
                    <input
                      type="text"
                      value={form.organization.website}
                      onChange={updateNestedField("organization", "website")}
                      placeholder="https://example.com"
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Company Type
                    </label>
                    <input
                      type="text"
                      value={form.organization.companyType}
                      onChange={updateNestedField("organization", "companyType")}
                      placeholder="LLC, Corporation, Law Firm..."
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Office Phone
                    </label>
                    <input
                      type="text"
                      value={form.organization.officePhone}
                      onChange={updateNestedField("organization", "officePhone")}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-zinc-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#1a4fdb]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-zinc-900">Mailing Address</h4>
                    <p className="mt-1 text-sm text-zinc-500">This address is used for office and account record tracking.</p>
                  </div>
                </div>
                <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Line 1
                    </label>
                    <input
                      type="text"
                      value={form.address.line1}
                      onChange={updateNestedField("address", "line1")}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      Line 2
                    </label>
                    <input
                      type="text"
                      value={form.address.line2}
                      onChange={updateNestedField("address", "line2")}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                      City
                    </label>
                    <input
                      type="text"
                      value={form.address.city}
                      onChange={updateNestedField("address", "city")}
                      className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                    />
                  </div>
                  <div className="grid gap-5 grid-cols-[minmax(0,1fr)_140px] md:col-span-1">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                        State
                      </label>
                      <input
                        type="text"
                        value={form.address.state}
                        onChange={updateNestedField("address", "state")}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={form.address.zip}
                        onChange={updateNestedField("address", "zip")}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-zinc-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#1a4fdb]">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-zinc-900">Representatives</h4>
                    <p className="mt-1 text-sm text-zinc-500">Primary and secondary contact information tracked for the client account.</p>
                  </div>
                </div>

                <div className="space-y-8 px-6 py-6">
                  {[
                    ["Primary Representative", "primaryRepresentative"],
                    ["Secondary Representative", "secondaryRepresentative"],
                  ].map(([label, key]) => (
                    <div key={key}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a4fdb]">{label}</p>
                      <div className="mt-4 grid gap-5 md:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={form[key].name}
                            onChange={updateNestedField(key, "name")}
                            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                            Email
                          </label>
                          <input
                            type="email"
                            value={form[key].email}
                            onChange={updateNestedField(key, "email")}
                            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={form[key].phone}
                            onChange={updateNestedField(key, "phone")}
                            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-zinc-100 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#1a4fdb]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-zinc-900">Document Workspace</h4>
                      <p className="mt-1 text-sm text-zinc-500">Tracked client documents, even when they are optional.</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-500">
                    {documents.filter((item) => item.status !== "Missing").length} of {documents.length} tracked
                  </div>
                </div>

                <div className="space-y-4 px-6 py-6">
                  {documents.map((document) => (
                    <div key={document.key} className="rounded-[24px] border border-zinc-100 bg-zinc-50/60 p-5">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-[#1a4fdb] shadow-sm">
                            <FileBadge2 className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <h5 className="text-lg font-bold text-zinc-900">{document.title}</h5>
                              <span
                                className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
                                  statusClasses[document.displayStatus] || statusClasses.Missing
                                }`}
                              >
                                {document.displayStatus}
                              </span>
                              <span className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
                                Optional
                              </span>
                            </div>
                            <p className="mt-2 text-sm leading-7 text-zinc-500">{document.description}</p>
                            <div className="mt-3 space-y-1 text-sm text-zinc-500">
                              <p>
                                File:{" "}
                                <span className="font-medium text-zinc-700">
                                  {document.fileName || "No file uploaded yet"}
                                </span>
                              </p>
                              <p>
                                Updated:{" "}
                                <span className="font-medium text-zinc-700">
                                  {document.uploadedAt
                                    ? new Date(document.uploadedAt).toLocaleString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                      })
                                    : "Not uploaded yet"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          {document.viewUrl ? (
                            <a
                              href={document.viewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
                            >
                              View Document
                            </a>
                          ) : null}

                          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#1a4fdb] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8]">
                            {uploadingKey === document.key ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                              </>
                            ) : document.viewUrl ? (
                              <>
                                Replace
                                <UploadCloud className="ml-2 h-4 w-4" />
                              </>
                            ) : (
                              <>
                                Upload
                                <UploadCloud className="ml-2 h-4 w-4" />
                              </>
                            )}
                            <input
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                              className="hidden"
                              onChange={handleDocumentUpload(document.key)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1a4fdb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-[28px] border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-[#1a4fdb]">
                    {(profile.name || profile.email || "C").trim().charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-900">{profile.name || "Client User"}</h4>
                    <p className="mt-1 text-sm text-zinc-500">{profile.email || "No email on file"}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-[#1a4fdb]" />
                    <div>
                      <p className="font-semibold text-zinc-900">Verification Status</p>
                      <p className="mt-1 text-zinc-500">{profile.verification || "Pending"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 text-[#1a4fdb]" />
                    <div>
                      <p className="font-semibold text-zinc-900">Organization</p>
                      <p className="mt-1 text-zinc-500">
                        {form.organization.companyName || "Company name not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-[#1a4fdb]" />
                    <div>
                      <p className="font-semibold text-zinc-900">Office Address</p>
                      <p className="mt-1 text-zinc-500">
                        {[form.address.line1, form.address.city, form.address.state, form.address.zip]
                          .filter(Boolean)
                          .join(", ") || "Address details still missing"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-zinc-100 bg-white p-6 shadow-sm">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-100 text-[#1a4fdb]">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h4 className="mt-6 text-lg font-bold uppercase tracking-[0.18em] text-zinc-800">
                  Seal Pending
                </h4>
                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  The account currently shows {checks.completionPercent}% of the tracked profile setup complete. As the remaining profile fields and optional tracked documents are added, this summary updates from live backend data.
                </p>
              </div>

              <div className="rounded-[28px] border border-zinc-100 bg-white p-6 shadow-sm">
                <h4 className="text-lg font-bold text-zinc-900">Recent Activity</h4>
                <div className="mt-6 space-y-5">
                  {activity.length ? (
                    activity.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1a4fdb]" />
                        <div>
                          <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-400">
                            {new Date(item.timestamp).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}{" "}
                            • {item.status}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-zinc-500">
                      No tracked document activity yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </SettingsShell>
  );
}

export function PortalSecuritySettings({ role }) {
  return (
    <SettingsShell
      title="Security"
      description="Security preferences should not display fake devices, sessions, or 2FA states."
      icon={ShieldCheck}
    >
      <SettingsNotice
        title="Live security controls are not exposed yet"
        description={`The current ${role} portal backend does not expose editable password, session history, or 2FA configuration for this screen. This page stays honest instead of rendering sample security data.`}
      />
    </SettingsShell>
  );
}

export function PortalNotificationsSettings({ role }) {
  return (
    <SettingsShell
      title="Notifications"
      description="Notification preferences should only appear when the backend has real persisted settings."
      icon={Bell}
    >
      <SettingsNotice
        title="No saved notification preferences yet"
        description={`The current ${role} portal does not expose live notification preference records. When those settings are added server-side, this page can bind to them directly.`}
      />
    </SettingsShell>
  );
}

export function PortalPaymentsSettings({ role }) {
  const { data, loading, error } = usePortalBankInfo(role, true);

  return (
    <SettingsShell
      title="Payment Settings"
      description="Bank and payout settings from the backend. No sample cards or fake billing rows."
      icon={CreditCard}
    >
      {loading ? <SettingsLoading /> : null}
      {!loading && error ? (
        <SettingsNotice
          title="Bank information not configured"
          description={error}
        />
      ) : null}
      {!loading && !error && data ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[
            ["Bank Name", data.bankName || "Not set"],
            ["Account Holder", data.accountHolderName || "Not set"],
            ["Account Type", data.accountType || "Not set"],
            ["Routing Number", data.routingNumber ? `•••••${String(data.routingNumber).slice(-4)}` : "Not set"],
            ["Account Number", data.accountNumber ? `••••${String(data.accountNumber).slice(-4)}` : "Not set"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[24px] border border-zinc-100 bg-zinc-50/60 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
              <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </SettingsShell>
  );
}

export function PortalVerificationSettings() {
  const { data, loading, error } = usePortalOverview("notary");
  const profile = data?.profile || {};
  const documents = data?.documents || [];

  return (
    <SettingsShell
      title="Verification"
      description="Live verification state for the notary account."
      icon={ShieldCheck}
    >
      {loading ? <SettingsLoading /> : null}
      {!loading && error ? <SettingsError message={error} /> : null}
      {!loading && !error ? (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["Verification", profile.verification || "Unknown"],
              ["Account Status", profile.status || "Unknown"],
              ["RON Eligible", profile.ronEligible ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[24px] border border-zinc-100 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{label}</p>
                <p className="mt-3 text-2xl font-bold text-zinc-900">{value}</p>
              </div>
            ))}
          </div>
          <SettingsNotice
            title={`${documents.length} verification document(s) on record`}
            description="This count is pulled from the backend profile. It replaces the old sample checklist."
          />
        </div>
      ) : null}
    </SettingsShell>
  );
}
