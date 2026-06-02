"use client";

import { 
  Briefcase, 
  User, 
  MapPin, 
  CreditCard, 
  Settings2, 
  MessageSquare, 
  Upload,
  Calendar,
  Clock,
  Trash2,
  FileText,
  X,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

export default function NewOrderPage() {
  const inputClass =
    "w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all";
  const selectClass =
    "w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all appearance-none";
  const compactSelectClass =
    "w-full px-3 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all appearance-none";
  const textAreaClass =
    "w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all resize-none";

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <h1 className="text-2xl font-bold text-zinc-900">Create New Order</h1>

      {/* Section 1: Client Information */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Client Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vendor Code *</label>
            <input 
              type="text" 
              defaultValue="26NC4999"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Service Type *</label>
            <div className="relative">
              <select className={selectClass}>
                <option>Loan Signing</option>
                <option>Power of Attorney</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Borrower Information */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <User className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Borrower Information</h2>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">First Name *</label>
              <input 
                type="text" 
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Last Name *</label>
              <input 
                type="text" 
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone *</label>
              <div className="flex gap-2">
                <div className="relative w-28">
                  <select className={compactSelectClass}>
                    <option>+1 (USA)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                </div>
                <input 
                  type="text" 
                  placeholder="(555) 000-0000"
                  className={`flex-1 ${inputClass}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email *</label>
              <input 
                type="email" 
                placeholder="borrower@example.com"
                className={inputClass}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="secondarySigner" className="w-4 h-4 rounded border-zinc-300 text-[#1a4fdb] focus:ring-[#1a4fdb]/20" />
            <label htmlFor="secondarySigner" className="text-sm font-medium text-zinc-600">Add Secondary Signer</label>
          </div>
        </div>
      </div>

      {/* Section 3: Property & Signing Details */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Property & Signing Details</h2>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Street Address *</label>
            <input 
              type="text" 
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">City *</label>
              <input 
                type="text" 
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">State *</label>
              <div className="relative">
                <select className={selectClass}>
                  <option>California</option>
                  <option>Texas</option>
                  <option>Florida</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zip *</label>
              <input 
                type="text" 
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Time Zone</label>
              <div className="relative">
                <select className={selectClass}>
                  <option>EST</option>
                  <option>CST</option>
                  <option>PST</option>
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
                  type="text" 
                  placeholder="mm/dd/yyyy"
                  className={inputClass}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Signing Time *</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="--:-- --"
                  className={inputClass}
                />
                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Payment / Fee Details */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Payment / Fee Details</h2>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Fee Amount ($) *</label>
              <input 
                type="text" 
                placeholder="$ 0.00"
                className={`${inputClass} font-medium`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment Status</label>
              <div className="relative">
                <select className={selectClass}>
                  <option>Pending</option>
                  <option>Paid</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Payment Method</label>
              <div className="relative">
                <select className={selectClass}>
                  <option>Card</option>
                  <option>Transfer</option>
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
                  type="text" 
                  placeholder="mm/dd/yyyy"
                  className={inputClass}
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Paid Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="mm/dd/yyyy"
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
              className={textAreaClass}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 5: Service Details */}
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">Service Details</h2>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Paper Size</label>
                <div className="relative">
                  <select className={selectClass}>
                    <option>Letter</option>
                    <option>Legal</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Preferred Ink</label>
                <div className="relative">
                  <select className={selectClass}>
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
                  className={inputClass}
                />
              </div>
              <div className="flex-1 bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700">RON (Remote Online)</span>
                <div className="w-10 h-5 bg-zinc-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: Special Instructions */}
        <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900">Special Instructions</h2>
          </div>
          
          <div className="space-y-2">
            <textarea 
              rows={6}
              placeholder="Provide any specific requests, entry codes, or borrower requirements here..."
              className={textAreaClass}
            ></textarea>
          </div>
        </div>
      </div>

      {/* Section 7: Document Upload */}
      <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-50 pb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-[#1a4fdb]" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Document Upload</h2>
        </div>
        
        <div className="space-y-6">
          <div className="border-2 border-dashed border-zinc-200 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 bg-zinc-50/30">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#1a4fdb]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-zinc-900">Click or drag files to this area to upload</p>
              <p className="text-xs font-medium text-zinc-400 mt-1">Support for PDF, DOC, and DOCX (Max 50MB)</p>
            </div>
            <button className="px-6 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-[#1a4fdb] hover:bg-zinc-50 transition-all active:scale-95 shadow-sm">
              Select Files
            </button>
          </div>

          <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-5 py-4 text-sm text-zinc-500">
            No files selected yet.
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-zinc-100 px-8 py-4 flex items-center justify-between z-50">
        <Link 
          href="/dashboard-client/orders"
          className="text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          Cancel
        </Link>
        <div className="flex items-center gap-3">
          <button className="px-8 py-2.5 bg-zinc-100 text-zinc-500 rounded-xl text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95">
            Save Draft
          </button>
          <button className="px-8 py-2.5 bg-[#1a4fdb] text-white rounded-xl text-sm font-bold hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
