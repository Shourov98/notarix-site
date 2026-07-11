"use client";

import { useEffect, useState } from "react";
import { Camera, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchClientOverview,
  saveClientProfileThunk,
  selectSitePortal,
  uploadClientProfilePhotoThunk,
} from "@/store/sitePortalSlice";
import { buildAssetUrl } from "@/lib/siteApi";

const defaultForm = {
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
};

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const {
    clientOverview,
    clientProfilePhotoUploadStatus,
    clientProfileSaveStatus,
  } = useAppSelector(selectSitePortal);
  const [formState, setFormState] = useState(defaultForm);

  useEffect(() => {
    dispatch(fetchClientOverview());
  }, [dispatch]);

  useEffect(() => {
    const profile = clientOverview?.profile;
    if (profile) {
      setFormState({
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
    }
  }, [clientOverview]);

  const updateField = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const updateAddress = (field, value) => {
    setFormState((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(uploadClientProfilePhotoThunk(file)).unwrap();
      toast.success("Profile photo updated.");
      dispatch(fetchClientOverview());
    } catch (error) {
      toast.error(error || "Unable to upload photo.");
    } finally {
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(saveClientProfileThunk({
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        company: formState.company,
        coverageAreas: formState.coverageAreas,
        address: formState.address,
      })).unwrap();
      toast.success("Profile saved.");
      dispatch(fetchClientOverview());
    } catch (error) {
      toast.error(error || "Unable to save profile.");
    }
  };

  const profile = clientOverview?.profile;
  const avatarUrl = profile?.avatar ? buildAssetUrl(profile.avatar) : null;
  const saving = clientProfileSaveStatus === "loading";

  return (
    <div className="flex flex-col h-full">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Profile Information</h2>
      </div>

      <div className="p-8 space-y-12">
        {/* Profile Header */}
        <div className="flex items-center gap-8">
          <label className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-zinc-50 shadow-md bg-zinc-100">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={formState.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-zinc-500 text-sm font-bold">
                  {(formState.name || "?").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              disabled={clientProfilePhotoUploadStatus === "loading"}
            />
          </label>
          <div>
            <h3 className="text-xl font-bold text-zinc-900 mb-1">
              {formState.name || "Your name"}
            </h3>
            <p className="text-xs font-medium text-gray-700 mb-2">
              {profile?.status === "Active" ? (
                <>Verified Professional</>
              ) : (
                <>Account status: {profile?.status || "Unknown"}</>
              )}
            </p>
            <span className="text-sm font-bold text-[#1a4fdb]">
              {clientProfilePhotoUploadStatus === "loading" ? "Uploading photo…" : "Click photo to change"}
            </span>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Full Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              value={formState.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Phone Number</label>
            <input
              type="text"
              value={formState.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Company Name</label>
            <input
              type="text"
              value={formState.company}
              onChange={(event) => updateField("company", event.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Coverage Areas</label>
            <input
              type="text"
              value={formState.coverageAreas}
              onChange={(event) => updateField("coverageAreas", event.target.value)}
              placeholder="e.g. Texas, Oklahoma, New Mexico"
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-4 border-t border-zinc-50">
          <div className="md:col-span-2">
            <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Address</h3>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Street Address</label>
            <input
              type="text"
              value={formState.address.line1}
              onChange={(event) => updateAddress("line1", event.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">City</label>
            <input
              type="text"
              value={formState.address.city}
              onChange={(event) => updateAddress("city", event.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">State</label>
            <input
              type="text"
              value={formState.address.state}
              onChange={(event) => updateAddress("state", event.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">ZIP</label>
            <input
              type="text"
              value={formState.address.zip}
              onChange={(event) => updateAddress("zip", event.target.value)}
              className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm font-medium text-gray-700 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="pt-8 border-t border-zinc-50 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}