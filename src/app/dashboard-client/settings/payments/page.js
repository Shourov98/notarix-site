"use client";

import { useEffect, useState } from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchClientBankInfo,
  saveClientBankInfo,
  selectSitePortal,
} from "@/store/sitePortalSlice";

const defaultForm = {
  bankName: "",
  accountHolderName: "",
  accountType: "checking",
  routingNumber: "",
  accountNumber: "",
};

export default function PaymentsSettingsPage() {
  const dispatch = useAppDispatch();
  const { clientBankInfo, clientBankInfoStatus } = useAppSelector(selectSitePortal);
  const [formState, setFormState] = useState(defaultForm);

  useEffect(() => {
    dispatch(fetchClientBankInfo());
  }, [dispatch]);

  useEffect(() => {
    if (clientBankInfo) {
      setFormState({
        bankName: clientBankInfo.bankName || "",
        accountHolderName: clientBankInfo.accountHolderName || "",
        accountType: clientBankInfo.accountType || "checking",
        routingNumber: clientBankInfo.routingNumber || "",
        accountNumber: clientBankInfo.accountNumber || "",
      });
    }
  }, [clientBankInfo]);

  const updateField = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await dispatch(
        saveClientBankInfo({
          values: formState,
          method: clientBankInfo ? "PATCH" : "POST",
        })
      ).unwrap();
      toast.success("Bank info saved successfully.");
    } catch (error) {
      toast.error(error || "Unable to save bank info.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Payment Methods</h2>
          <p className="text-gray-700 font-medium text-xs mt-1">Manage your saved bank details and billing information.</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-[#1a4fdb] hover:underline">
          Bank Account Active
        </button>
      </div>

      <div className="p-8 space-y-12">
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Banking Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            <div className="p-6 border border-zinc-100 rounded-[24px] bg-white shadow-sm">
              <p className="text-sm font-bold text-zinc-900">{formState.bankName || "Bank Name"}</p>
              <p className="text-xs font-medium text-gray-700 mt-1">
                {formState.accountType.replaceAll("_", " ") || "checking"}
              </p>
            </div>
            <div className="p-6 border border-zinc-100 rounded-[24px] bg-white shadow-sm">
              <p className="text-sm font-bold text-zinc-900">{formState.accountHolderName || "Account Holder"}</p>
              <p className="text-xs font-medium text-gray-700 mt-1">
                {clientBankInfoStatus === "loading" ? "Loading saved details..." : "Stored securely"}
              </p>
            </div>
          </div>
        </section>

        <hr className="border-zinc-50" />

        <section className="space-y-6 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Bank Details</h3>
              <p className="text-xs font-medium text-gray-700">Manage the account used for payouts and refunds.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Bank Name</label>
              <input
                type="text"
                value={formState.bankName}
                onChange={(event) => updateField("bankName", event.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Account Holder</label>
              <input
                type="text"
                value={formState.accountHolderName}
                onChange={(event) => updateField("accountHolderName", event.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Account Type</label>
              <select
                value={formState.accountType}
                onChange={(event) => updateField("accountType", event.target.value)}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="business_checking">Business Checking</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Routing Number</label>
              <input
                type="text"
                value={formState.routingNumber}
                onChange={(event) => updateField("routingNumber", event.target.value.replace(/\D/g, "").slice(0, 9))}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Account Number</label>
              <input
                type="text"
                value={formState.accountNumber}
                onChange={(event) => updateField("accountNumber", event.target.value.replace(/\D/g, "").slice(0, 17))}
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end max-w-4xl pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Save Bank Info
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
