"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  User,
  MapPin,
  CreditCard,
  Settings2,
  MessageSquare,
  Upload,
  Trash2,
  FileText,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createClientOrder,
  fetchClientOrders,
  selectSitePortal,
} from "@/store/sitePortalSlice";
import { uploadClientOrderDocuments } from "@/lib/siteApi";

const sectionCard =
  "bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6";
const inputClass =
  "w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-900 placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all";
const labelClass =
  "text-[10px] font-bold text-gray-700 uppercase tracking-widest";

const initialState = {
  vendorCode: "26NC4999",
  serviceType: "Loan Signing",
  signerFirstName: "",
  signerLastName: "",
  signerPhone: "",
  signerEmail: "",
  hasSecondarySigner: false,
  propertyAddress: {
    line1: "",
    city: "",
    state: "Texas",
    zip: "",
    timeZone: "CST",
  },
  signingDate: "",
  signingTime: "",
  feeAmount: "",
  paymentStatus: "Pending",
  paymentMethod: "Card",
  dueDate: "",
  paidDate: "",
  paymentNotes: "",
  paperSize: "Letter",
  preferredInk: "Black",
  estimatedPages: "",
  isRon: false,
  specialInstructions: "",
};

export default function NewOrderPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { createOrderStatus } = useAppSelector(selectSitePortal);
  const [formState, setFormState] = useState(initialState);
  const [documents, setDocuments] = useState([]);

  const updateField = (field, value) =>
    setFormState((current) => ({ ...current, [field]: value }));

  const updateAddressField = (field, value) =>
    setFormState((current) => ({
      ...current,
      propertyAddress: {
        ...current.propertyAddress,
        [field]: value,
      },
    }));

  const handleFiles = (files) => {
    const nextFiles = Array.from(files || []);
    setDocuments((current) => [...current, ...nextFiles]);
  };

  const removeFile = (indexToRemove) =>
    setDocuments((current) => current.filter((_, index) => index !== indexToRemove));

  const handleSubmit = async () => {
    if (
      !formState.vendorCode ||
      !formState.serviceType ||
      !formState.signerFirstName ||
      !formState.signerLastName ||
      !formState.signerPhone ||
      !formState.signerEmail ||
      !formState.propertyAddress.line1 ||
      !formState.propertyAddress.city ||
      !formState.propertyAddress.state ||
      !formState.propertyAddress.zip ||
      !formState.signingDate ||
      !formState.signingTime ||
      !formState.feeAmount
    ) {
      toast.error("Please complete all required order fields.");
      return;
    }

    try {
      const result = await dispatch(
        createClientOrder({
          ...formState,
          feeAmount: Number(formState.feeAmount),
        })
      ).unwrap();

      if (documents.length > 0) {
        await uploadClientOrderDocuments(result.orderId, documents);
      }

      await dispatch(fetchClientOrders());
      toast.success("Order created successfully.");
      router.push("/dashboard-client/orders");
    } catch (error) {
      toast.error(error || "Unable to create order.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-zinc-900">Create New Order</h1>

      <div className={sectionCard}>
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Client Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>Vendor Code *</label>
            <input
              type="text"
              value={formState.vendorCode}
              onChange={(event) => updateField("vendorCode", event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Service Type *</label>
            <div className="relative">
              <select
                value={formState.serviceType}
                onChange={(event) => updateField("serviceType", event.target.value)}
                className={`${inputClass} appearance-none`}
              >
                <option>Loan Signing</option>
                <option>Remote Notarization</option>
                <option>Power of Attorney</option>
                <option>Real Estate Closing</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionCard}>
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <User className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Borrower Information</h2>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>First Name *</label>
              <input className={inputClass} value={formState.signerFirstName} onChange={(event) => updateField("signerFirstName", event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Last Name *</label>
              <input className={inputClass} value={formState.signerLastName} onChange={(event) => updateField("signerLastName", event.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Phone *</label>
              <input className={inputClass} placeholder="+1 (555) 000-0000" value={formState.signerPhone} onChange={(event) => updateField("signerPhone", event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Email *</label>
              <input className={inputClass} type="email" placeholder="borrower@example.com" value={formState.signerEmail} onChange={(event) => updateField("signerEmail", event.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={formState.hasSecondarySigner} onChange={(event) => updateField("hasSecondarySigner", event.target.checked)} className="w-4 h-4 rounded border-zinc-300 text-[#1a4fdb]" />
            <span className="text-sm font-medium text-zinc-600">Add Secondary Signer</span>
          </label>
        </div>
      </div>

      <div className={sectionCard}>
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Property & Signing Details</h2>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className={labelClass}>Street Address *</label>
            <input className={inputClass} value={formState.propertyAddress.line1} onChange={(event) => updateAddressField("line1", event.target.value)} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>City *</label>
              <input className={inputClass} value={formState.propertyAddress.city} onChange={(event) => updateAddressField("city", event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>State *</label>
              <div className="relative">
                <select className={`${inputClass} appearance-none`} value={formState.propertyAddress.state} onChange={(event) => updateAddressField("state", event.target.value)}>
                  <option>Texas</option>
                  <option>New York</option>
                  <option>California</option>
                  <option>Florida</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Zip *</label>
              <input className={inputClass} value={formState.propertyAddress.zip} onChange={(event) => updateAddressField("zip", event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Time Zone</label>
              <div className="relative">
                <select className={`${inputClass} appearance-none`} value={formState.propertyAddress.timeZone} onChange={(event) => updateAddressField("timeZone", event.target.value)}>
                  <option>EST</option>
                  <option>CST</option>
                  <option>MST</option>
                  <option>PST</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Signing Date *</label>
              <input type="date" className={inputClass} value={formState.signingDate} onChange={(event) => updateField("signingDate", event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Signing Time *</label>
              <input type="time" className={inputClass} value={formState.signingTime} onChange={(event) => updateField("signingTime", event.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className={sectionCard}>
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Payment / Fee Details</h2>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Fee Amount ($) *</label>
              <input className={inputClass} placeholder="150" value={formState.feeAmount} onChange={(event) => updateField("feeAmount", event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Payment Status</label>
              <select className={inputClass} value={formState.paymentStatus} onChange={(event) => updateField("paymentStatus", event.target.value)}>
                <option>Pending</option>
                <option>Paid</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Payment Method</label>
              <select className={inputClass} value={formState.paymentMethod} onChange={(event) => updateField("paymentMethod", event.target.value)}>
                <option>Card</option>
                <option>Transfer</option>
                <option>Wire</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className={labelClass}>Due Date</label>
              <input type="date" className={inputClass} value={formState.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Paid Date</label>
              <input type="date" className={inputClass} value={formState.paidDate} onChange={(event) => updateField("paidDate", event.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Payment Notes</label>
            <textarea rows={3} className={`${inputClass} resize-none`} value={formState.paymentNotes} onChange={(event) => updateField("paymentNotes", event.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={sectionCard}>
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">Service Details</h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelClass}>Paper Size</label>
                <select className={inputClass} value={formState.paperSize} onChange={(event) => updateField("paperSize", event.target.value)}>
                  <option>Letter</option>
                  <option>Legal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Preferred Ink</label>
                <select className={inputClass} value={formState.preferredInk} onChange={(event) => updateField("preferredInk", event.target.value)}>
                  <option>Black</option>
                  <option>Blue</option>
                </select>
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className={labelClass}>Est. Pages</label>
                <input className={inputClass} value={formState.estimatedPages} onChange={(event) => updateField("estimatedPages", event.target.value)} />
              </div>
              <label className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-zinc-700">RON (Remote Online)</span>
                <input type="checkbox" className="h-4 w-4" checked={formState.isRon} onChange={(event) => updateField("isRon", event.target.checked)} />
              </label>
            </div>
          </div>
        </div>

        <div className={sectionCard}>
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">Special Instructions</h2>
          </div>
          <textarea
            rows={8}
            placeholder="Provide any specific requests, entry codes, or borrower requirements here..."
            className={`${inputClass} resize-none placeholder:text-gray-700`}
            value={formState.specialInstructions}
            onChange={(event) => updateField("specialInstructions", event.target.value)}
          />
        </div>
      </div>

      <div className={sectionCard}>
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Document Upload</h2>
        </div>

        <div className="space-y-6">
          <input
            id="order-documents"
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <label
            htmlFor="order-documents"
            className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 bg-zinc-50/30 cursor-pointer"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#1a4fdb]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">Click to upload order documents</p>
              <p className="text-xs font-medium text-gray-700 mt-1">Support for PDF, DOC, DOCX, PNG, JPG, JPEG</p>
            </div>
            <span className="px-6 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-[#1a4fdb] shadow-sm">
              Select Files
            </span>
          </label>

          <div className="space-y-3">
            {documents.map((file, index) => (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-700">{file.name}</p>
                    <p className="text-[10px] font-medium text-gray-700">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button type="button" onClick={() => removeFile(index)} className="p-2 text-gray-700 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-zinc-100 px-8 py-4 flex items-center justify-between z-50">
        <Link href="/dashboard-client/orders" className="text-sm font-bold text-gray-700 hover:text-zinc-900 transition-colors">
          Cancel
        </Link>
        <div className="flex items-center gap-3">
          <button type="button" className="px-8 py-2.5 bg-zinc-100 text-gray-700 rounded-xl text-sm font-bold">
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={createOrderStatus === "loading"}
            className="px-8 py-2.5 bg-[#1a4fdb] text-white rounded-xl text-sm font-bold hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {createOrderStatus === "loading" ? "Creating..." : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
