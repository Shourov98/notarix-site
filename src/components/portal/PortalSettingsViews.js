"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  Camera,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileBadge2,
  FileText,
  Loader2,
  MapPin,
  Mail,
  MessageSquare,
  Receipt,
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

const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

const notarySpecialtyOptions = ["RON", "HELOC", "Purchase", "Seller Pkg"];

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

function useNotaryProfileDetails(enabled = true) {
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
        const payload = await requestPortalJson("/site/notary/profile-details");
        if (!cancelled) {
          setData(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load notary settings.");
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
  }, [enabled]);

  return { data, setData, loading, error };
}

export function PortalProfileSettings({ role }) {
  const { data, loading, error } = usePortalOverview(role);
  const profile = data?.profile || {};
  const isNotary = role === "notary";
  const [liveProfile, setLiveProfile] = useState(profile);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    coverageAreas: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
    },
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLiveProfile(profile);
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      company: profile.company || "",
      coverageAreas: profile.coverageAreas || "",
      address: {
        line1: profile.address?.line1 || "",
        line2: profile.address?.line2 || "",
        city: profile.address?.city || "",
        state: profile.address?.state || "",
        zip: profile.address?.zip || "",
      },
    });
  }, [
    profile.address?.city,
    profile.address?.line1,
    profile.address?.line2,
    profile.address?.state,
    profile.address?.zip,
    profile.company,
    profile.coverageAreas,
    profile.email,
    profile.name,
    profile.phone,
  ]);

  const initials = useMemo(() => {
    const source = form.name || form.email || "";
    const letter = source.trim().charAt(0).toUpperCase();
    return letter || (role === "client" ? "C" : "N");
  }, [form.email, form.name, role]);

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const updateAddressField = (key) => (event) => {
    setForm((current) => ({
      ...current,
      address: {
        ...current.address,
        [key]: event.target.value,
      },
    }));
  };

  const resetFormFromProfile = () => {
    setForm({
      name: liveProfile?.name || "",
      email: liveProfile?.email || "",
      phone: liveProfile?.phone || "",
      company: liveProfile?.company || "",
      coverageAreas: liveProfile?.coverageAreas || "",
      address: {
        line1: liveProfile?.address?.line1 || "",
        line2: liveProfile?.address?.line2 || "",
        city: liveProfile?.address?.city || "",
        state: liveProfile?.address?.state || "",
        zip: liveProfile?.address?.zip || "",
      },
    });
  };

  const refreshProfile = async () => {
    invalidatePortalCache(`/site/${rolePath[role]}/overview`);
    const payload = await requestPortalJson(`/site/${rolePath[role]}/overview`);
    const nextProfile = payload?.profile || null;
    setLiveProfile(nextProfile);
    setIsEditing(false);
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
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          coverageAreas: form.coverageAreas,
          address: form.address,
        }),
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
        isNotary ? (
          <div className="overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-zinc-100 px-8 py-8 md:flex-row md:items-center md:justify-between">
              <h3 className="text-[20px] font-semibold text-zinc-900">Profile Settings</h3>
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        resetFormFromProfile();
                        setSubmitError("");
                        setSubmitSuccess("");
                        setIsEditing(false);
                      }}
                      disabled={saving}
                      className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a4fdb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      resetFormFromProfile();
                      setSubmitError("");
                      setSubmitSuccess("");
                      setIsEditing(true);
                    }}
                    className="inline-flex items-center justify-center rounded-xl bg-[#1a4fdb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8]"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
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
                      className="h-24 w-24 rounded-full object-cover shadow-md"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 text-4xl font-bold text-zinc-700">
                      {initials}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white bg-white text-[#1a4fdb] shadow-md transition hover:bg-zinc-50"
                    disabled={uploading || !isEditing}
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
                  <div className="flex items-center gap-2">
                    <h4 className="text-[20px] font-semibold text-zinc-900">{form.name || "Notary User"}</h4>
                    {liveProfile?.verification === "Verified" ? (
                      <ShieldCheck className="h-5 w-5 text-[#2d4de0]" />
                    ) : null}
                  </div>
                  <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">Notary</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Full Name</label>
                  <input type="text" value={form.name} readOnly={!isEditing} onChange={updateField("name")} className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-300 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Email</label>
                  <input type="email" value={form.email} readOnly={!isEditing} onChange={updateField("email")} className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-300 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Phone</label>
                  <input type="text" value={form.phone} readOnly={!isEditing} onChange={updateField("phone")} className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-300 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`} />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Coverage Areas</label>
                  <input type="text" value={form.coverageAreas} readOnly={!isEditing} onChange={updateField("coverageAreas")} placeholder="e.g. Manhattan, Brooklyn" className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 ${isEditing ? "border-zinc-300 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`} />
                </div>
              </div>

              <div className="rounded-[24px] border border-indigo-100 bg-white p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Business Address</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Address Line 1</label>
                    <input type="text" value={form.address.line1} readOnly={!isEditing} onChange={updateAddressField("line1")} className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-300 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Address Line 2</label>
                    <input type="text" value={form.address.line2} readOnly={!isEditing} onChange={updateAddressField("line2")} placeholder="Suite, Apt" className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 ${isEditing ? "border-zinc-300 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">City</label>
                    <input type="text" value={form.address.city} readOnly={!isEditing} onChange={updateAddressField("city")} className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-300 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">State</label>
                    {isEditing ? (
                      <select value={form.address.state} onChange={updateAddressField("state")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10">
                        <option value="">Select state</option>
                        {usStates.map((state) => <option key={state} value={state}>{state}</option>)}
                      </select>
                    ) : (
                      <input type="text" value={form.address.state} readOnly className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">ZIP Code</label>
                    <input type="text" value={form.address.zip} readOnly={!isEditing} onChange={updateAddressField("zip")} className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-300 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div className="overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-zinc-100 px-8 py-5 md:flex-row md:items-center md:justify-between">
            <h3 className="text-xl font-semibold text-zinc-900">Profile Information</h3>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      resetFormFromProfile();
                      setSubmitError("");
                      setSubmitSuccess("");
                      setIsEditing(false);
                    }}
                    disabled={saving}
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1a4fdb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    resetFormFromProfile();
                    setSubmitError("");
                    setSubmitSuccess("");
                    setIsEditing(true);
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-[#1a4fdb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8]"
                >
                  Edit Profile
                </button>
              )}
            </div>
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
                  disabled={uploading || !isEditing}
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
                  disabled={uploading || !isEditing}
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
                  readOnly={!isEditing}
                  onChange={updateField("name")}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-200 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={form.phone}
                  readOnly={!isEditing}
                  onChange={updateField("phone")}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-200 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Company Name
                </label>
                <input
                  type="text"
                  value={form.company}
                  readOnly={!isEditing}
                  onChange={updateField("company")}
                  className={`w-full rounded-xl border px-4 py-3 text-sm text-zinc-700 ${isEditing ? "border-zinc-200 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" : "border-zinc-200 bg-zinc-50"}`}
                />
              </div>
            </div>
          </div>
        </div>
        )
      ) : null}
    </SettingsShell>
  );
}

export function PortalProfileDetailsSettings({ role }) {
  const isNotary = role === "notary";
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
  const [notaryForm, setNotaryForm] = useState({
    profile: {
      name: "",
      email: "",
      phone: "",
      coverageAreas: "",
    },
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
    },
    commission: {
      number: "",
      state: "",
      expirationDate: "",
      travelRadius: "",
      eoCoverageAmount: "",
    },
    additional: {
      ronApproval: "pending",
      backgroundCheckDate: "",
      specialties: [],
      secondaryContactName: "",
      secondaryContactEmail: "",
      secondaryContactPhone: "",
    },
  });
  const {
    data: notaryData,
    setData: setNotaryData,
    loading: notaryLoading,
    error: notaryError,
  } = useNotaryProfileDetails(isNotary);

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

  useEffect(() => {
    if (!isNotary || !notaryData) return;

    setNotaryForm({
      profile: notaryData.details?.profile || {
        name: "",
        email: "",
        phone: "",
        coverageAreas: "",
      },
      address: notaryData.details?.address || {
        line1: "",
        line2: "",
        city: "",
        state: "",
        zip: "",
      },
      commission: notaryData.details?.commission || {
        number: "",
        state: "",
        expirationDate: "",
        travelRadius: "",
        eoCoverageAmount: "",
      },
      additional: {
        ronApproval: notaryData.details?.additional?.ronApproval || "pending",
        backgroundCheckDate: notaryData.details?.additional?.backgroundCheckDate || "",
        specialties: notaryData.details?.additional?.specialties || [],
        secondaryContactName:
          notaryData.details?.additional?.secondaryContactName || "",
        secondaryContactEmail:
          notaryData.details?.additional?.secondaryContactEmail || "",
        secondaryContactPhone:
          notaryData.details?.additional?.secondaryContactPhone || "",
      },
    });
  }, [isNotary, notaryData]);

  const refreshDetails = async () => {
    if (isNotary) {
      invalidatePortalCache("/site/notary/profile-details");
      invalidatePortalCache("/site/notary/overview");
      const payload = await requestPortalJson("/site/notary/profile-details");
      setNotaryData(payload);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("notarix:profile-updated"));
      }
      return payload;
    }

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

  const updateNotaryNestedField = (section, key) => (event) => {
    setNotaryForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: event.target.value,
      },
    }));
  };

  const toggleNotarySpecialty = (specialty) => {
    setNotaryForm((current) => {
      const specialties = current.additional.specialties.includes(specialty)
        ? current.additional.specialties.filter((item) => item !== specialty)
        : [...current.additional.specialties, specialty];

      return {
        ...current,
        additional: {
          ...current.additional,
          specialties,
        },
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await requestPortalJson(isNotary ? "/site/notary/profile-details" : "/site/client/profile-details", {
        method: "PATCH",
        body: JSON.stringify(isNotary ? notaryForm : form),
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
      await requestPortalJson(`/site/${isNotary ? "notary" : "client"}/profile-documents/${documentKey}`, {
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
  const currentProfile = isNotary ? notaryData?.profile || {} : profile;
  const currentChecks = isNotary
    ? notaryData?.verification || {
        profileChecks: [],
        documents: [],
        completedChecks: 0,
        totalChecks: 0,
        completionPercent: 0,
        documentUploadedCount: 0,
        status: "Pending",
      }
    : checks;
  const currentDocuments = isNotary ? notaryData?.verification?.documents || [] : documents;

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
      description={
        isNotary
          ? "Manage the live notary professional profile, credentials, and verification requirements."
          : "Track profile completeness, representatives, and the client documents your team wants monitored."
      }
      icon={UserRound}
    >
      {isNotary ? (
        notaryLoading ? <SettingsLoading /> : null
      ) : loading ? (
        <SettingsLoading />
      ) : null}
      {!isNotary && !loading && error ? <SettingsError message={error} /> : null}
      {isNotary && !notaryLoading && notaryError ? <SettingsError message={notaryError} /> : null}
      {!isNotary && !loading && !error ? (
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
      {isNotary && !notaryLoading && !notaryError ? (
        <div className="space-y-8">
          {submitError ? <SettingsError message={submitError} /> : null}
          {submitSuccess ? (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {submitSuccess}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-8 py-8">
              <h3 className="text-[20px] font-semibold text-zinc-900">Professional and Contact Details</h3>
            </div>
            <div className="grid gap-5 px-8 py-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Full Name</label>
                <input type="text" value={notaryForm.profile.name} onChange={updateNotaryNestedField("profile", "name")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Email</label>
                <input type="email" value={notaryForm.profile.email} onChange={updateNotaryNestedField("profile", "email")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Phone</label>
                <input type="text" value={notaryForm.profile.phone} onChange={updateNotaryNestedField("profile", "phone")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Coverage Areas</label>
                <input type="text" value={notaryForm.profile.coverageAreas} onChange={updateNotaryNestedField("profile", "coverageAreas")} placeholder="e.g. Manhattan, Brooklyn" className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
            </div>

            <div className="px-8 pb-8">
              <div className="rounded-[24px] border border-indigo-100 bg-white p-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">Business Address</p>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Address Line 1</label>
                    <input type="text" value={notaryForm.address.line1} onChange={updateNotaryNestedField("address", "line1")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Address Line 2</label>
                    <input type="text" value={notaryForm.address.line2} onChange={updateNotaryNestedField("address", "line2")} placeholder="Suite, Apt" className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">City</label>
                    <input type="text" value={notaryForm.address.city} onChange={updateNotaryNestedField("address", "city")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">State</label>
                    <select value={notaryForm.address.state} onChange={updateNotaryNestedField("address", "state")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10">
                      <option value="">Select state</option>
                      {usStates.map((state) => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">ZIP Code</label>
                    <input type="text" value={notaryForm.address.zip} onChange={updateNotaryNestedField("address", "zip")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-8 py-8">
              <h3 className="text-[20px] font-semibold text-zinc-900">Commission and Credentials</h3>
            </div>
            <div className="grid gap-5 px-8 py-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Commission Number</label>
                <input type="text" value={notaryForm.commission.number} onChange={updateNotaryNestedField("commission", "number")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Commission State</label>
                <select value={notaryForm.commission.state} onChange={updateNotaryNestedField("commission", "state")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10">
                  <option value="">Select state</option>
                  {usStates.map((state) => <option key={state} value={state}>{state}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Commission Expiration Date</label>
                <input type="date" value={notaryForm.commission.expirationDate} onChange={updateNotaryNestedField("commission", "expirationDate")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Travel Radius (Miles)</label>
                <input type="text" value={notaryForm.commission.travelRadius} onChange={updateNotaryNestedField("commission", "travelRadius")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">E&amp;O Coverage Amount ($)</label>
                <input type="text" value={notaryForm.commission.eoCoverageAmount} onChange={updateNotaryNestedField("commission", "eoCoverageAmount")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-indigo-100 bg-white shadow-sm">
            <div className="border-b border-zinc-100 px-8 py-8">
              <h3 className="text-[20px] font-semibold text-zinc-900">Additional Information</h3>
            </div>
            <div className="grid gap-5 px-8 py-8 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">RON Approval</label>
                <select value={notaryForm.additional.ronApproval} onChange={updateNotaryNestedField("additional", "ronApproval")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="not_requested">Not Requested</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Background Check Date</label>
                <input type="date" value={notaryForm.additional.backgroundCheckDate} onChange={updateNotaryNestedField("additional", "backgroundCheckDate")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Specialties</label>
                <div className="grid gap-3 md:grid-cols-4">
                  {notarySpecialtyOptions.map((specialty) => {
                    const active = notaryForm.additional.specialties.includes(specialty);
                    return (
                      <button
                        key={specialty}
                        type="button"
                        onClick={() => toggleNotarySpecialty(specialty)}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition ${
                          active
                            ? "border-[#2d4de0] bg-blue-50 text-[#1a4fdb]"
                            : "border-zinc-200 bg-white text-zinc-700"
                        }`}
                      >
                        <span className={`h-4 w-4 rounded border ${active ? "border-[#2d4de0] bg-[#2d4de0]" : "border-zinc-300"}`} />
                        {specialty}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Secondary Contact Name</label>
                <input type="text" value={notaryForm.additional.secondaryContactName} onChange={updateNotaryNestedField("additional", "secondaryContactName")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Secondary Contact Email</label>
                <input type="email" value={notaryForm.additional.secondaryContactEmail} onChange={updateNotaryNestedField("additional", "secondaryContactEmail")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Secondary Contact Phone</label>
                <input type="text" value={notaryForm.additional.secondaryContactPhone} onChange={updateNotaryNestedField("additional", "secondaryContactPhone")} className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10" />
              </div>
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
      ) : null}
    </SettingsShell>
  );
}

export function PortalSecuritySettings({ role }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSave = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    if (!form.currentPassword.trim()) {
      setSubmitError("Current password is required.");
      return;
    }

    if (form.newPassword.length < 8) {
      setSubmitError("New password must be at least 8 characters.");
      return;
    }

    if (role !== "notary" && form.newPassword !== form.confirmPassword) {
      setSubmitError("New password and confirm password must match.");
      return;
    }

    setSaving(true);

    try {
      await requestPortalJson("/site/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          current_password: form.currentPassword,
          new_password: form.newPassword,
        }),
      });
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSubmitSuccess("Password updated successfully.");
    } catch (saveError) {
      setSubmitError(saveError.message || "Unable to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsShell
      title="Security"
      description="Update your live portal password here. Two-factor authentication stays visible, but it is not enabled until backend support exists."
      icon={ShieldCheck}
    >
      <div className="overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-sm">
        <div className="border-b border-zinc-100 px-8 py-6">
          <h3 className="text-2xl font-bold text-zinc-900">Security &amp; Authentication</h3>
        </div>

        <div className="space-y-8 px-8 py-8">
          {submitError ? <SettingsError message={submitError} /> : null}
          {submitSuccess ? (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {submitSuccess}
            </div>
          ) : null}

          <div className={`grid gap-5 ${role === "notary" ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                Current Password
              </label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={updateField("currentPassword")}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                New Password
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={updateField("newPassword")}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
              />
            </div>
            {role !== "notary" ? (
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField("confirmPassword")}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                />
              </div>
            ) : null}
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

          <div className="border-t border-zinc-100 pt-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-xl font-bold text-zinc-900">
                  {role === "notary" ? "Two-Factor Authentication" : "Enable Two-Factor Authentication (2FA)"}
                </h4>
                <p className="mt-2 text-sm leading-7 text-zinc-500">
                  {role === "notary"
                    ? "Add an extra layer of security to your account."
                    : "Secure your account with an additional verification layer via SMS or authenticator app."}
                </p>
              </div>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="relative inline-flex h-9 w-16 cursor-not-allowed items-center rounded-full bg-zinc-200"
                title="2FA is not available yet"
              >
                <span className="absolute left-1 h-7 w-7 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="mt-4 rounded-[20px] border border-dashed border-zinc-200 bg-zinc-50/60 px-5 py-4 text-sm text-zinc-500">
              Two-factor authentication is not enabled yet for the {role} portal backend, so this control is shown as unavailable instead of pretending it works.
            </div>
          </div>

          {role === "notary" ? (
            <div className="rounded-[24px] border border-zinc-100 bg-white p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">Login Activity</p>
              <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#1a4fdb]">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-zinc-900">Current portal session</p>
                    <p className="mt-1 text-sm text-zinc-500">This device • Active now</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="text-sm font-bold text-[#1a4fdb] opacity-60"
                >
                  Log out device
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </SettingsShell>
  );
}

export function PortalNotificationsSettings({ role }) {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderUpdates: true,
    paymentAlerts: false,
    directMessages: true,
  });
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const payload = await requestPortalJson(
          `/site/${rolePath[role]}/notification-preferences`
        );
        if (!cancelled) {
          setPreferences(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Unable to load notification preferences.");
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

  const togglePreference = async (key) => {
    const nextPreferences = {
      ...preferences,
      [key]: !preferences[key],
    };

    setPreferences(nextPreferences);
    setSavingKey(key);
    setError("");
    setSuccess("");

    try {
      await requestPortalJson(`/site/${rolePath[role]}/notification-preferences`, {
        method: "PATCH",
        body: JSON.stringify(nextPreferences),
      });
      setSuccess("Notification preferences updated successfully.");
    } catch (saveError) {
      setPreferences(preferences);
      setError(saveError.message || "Unable to update notification preferences.");
    } finally {
      setSavingKey("");
    }
  };

  const rows = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive important account and platform updates by email.",
      icon: Mail,
    },
    {
      key: "orderUpdates",
      label: "Order Updates",
      description: "Stay informed when order statuses, scheduling, or document states change.",
      icon: ClipboardList,
    },
    {
      key: "paymentAlerts",
      label: "Payment Alerts",
      description: "Get notified when invoices, payouts, or settlement items change.",
      icon: Receipt,
    },
    {
      key: "directMessages",
      label: "Direct Messages",
      description: "Receive alerts for new conversations and replies.",
      icon: MessageSquare,
    },
  ];

  const notaryGroups = [
    {
      title: "Email Notifications",
      icon: Mail,
      rows: [
        {
          key: "emailNewOrderAssigned",
          label: "New Order Assigned",
          description: "Receive an email when a new notarization order is available.",
        },
        {
          key: "emailOrderStatusUpdates",
          label: "Order Status Updates",
          description: "Get notified when client signs or documents are updated.",
        },
        {
          key: "emailPaymentReceived",
          label: "Payment Received",
          description: "Instant email confirmation for every successful transaction.",
        },
      ],
    },
    {
      title: "In-App Notifications",
      icon: Bell,
      rows: [
        {
          key: "inAppNewMessages",
          label: "New Messages",
          description: "Real-time alerts for client messages in the secure portal.",
        },
        {
          key: "inAppDocumentUploadUpdates",
          label: "Document Upload Updates",
          description: "Badges on files when a user uploads supporting identification.",
        },
        {
          key: "inAppMeetingRequests",
          label: "Meeting Requests",
          description: "Pop-up notification for incoming video call invitations.",
        },
      ],
    },
  ];

  return (
    <SettingsShell
      title="Notifications"
      description="Manage the live notification preferences saved to your portal account."
      icon={Bell}
    >
      {loading ? <SettingsLoading /> : null}
      {!loading && error ? <SettingsError message={error} /> : null}
      {!loading ? (
        <div className="overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-sm">
          <div className="space-y-5 px-8 py-8">
            {success ? (
              <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            {role !== "notary"
              ? rows.map((row) => {
              const Icon = row.icon;
              const active = Boolean(preferences[row.key]);
              const saving = savingKey === row.key;

              return (
                <div
                  key={row.key}
                  className="flex flex-col gap-4 rounded-[22px] border border-zinc-100 bg-zinc-50/60 px-5 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#1a4fdb] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-zinc-900">{row.label}</h4>
                      <p className="mt-1 text-sm leading-7 text-zinc-500">{row.description}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => togglePreference(row.key)}
                    disabled={Boolean(savingKey)}
                    aria-pressed={active}
                    className={`relative inline-flex h-9 w-16 items-center rounded-full transition ${
                      active ? "bg-[#2d4de0]" : "bg-zinc-200"
                    } ${savingKey ? "cursor-not-allowed opacity-70" : ""}`}
                  >
                    <span
                      className={`absolute h-7 w-7 rounded-full bg-white shadow-sm transition ${
                        active ? "left-8" : "left-1"
                      }`}
                    />
                    {saving ? (
                      <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
                    ) : null}
                  </button>
                </div>
              );
            })
              : notaryGroups.map((group) => {
                  const GroupIcon = group.icon;
                  return (
                    <div key={group.title} className="overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-sm">
                      <div className="flex items-center gap-3 border-b border-zinc-100 px-8 py-6">
                        <GroupIcon className="h-5 w-5 text-[#1a4fdb]" />
                        <h3 className="text-2xl font-bold text-zinc-900">{group.title}</h3>
                      </div>
                      <div className="space-y-4 px-6 py-6">
                        {group.rows.map((row) => {
                          const active = Boolean(preferences[row.key]);
                          const saving = savingKey === row.key;

                          return (
                            <div
                              key={row.key}
                              className="flex flex-col gap-4 rounded-[22px] border border-zinc-100 bg-white px-5 py-5 md:flex-row md:items-center md:justify-between"
                            >
                              <div>
                                <h4 className="text-lg font-semibold text-zinc-900">{row.label}</h4>
                                <p className="mt-1 text-sm leading-7 text-zinc-500">{row.description}</p>
                              </div>

                              <button
                                type="button"
                                onClick={() => togglePreference(row.key)}
                                disabled={Boolean(savingKey)}
                                aria-pressed={active}
                                className={`relative inline-flex h-9 w-16 items-center rounded-full transition ${
                                  active ? "bg-[#2d4de0]" : "bg-zinc-200"
                                } ${savingKey ? "cursor-not-allowed opacity-70" : ""}`}
                              >
                                <span
                                  className={`absolute h-7 w-7 rounded-full bg-white shadow-sm transition ${
                                    active ? "left-8" : "left-1"
                                  }`}
                                />
                                {saving ? (
                                  <Loader2 className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin text-white" />
                                ) : null}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      ) : null}
    </SettingsShell>
  );
}

export function PortalPaymentsSettings({ role }) {
  const { data, loading, error } = usePortalBankInfo(role, true);
  const [form, setForm] = useState({
    bankName: "",
    accountHolderName: "",
    accountType: "checking",
    routingNumber: "",
    accountNumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [hasExistingRecord, setHasExistingRecord] = useState(false);

  useEffect(() => {
    if (!data) return;

    setForm({
      bankName: data.bankName || "",
      accountHolderName: data.accountHolderName || "",
      accountType: data.accountType || "checking",
      routingNumber: data.routingNumber || "",
      accountNumber: data.accountNumber || "",
    });
    setHasExistingRecord(true);
  }, [data]);

  useEffect(() => {
    if (!loading && error) {
      setHasExistingRecord(false);
    }
  }, [error, loading]);

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSave = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    if (!form.bankName.trim() || !form.accountHolderName.trim()) {
      setSubmitError("Bank name and account holder are required.");
      return;
    }

    if (!/^\d{9}$/.test(form.routingNumber.trim())) {
      setSubmitError("Routing number must be exactly 9 digits.");
      return;
    }

    if (!/^\d{6,17}$/.test(form.accountNumber.trim())) {
      setSubmitError("Account number must be between 6 and 17 digits.");
      return;
    }

    setSaving(true);

    try {
      await requestPortalJson(`/site/${rolePath[role]}/bank-info`, {
        method: hasExistingRecord ? "PATCH" : "POST",
        body: JSON.stringify({
          bankName: form.bankName.trim(),
          accountHolderName: form.accountHolderName.trim(),
          accountType: form.accountType,
          routingNumber: form.routingNumber.trim(),
          accountNumber: form.accountNumber.trim(),
        }),
      });

      setHasExistingRecord(true);
      setSubmitSuccess("Payment settings updated successfully.");
    } catch (saveError) {
      setSubmitError(saveError.message || "Unable to update payment settings.");
    } finally {
      setSaving(false);
    }
  };

  const maskedRouting = form.routingNumber
    ? `•••••${String(form.routingNumber).slice(-4)}`
    : "Not set";
  const maskedAccount = form.accountNumber
    ? `••••${String(form.accountNumber).slice(-4)}`
    : "Not set";

  return (
    <SettingsShell
      title="Payment Settings"
      description="Manage the live payout and settlement details stored on your portal account."
      icon={CreditCard}
    >
      {loading ? <SettingsLoading /> : null}
      {!loading ? (
        <div className="space-y-8">
          {submitError ? <SettingsError message={submitError} /> : null}
          {!submitError && error ? (
            <SettingsNotice
              title="Bank information not configured yet"
              description="No payment method is saved for this account yet. Add the payout details below to start using live payment settings."
            />
          ) : null}
          {submitSuccess ? (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {submitSuccess}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-zinc-100 px-8 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-zinc-900">Payment Method</h3>
                <p className="mt-2 text-sm leading-7 text-zinc-500">
                  This page saves real bank account details for {role === "client" ? "client settlements" : "notary payouts"}.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-5 py-4 text-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">Stored Summary</p>
                <p className="mt-2 font-semibold text-zinc-900">
                  {form.bankName || "No bank saved yet"}
                </p>
                <p className="mt-1 text-zinc-500">
                  {form.accountHolderName || "Account holder not set"}
                </p>
              </div>
            </div>

            <div className="grid gap-8 px-8 py-8 xl:grid-cols-[minmax(0,1.7fr)_320px]">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={form.bankName}
                    onChange={updateField("bankName")}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    value={form.accountHolderName}
                    onChange={updateField("accountHolderName")}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Account Type
                  </label>
                  <select
                    value={form.accountType}
                    onChange={updateField("accountType")}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="business_checking">Business Checking</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={form.routingNumber}
                    onChange={updateField("routingNumber")}
                    inputMode="numeric"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={form.accountNumber}
                    onChange={updateField("accountNumber")}
                    inputMode="numeric"
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700 focus:border-[#1a4fdb] focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[24px] border border-zinc-100 bg-zinc-50/70 p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Stored Preview
                  </p>
                  <div className="mt-4 space-y-4">
                    {[
                      ["Bank Name", form.bankName || "Not set"],
                      ["Account Holder", form.accountHolderName || "Not set"],
                      ["Account Type", form.accountType.replace(/_/g, " ")],
                      ["Routing Number", maskedRouting],
                      ["Account Number", maskedAccount],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">{label}</p>
                        <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-dashed border-zinc-200 bg-zinc-50/60 px-5 py-4 text-sm leading-7 text-zinc-500">
                  These payment settings are stored through the live backend bank-info endpoints. This page avoids fake saved cards and only shows the real account record for the current portal user.
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-100 px-8 py-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1a4fdb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Payment Method
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SettingsShell>
  );
}

export function PortalVerificationSettings() {
  const { data, setData, loading, error } = useNotaryProfileDetails(true);
  const verification = data?.verification || {};
  const profileChecks = verification.profileChecks || [];
  const documents = verification.documents || [];
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [uploadingKey, setUploadingKey] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    invalidatePortalCache("/site/notary/profile-details");
    invalidatePortalCache("/site/notary/overview");
    const payload = await requestPortalJson("/site/notary/profile-details");
    setData(payload);
    return payload;
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
      await requestPortalJson(`/site/notary/profile-documents/${documentKey}`, {
        method: "POST",
        body: formData,
      });
      await refresh();
      setSubmitSuccess("Document uploaded successfully.");
    } catch (uploadError) {
      setSubmitError(uploadError.message || "Unable to upload document.");
    } finally {
      setUploadingKey("");
      event.target.value = "";
    }
  };

  const handleSubmitForReview = async () => {
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await requestPortalJson("/site/notary/verification/submit", {
        method: "POST",
        body: JSON.stringify({}),
      });
      await refresh();
      setSubmitSuccess("Verification submitted for review.");
    } catch (submitReviewError) {
      setSubmitError(submitReviewError.message || "Unable to submit verification.");
    } finally {
      setSubmitting(false);
    }
  };

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
          {submitError ? <SettingsError message={submitError} /> : null}
          {submitSuccess ? (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              {submitSuccess}
            </div>
          ) : null}

          <div className="overflow-hidden rounded-[28px] border border-zinc-100 bg-white shadow-sm">
            <div className="grid xl:grid-cols-[minmax(0,1fr)_420px]">
              <div className="border-b border-zinc-100 p-6 xl:border-b-0 xl:border-r">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-zinc-900">Profile fields</h3>
                  <span className="text-sm text-zinc-500">
                    {profileChecks.filter((item) => item.complete).length}/{profileChecks.length} Completed
                  </span>
                </div>
                <div className="space-y-4">
                  {profileChecks.map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-[20px] border border-zinc-100 bg-white px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-full ${item.complete ? "bg-emerald-100" : "bg-zinc-100"}`} />
                        <span className="text-lg text-zinc-700">{item.label}</span>
                      </div>
                      {item.complete ? (
                        <span className="text-sm font-semibold text-emerald-600">Completed</span>
                      ) : item.actionLabel ? (
                        <span className="text-sm font-semibold text-[#2d4de0]">{item.actionLabel}</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-zinc-900">Required documents</h3>
                  <span className="text-sm text-zinc-500">
                    {verification.documentUploadedCount || 0}/{documents.length} Uploaded
                  </span>
                </div>
                <div className="space-y-4">
                  {documents.map((document) => (
                    <div key={document.key} className="flex items-center justify-between rounded-[20px] border border-zinc-100 bg-white px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`h-6 w-6 rounded-full ${document.status !== "Missing" ? "bg-emerald-100" : "bg-zinc-100"}`} />
                        <span className="text-lg text-zinc-700">{document.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        {document.viewUrl ? (
                          <a href={document.viewUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-zinc-500 hover:text-[#2d4de0]">
                            View
                          </a>
                        ) : null}
                        {document.status === "Missing" ? (
                          <label className="cursor-pointer text-sm font-semibold text-[#2d4de0]">
                            {uploadingKey === document.key ? "Uploading..." : "Upload"}
                            <input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" className="hidden" onChange={handleDocumentUpload(document.key)} />
                          </label>
                        ) : (
                          <span className="text-sm font-semibold text-emerald-600">{document.displayStatus}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[24px] border border-blue-100 bg-blue-50/70 p-5 text-sm leading-7 text-zinc-600">
                  <p className="font-semibold text-[#2d4de0]">Processing Time</p>
                  Required documents are typically reviewed within 24 business hours. You will receive a notification once your verification level is upgraded.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="h-2 w-full max-w-[128px] overflow-hidden rounded-full bg-zinc-200">
                <div className="h-full rounded-full bg-[#2d4de0]" style={{ width: `${verification.completionPercent || 0}%` }} />
              </div>
              <span className="text-sm text-zinc-500">Overall Progress: {verification.completionPercent || 0}%</span>
            </div>
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a4fdb] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-[#1541b8] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Submit for Review
            </button>
          </div>
        </div>
      ) : null}
    </SettingsShell>
  );
}
