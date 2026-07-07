"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotaryProfileDetails,
  updateNotaryProfileDetails,
  selectSitePortal,
} from "@/store/sitePortalSlice";

const availableSpecialties = ["RON", "HELOC", "Purchase", "Seller Pkg", "Refinance", "Loan Mod"];

const initialForm = {
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
};

export default function ProfileDetailsPage() {
  const dispatch = useAppDispatch();
  const { notaryProfileDetails, notaryProfileDetailsStatus, notaryProfileSaveStatus } =
    useAppSelector(selectSitePortal);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    dispatch(fetchNotaryProfileDetails());
  }, [dispatch]);

  useEffect(() => {
    const details = notaryProfileDetails?.details;
    if (!details) return;
    setForm({
      profile: {
        name: details.profile?.name || "",
        email: details.profile?.email || "",
        phone: details.profile?.phone || "",
        coverageAreas: details.profile?.coverageAreas || "",
      },
      address: {
        line1: details.address?.line1 || "",
        line2: details.address?.line2 || "",
        city: details.address?.city || "",
        state: details.address?.state || "",
        zip: details.address?.zip || "",
      },
      commission: {
        number: details.commission?.number || "",
        state: details.commission?.state || "",
        expirationDate: details.commission?.expirationDate || "",
        travelRadius: details.commission?.travelRadius || "",
        eoCoverageAmount: details.commission?.eoCoverageAmount || "",
      },
      additional: {
        ronApproval: details.additional?.ronApproval || "pending",
        backgroundCheckDate: details.additional?.backgroundCheckDate || "",
        specialties: Array.isArray(details.additional?.specialties)
          ? details.additional.specialties
          : [],
        secondaryContactName: details.additional?.secondaryContactName || "",
        secondaryContactEmail: details.additional?.secondaryContactEmail || "",
        secondaryContactPhone: details.additional?.secondaryContactPhone || "",
      },
    });
  }, [notaryProfileDetails]);

  const updateSection = (section, field, value) => {
    setForm((current) => ({
      ...current,
      [section]: { ...current[section], [field]: value },
    }));
  };

  const toggleSpecialty = (specialty) => {
    setForm((current) => {
      const list = current.additional.specialties || [];
      const next = list.includes(specialty)
        ? list.filter((item) => item !== specialty)
        : [...list, specialty];
      return {
        ...current,
        additional: { ...current.additional, specialties: next },
      };
    });
  };

  const handleSave = async () => {
    try {
      await dispatch(updateNotaryProfileDetails(form)).unwrap();
      toast.success("Profile details saved.");
    } catch (error) {
      toast.error(error?.message || "Unable to save profile details.");
    }
  };

  const loading = notaryProfileDetailsStatus === "loading";
  const saving = notaryProfileSaveStatus === "loading";

  const mergedSpecialties = useMemo(() => {
    const selected = new Set(form.additional.specialties || []);
    availableSpecialties.forEach((specialty) => selected.add(specialty));
    return Array.from(selected);
  }, [form.additional.specialties]);

  if (loading && !notaryProfileDetails) {
    return (
      <div className="p-8 flex items-center gap-3 text-gray-700">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Professional and Contact Details</h2>
          <p className="mt-1 text-sm text-gray-700">
            Keep your commission and contact information up to date so the admin team can verify your account quickly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100 disabled:opacity-60"
        >
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </span>
          ) : (
            "Save Details"
          )}
        </button>
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[
            ["Full Name", "profile", "name", "text"],
            ["Email", "profile", "email", "email"],
            ["Phone", "profile", "phone", "tel"],
            ["Coverage Areas", "profile", "coverageAreas", "text"],
          ].map(([label, section, field, type]) => (
            <div key={`${section}-${field}`} className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
              <input
                type={type}
                value={form[section][field]}
                onChange={(event) => updateSection(section, field, event.target.value)}
                className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
              />
            </div>
          ))}
        </div>

        <div className="border border-zinc-200 rounded-[24px] p-6 space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-700">Business Address</p>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Address Line 1</label>
            <input
              value={form.address.line1}
              onChange={(event) => updateSection("address", "line1", event.target.value)}
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
                  onChange={(event) => updateSection("address", field, event.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <h2 className="text-xl font-bold text-zinc-900">Commission and Credentials</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {[
            ["Commission Number", "commission", "number"],
            ["Commission State", "commission", "state"],
            ["Commission Expiration Date", "commission", "expirationDate"],
            ["Travel Radius (Miles)", "commission", "travelRadius"],
          ].map(([label, section, field]) => (
            <div key={`${section}-${field}`} className="space-y-2">
              <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">{label}</label>
              <input
                value={form[section][field]}
                onChange={(event) => updateSection(section, field, event.target.value)}
                className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
              />
            </div>
          ))}
          <div className="space-y-2 xl:col-span-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">E&amp;O Coverage Amount ($)</label>
            <input
              value={form.commission.eoCoverageAmount}
              onChange={(event) => updateSection("commission", "eoCoverageAmount", event.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
            />
          </div>
        </div>
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <h2 className="text-xl font-bold text-zinc-900">Additional Information</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">RON Approval</label>
            <select
              value={form.additional.ronApproval}
              onChange={(event) => updateSection("additional", "ronApproval", event.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 bg-white focus:outline-none focus:border-[#2c49df]"
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="not_requested">Not requested</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Background Check Date</label>
            <input
              type="date"
              value={form.additional.backgroundCheckDate}
              onChange={(event) => updateSection("additional", "backgroundCheckDate", event.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Secondary Contact Name</label>
            <input
              value={form.additional.secondaryContactName}
              onChange={(event) => updateSection("additional", "secondaryContactName", event.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Secondary Contact Email</label>
            <input
              type="email"
              value={form.additional.secondaryContactEmail}
              onChange={(event) => updateSection("additional", "secondaryContactEmail", event.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
            />
          </div>
          <div className="space-y-2 xl:col-span-2">
            <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Secondary Contact Phone</label>
            <input
              type="tel"
              value={form.additional.secondaryContactPhone}
              onChange={(event) => updateSection("additional", "secondaryContactPhone", event.target.value)}
              className="w-full px-4 py-4 rounded-2xl border border-zinc-300 text-gray-700 placeholder:text-gray-700 focus:outline-none focus:border-[#2c49df]"
            />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.18em] font-bold text-gray-700">Specialties</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
            {mergedSpecialties.map((specialty) => (
              <label key={specialty} className="flex items-center gap-3 px-4 py-4 rounded-2xl border border-zinc-200">
                <input
                  type="checkbox"
                  checked={form.additional.specialties.includes(specialty)}
                  onChange={() => toggleSpecialty(specialty)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-zinc-800">{specialty}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}