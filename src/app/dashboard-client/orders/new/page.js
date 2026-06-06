"use client";

import { useMemo, useRef, useState } from "react";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  MapPin,
  MessageSquare,
  Settings2,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { requestPortalJson } from "../../../../lib/portal-api";

const STATES = [
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

const TIME_ZONES = ["EST", "CST", "MST", "PST"];
const SERVICE_TYPES = [
  "Loan Signing",
  "Power of Attorney",
  "Acknowledgement",
  "Jurats",
  "General Notarization",
];

const initialForm = {
  vendorCode: "",
  serviceType: "Loan Signing",
  signerFirstName: "",
  signerLastName: "",
  signerPhone: "",
  signerEmail: "",
  hasSecondarySigner: false,
  propertyAddressLine1: "",
  propertyCity: "",
  propertyState: "California",
  propertyZip: "",
  propertyTimeZone: "EST",
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

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
    <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
      <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#1a4fdb]" />
      </div>
      <h2 className="text-lg font-bold text-zinc-900">{title}</h2>
    </div>
    {children}
  </div>
);

export default function NewOrderPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const inputClass =
    "w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all";
  const selectClass =
    "w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all appearance-none";
  const compactSelectClass =
    "w-full px-3 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all appearance-none";
  const textAreaClass =
    "w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all resize-none";

  const totalDocumentSizeLabel = useMemo(() => {
    const totalBytes = documents.reduce((sum, file) => sum + (file.size || 0), 0);
    if (!totalBytes) return "0 KB";
    const units = ["B", "KB", "MB", "GB"];
    let value = totalBytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex += 1;
    }
    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }, [documents]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleFileSelection = (event) => {
    const nextFiles = Array.from(event.target.files || []);
    if (!nextFiles.length) return;

    setDocuments((current) => {
      const existingKeys = new Set(
        current.map((file) => `${file.name}:${file.size}:${file.lastModified}`),
      );
      const uniqueFiles = nextFiles.filter((file) => {
        const key = `${file.name}:${file.size}:${file.lastModified}`;
        return !existingKeys.has(key);
      });
      return [...current, ...uniqueFiles];
    });

    setError("");
    event.target.value = "";
  };

  const removeDocument = (indexToRemove) => {
    setDocuments((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const validateForm = () => {
    const requiredFields = [
      ["vendorCode", "Vendor code is required."],
      ["serviceType", "Service type is required."],
      ["signerFirstName", "Signer first name is required."],
      ["signerLastName", "Signer last name is required."],
      ["signerPhone", "Signer phone is required."],
      ["signerEmail", "Signer email is required."],
      ["propertyAddressLine1", "Property street address is required."],
      ["propertyCity", "Property city is required."],
      ["propertyState", "Property state is required."],
      ["propertyZip", "Property zip code is required."],
      ["signingDate", "Signing date is required."],
      ["signingTime", "Signing time is required."],
      ["feeAmount", "Fee amount is required."],
    ];

    for (const [field, message] of requiredFields) {
      if (!String(form[field] || "").trim()) {
        return message;
      }
    }

    if (!Number.isFinite(Number(form.feeAmount)) || Number(form.feeAmount) < 0) {
      return "Fee amount must be a valid positive number.";
    }

    if (!documents.length) {
      return "At least one document is required before creating an order.";
    }

    return "";
  };

  const handleCreateOrder = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const createPayload = await requestPortalJson("/site/orders", {
        method: "POST",
        body: JSON.stringify({
          vendorCode: form.vendorCode.trim(),
          serviceType: form.serviceType,
          signerFirstName: form.signerFirstName.trim(),
          signerLastName: form.signerLastName.trim(),
          signerPhone: form.signerPhone.trim(),
          signerEmail: form.signerEmail.trim().toLowerCase(),
          hasSecondarySigner: Boolean(form.hasSecondarySigner),
          propertyAddress: {
            line1: form.propertyAddressLine1.trim(),
            city: form.propertyCity.trim(),
            state: form.propertyState.trim(),
            zip: form.propertyZip.trim(),
            timeZone: form.propertyTimeZone,
          },
          signingDate: form.signingDate,
          signingTime: form.signingTime,
          feeAmount: Number(form.feeAmount),
          paymentStatus: form.paymentStatus,
          paymentMethod: form.paymentMethod,
          dueDate: form.dueDate || "",
          paidDate: form.paidDate || "",
          paymentNotes: form.paymentNotes.trim(),
          paperSize: form.paperSize,
          preferredInk: form.preferredInk,
          estimatedPages: form.estimatedPages.trim(),
          isRon: Boolean(form.isRon),
          specialInstructions: form.specialInstructions.trim(),
        }),
      });

      const orderId = createPayload?.orderId;
      if (!orderId) {
        throw new Error("Order was created but the order ID was not returned.");
      }

      const formData = new FormData();
      documents.forEach((file) => {
        formData.append("documents", file);
      });

      await requestPortalJson(`/site/orders/${orderId}/documents`, {
        method: "POST",
        body: formData,
      });

      setSuccessMessage("Order created successfully. Redirecting to order details...");
      router.push(`/dashboard-client/orders/${orderId}`);
    } catch (requestError) {
      setError(requestError?.message || "Unable to create the order right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-zinc-900">Create New Order</h1>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <SectionCard icon={Briefcase} title="Client Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vendor Code *</label>
            <input
              type="text"
              value={form.vendorCode}
              onChange={(event) => updateField("vendorCode", event.target.value)}
              className={inputClass}
              placeholder="Enter vendor code"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Type *</label>
            <div className="relative">
              <select
                className={selectClass}
                value={form.serviceType}
                onChange={(event) => updateField("serviceType", event.target.value)}
              >
                {SERVICE_TYPES.map((serviceType) => (
                  <option key={serviceType}>{serviceType}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={User} title="Borrower Information">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">First Name *</label>
              <input
                type="text"
                value={form.signerFirstName}
                onChange={(event) => updateField("signerFirstName", event.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Last Name *</label>
              <input
                type="text"
                value={form.signerLastName}
                onChange={(event) => updateField("signerLastName", event.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone *</label>
              <div className="flex gap-2">
                <div className="relative w-28">
                  <select className={compactSelectClass} defaultValue="+1">
                    <option value="+1">+1 USA</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                </div>
                <input
                  type="text"
                  placeholder="(555) 000-0000"
                  value={form.signerPhone}
                  onChange={(event) => updateField("signerPhone", event.target.value)}
                  className={`flex-1 ${inputClass}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email *</label>
              <input
                type="email"
                placeholder="borrower@example.com"
                value={form.signerEmail}
                onChange={(event) => updateField("signerEmail", event.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="secondarySigner"
              checked={form.hasSecondarySigner}
              onChange={(event) => updateField("hasSecondarySigner", event.target.checked)}
              className="w-4 h-4 rounded border-zinc-300 text-[#1a4fdb] focus:ring-[#1a4fdb]/20"
            />
            <label htmlFor="secondarySigner" className="text-sm font-medium text-zinc-600">
              Add Secondary Signer
            </label>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={MapPin} title="Property & Signing Details">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Street Address *</label>
            <input
              type="text"
              value={form.propertyAddressLine1}
              onChange={(event) => updateField("propertyAddressLine1", event.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">City *</label>
              <input
                type="text"
                value={form.propertyCity}
                onChange={(event) => updateField("propertyCity", event.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">State *</label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.propertyState}
                  onChange={(event) => updateField("propertyState", event.target.value)}
                >
                  {STATES.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zip *</label>
              <input
                type="text"
                value={form.propertyZip}
                onChange={(event) => updateField("propertyZip", event.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time Zone</label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.propertyTimeZone}
                  onChange={(event) => updateField("propertyTimeZone", event.target.value)}
                >
                  {TIME_ZONES.map((timeZone) => (
                    <option key={timeZone}>{timeZone}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signing Date *</label>
              <div className="relative">
                <input
                  type="date"
                  value={form.signingDate}
                  onChange={(event) => updateField("signingDate", event.target.value)}
                  className={inputClass}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signing Time *</label>
              <div className="relative">
                <input
                  type="time"
                  value={form.signingTime}
                  onChange={(event) => updateField("signingTime", event.target.value)}
                  className={inputClass}
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={CreditCard} title="Payment / Fee Details">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Fee Amount ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.feeAmount}
                onChange={(event) => updateField("feeAmount", event.target.value)}
                className={`${inputClass} font-medium`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment Status</label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.paymentStatus}
                  onChange={(event) => updateField("paymentStatus", event.target.value)}
                >
                  <option>Pending</option>
                  <option>Paid</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment Method</label>
              <div className="relative">
                <select
                  className={selectClass}
                  value={form.paymentMethod}
                  onChange={(event) => updateField("paymentMethod", event.target.value)}
                >
                  <option>Card</option>
                  <option>Transfer</option>
                  <option>ACH</option>
                  <option>Wire</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Due Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(event) => updateField("dueDate", event.target.value)}
                  className={inputClass}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Paid Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={form.paidDate}
                  onChange={(event) => updateField("paidDate", event.target.value)}
                  className={inputClass}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment Notes</label>
            <textarea
              rows={3}
              value={form.paymentNotes}
              onChange={(event) => updateField("paymentNotes", event.target.value)}
              className={textAreaClass}
            />
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard icon={Settings2} title="Service Details">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Paper Size</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={form.paperSize}
                    onChange={(event) => updateField("paperSize", event.target.value)}
                  >
                    <option>Letter</option>
                    <option>Legal</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Preferred Ink</label>
                <div className="relative">
                  <select
                    className={selectClass}
                    value={form.preferredInk}
                    onChange={(event) => updateField("preferredInk", event.target.value)}
                  >
                    <option>Black</option>
                    <option>Blue</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Est. Pages</label>
                <input
                  type="text"
                  value={form.estimatedPages}
                  onChange={(event) => updateField("estimatedPages", event.target.value)}
                  className={inputClass}
                />
              </div>
              <label className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium text-zinc-700">RON (Remote Online)</span>
                <input
                  type="checkbox"
                  checked={form.isRon}
                  onChange={(event) => updateField("isRon", event.target.checked)}
                  className="sr-only"
                />
                <span className={`w-10 h-5 rounded-full relative transition-colors ${form.isRon ? "bg-[#1a4fdb]" : "bg-zinc-200"}`}>
                  <span
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${form.isRon ? "left-[22px]" : "left-0.5"}`}
                  />
                </span>
              </label>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={MessageSquare} title="Special Instructions">
          <div className="space-y-2">
            <textarea
              rows={10}
              placeholder="Provide any specific requests, entry codes, or borrower requirements here..."
              value={form.specialInstructions}
              onChange={(event) => updateField("specialInstructions", event.target.value)}
              className={textAreaClass}
            />
          </div>
        </SectionCard>
      </div>

      <SectionCard icon={Upload} title="Document Upload">
        <div className="space-y-6">
          <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 bg-zinc-50/30">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#1a4fdb]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">Upload at least one supporting document</p>
              <p className="text-xs font-medium text-zinc-400 mt-1">
                Support for PDF, DOC, and DOCX. At least one document is required before submitting.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileSelection}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-[#1a4fdb] hover:bg-zinc-50 transition-all active:scale-95 shadow-sm"
            >
              Select Files
            </button>
          </div>

          {documents.length ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-800">
                {documents.length} file{documents.length === 1 ? "" : "s"} selected · {totalDocumentSizeLabel}
              </div>
              {documents.map((file, index) => (
                <div
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-5 py-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#1a4fdb]" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900">{file.name}</p>
                      <p className="text-xs text-zinc-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(index)}
                    className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${file.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-5 py-4 text-sm text-zinc-500">
              No files selected yet. Upload at least one document to continue.
            </div>
          )}
        </div>
      </SectionCard>

      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-zinc-100 px-8 py-4 flex items-center justify-between z-50">
        <Link
          href="/dashboard-client/orders"
          className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Cancel
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled
            className="px-8 py-2.5 bg-zinc-100 text-zinc-400 rounded-xl text-sm font-bold cursor-not-allowed"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handleCreateOrder}
            disabled={submitting}
            className="px-8 py-2.5 bg-[#1a4fdb] text-white rounded-xl text-sm font-bold hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Creating..." : "Create Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
