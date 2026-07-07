"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotaryProfileDetails,
  selectSitePortal,
  updateNotaryProfile,
  uploadNotaryAvatar,
} from "@/store/sitePortalSlice";
import { buildAssetUrl } from "@/lib/siteApi";

const initialForm = {
  name: "",
  email: "",
  phone: "",
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
  const { notaryProfileDetails } = useAppSelector(selectSitePortal);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    dispatch(fetchNotaryProfileDetails());
  }, [dispatch]);

  useEffect(() => {
    const details = notaryProfileDetails?.details;
    const profile = notaryProfileDetails?.profile || {};
    if (!details && !profile?.id) return;
    setForm({
      name: profile?.name || details?.profile?.name || "",
      email: profile?.email || details?.profile?.email || "",
      phone: profile?.phone || details?.profile?.phone || "",
      coverageAreas: profile?.coverageAreas || details?.profile?.coverageAreas || "",
      address: {
        line1: profile?.address?.line1 || details?.address?.line1 || "",
        line2: profile?.address?.line2 || details?.address?.line2 || "",
        city: profile?.address?.city || details?.address?.city || "",
        state: profile?.address?.state || details?.address?.state || "",
        zip: profile?.address?.zip || details?.address?.zip || "",
      },
    });
  }, [notaryProfileDetails, dispatch]);

  const handleFieldChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setForm((current) => ({
      ...current,
      address: { ...current.address, [field]: value },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    setSaving(true);
    try {
      await dispatch(updateNotaryProfile(form)).unwrap();
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(error?.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      event.target.value = "";
      return;
    }
    setUploadingPhoto(true);
    try {
      await dispatch(uploadNotaryAvatar(file)).unwrap();
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(error?.message || "Unable to upload photo.");
    } finally {
      setUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const avatarUrl = buildAssetUrl(notaryProfileDetails?.profile?.avatar);
  const initials = (form.name || "Notary")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "N";

  return (
    <form className="p-8 space-y-8" onSubmit={handleSubmit}>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-xl font-bold text-zinc-900">Profile Settings</h2>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100 disabled:opacity-60"
        >
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 bg-blue-50 flex items-center justify-center text-2xl font-bold text-[#2c49df]">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt={form.name || "Notary"} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handlePhotoClick}
            disabled={uploadingPhoto}
            className="absolute -right-1 bottom-1 w-9 h-9 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-[#2c49df] disabled:opacity-60"
            aria-label="Upload profile photo"
          >
            {uploadingPhoto ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelected}
            className="hidden"
          />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold text-zinc-900">{form.name || "Notary"}</p>
            <BadgeCheck className="w-6 h-6 text-[#2c49df]" />
          </div>
          <p className="text-gray-700 font-semibold uppercase tracking-[0.2em] mt-2">Notary</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {[
          ["Full Name", "name", "text"],
          ["Email", "email", "email"],
          ["Phone", "phone", "tel"],
          ["Coverage Areas", "coverageAreas", "text"],
        ].map(([label, field, type]) => (
          <div key={field} className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
            <input
              type={type}
              value={form[field]}
              onChange={(event) => handleFieldChange(field, event.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
            />
          </div>
        ))}
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700">Business Address</p>
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Address Line 1</label>
          <input
            value={form.address.line1}
            onChange={(event) => handleAddressChange("line1", event.target.value)}
            className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[
            ["Address Line 2", "line2"],
            ["City", "city"],
            ["State", "state"],
            ["Zip Code", "zip"],
          ].map(([label, field]) => (
            <div key={field} className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
              <input
                value={form.address[field]}
                onChange={(event) => handleAddressChange(field, event.target.value)}
                className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
              />
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}