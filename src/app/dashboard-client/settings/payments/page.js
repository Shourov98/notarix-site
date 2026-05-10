"use client";

import { 
  CreditCard, 
  Plus, 
  MoreHorizontal, 
  ShieldCheck,
  Building2,
  ChevronDown
} from "lucide-react";

const savedCards = [
  {
    type: "Visa",
    last4: "4242",
    expiry: "12/26",
    isPrimary: true,
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
  },
  {
    type: "MasterCard",
    last4: "8890",
    expiry: "04/25",
    isPrimary: false,
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
  }
];

export default function PaymentsSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Payment Methods</h2>
          <p className="text-zinc-500 font-medium text-xs mt-1">Manage your saved cards and billing information.</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-[#1a4fdb] hover:underline">
          <Plus className="w-4 h-4" />
          Add New Card
        </button>
      </div>

      <div className="p-8 space-y-12">
        
        {/* Saved Cards Grid */}
        <section className="space-y-6">
          <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Saved Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {savedCards.map((card, i) => (
              <div key={i} className="p-6 border border-zinc-100 rounded-[24px] hover:border-blue-100 transition-all bg-white shadow-sm relative group">
                <div className="flex items-start justify-between mb-8">
                  <div className="h-8 flex items-center">
                    <img src={card.logo} alt={card.type} className="h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <button className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-50 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{card.type} ending in {card.last4}</h4>
                    <p className="text-xs font-medium text-zinc-400 mt-1">Expires {card.expiry}</p>
                  </div>
                  
                  {card.isPrimary && (
                    <span className="inline-block bg-blue-50 text-[#1a4fdb] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">Primary</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-zinc-50" />

        {/* Billing Details */}
        <section className="space-y-6 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Billing Details</h3>
              <p className="text-xs font-medium text-zinc-400">Manage your official billing information for invoices.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Billing Name</label>
              <input 
                type="text" 
                defaultValue="James R. Wilson"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tax ID (Optional)</label>
              <input 
                type="text" 
                placeholder="VAT-12345678"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all font-medium"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Billing Address</label>
              <input 
                type="text" 
                defaultValue="4522 Oakwood Dr, Ste 400"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">City</label>
              <input 
                type="text" 
                defaultValue="Austin"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">State</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all">
                    <option>TX</option>
                    <option>NY</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zip Code</label>
                <input 
                  type="text" 
                  defaultValue="78701"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all font-medium"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end max-w-4xl pt-4">
            <button className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Save Billing Info
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
