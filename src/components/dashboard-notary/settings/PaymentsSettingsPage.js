"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotaryBankInfo,
  saveNotaryBankInfo,
  selectSitePortal,
} from "@/store/sitePortalSlice";
import { toast } from "sonner";

const defaultForm = {
  bankName: "",
  accountHolderName: "",
  accountType: "checking",
  routingNumber: "",
  accountNumber: "",
};

export default function PaymentsSettingsPage() {
  const dispatch = useAppDispatch();
  const { notaryBankInfo, notaryBankInfoStatus } = useAppSelector(selectSitePortal);
  const [formState, setFormState] = useState(defaultForm);

  useEffect(() => {
    dispatch(fetchNotaryBankInfo());
  }, [dispatch]);

  useEffect(() => {
    if (notaryBankInfo) {
      setFormState({
        bankName: notaryBankInfo.bankName || "",
        accountHolderName: notaryBankInfo.accountHolderName || "",
        accountType: notaryBankInfo.accountType || "checking",
        routingNumber: notaryBankInfo.routingNumber || "",
        accountNumber: notaryBankInfo.accountNumber || "",
      });
    }
  }, [notaryBankInfo]);

  const updateField = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(
        saveNotaryBankInfo({
          values: formState,
          method: notaryBankInfo ? "PATCH" : "POST",
        })
      ).unwrap();
      toast.success("Bank info saved successfully.");
    } catch (error) {
      toast.error(error || "Unable to save bank info.");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Payment Settings</h2>
          <p className="text-gray-700 font-medium text-sm mt-1">Manage your billing accounts, payout preferences, and financial security.</p>
        </div>
        <button className="px-6 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100">
          Bank Account on File
        </button>
      </div>

      <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
        <h3 className="text-xl font-bold text-zinc-900">Default Payout Method</h3>
        <div className="border border-zinc-200 rounded-[24px] px-5 py-5 flex items-center gap-4">
          <div className="w-6 h-6 rounded-full border border-zinc-400"></div>
          <div>
            <p className="text-lg font-bold text-zinc-900">{formState.bankName || "Bank account"}</p>
            <p className="text-sm font-medium text-gray-700 mt-1">
              {formState.accountType.replaceAll("_", " ") || "Checking"} account
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
          <h3 className="text-xl font-bold text-zinc-900">Bank Account Details</h3>
          <div className="space-y-4">
            <input
              value={formState.bankName}
              onChange={(event) => updateField("bankName", event.target.value)}
              placeholder="Bank Name"
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
            />
            <input
              value={formState.accountHolderName}
              onChange={(event) => updateField("accountHolderName", event.target.value)}
              placeholder="Account Holder Name"
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
            />
            <select
              value={formState.accountType}
              onChange={(event) => updateField("accountType", event.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="business_checking">Business Checking</option>
            </select>
          </div>
        </div>

        <div className="border border-indigo-100 rounded-[24px] p-6 space-y-6">
          <h3 className="text-xl font-bold text-zinc-900">Routing & Account Numbers</h3>
          <div className="space-y-4">
            <input
              value={formState.routingNumber}
              onChange={(event) => updateField("routingNumber", event.target.value.replace(/\D/g, "").slice(0, 9))}
              placeholder="Routing Number"
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
            />
            <input
              value={formState.accountNumber}
              onChange={(event) => updateField("accountNumber", event.target.value.replace(/\D/g, "").slice(0, 17))}
              placeholder="Account Number"
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3"
            />
            <p className="italic text-sm font-medium text-gray-700">
              {notaryBankInfoStatus === "loading"
                ? "Loading saved bank info..."
                : "Your payout details are stored securely and only visible to Super Admin."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#eef4ff] rounded-[24px] p-6 flex items-center gap-5">
        <div className="w-10 h-10 rounded-full bg-[#2c49df]"></div>
        <div>
          <p className="text-[#2c49df] font-bold text-lg">Security Note</p>
          <p className="text-sm font-medium text-zinc-600 mt-2">
            Payment details are securely stored and only visible to Super Admin.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => setFormState(defaultForm)}
          className="px-10 py-4 rounded-2xl border border-zinc-200 text-zinc-600 font-bold"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-10 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100"
        >
          Save Payment Settings
        </button>
      </div>
    </div>
  );
}
