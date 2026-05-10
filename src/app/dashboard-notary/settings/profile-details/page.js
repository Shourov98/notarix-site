"use client";

import { 
  ChevronDown, 
  Calendar, 
  ShieldCheck,
  Building2,
  FileBadge,
  PlusCircle
} from "lucide-react";

export default function NotaryProfileDetailsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Professional and Contact Details</h2>
      </div>

      <div className="p-8 space-y-12">
        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
            <input 
              type="text" 
              defaultValue="Nadia Jackson"
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email</label>
            <input 
              type="email" 
              defaultValue="n.jackson@notarymail.com"
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone</label>
            <input 
              type="text" 
              defaultValue="(555) 982-1142"
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Coverage Areas</label>
            <input 
              type="text" 
              placeholder="e.g. Manhattan, Brooklyn"
              className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
            />
          </div>
        </div>

        {/* Business Address Card */}
        <div className="border border-zinc-100 rounded-[24px] overflow-hidden max-w-4xl">
          <div className="p-4 border-b border-zinc-50 bg-zinc-50/20 px-8">
            <h3 className="text-[9px] font-bold text-zinc-400 uppercase tracking-[2px]">Business Address</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Address Line 1</label>
              <input 
                type="text" 
                defaultValue="742 Evergreen Terrace"
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Address Line 2</label>
                <input 
                  type="text" 
                  placeholder="Suite, Apt"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">City</label>
                <input 
                  type="text" 
                  defaultValue="New York"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">State</label>
                <div className="relative">
                  <select className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all">
                    <option>New York</option>
                    <option>California</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Zip Code</label>
                <input 
                  type="text" 
                  defaultValue="10001"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-50" />

        {/* Commission and Credentials Section */}
        <section className="space-y-8">
          <h2 className="text-xl font-bold text-zinc-900">Commission and Credentials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Commission Number</label>
              <input 
                type="text" 
                defaultValue="COMM-98452-NY"
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Commission State</label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all">
                  <option>New York</option>
                  <option>New Jersey</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Commission Expiration Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="mm/dd/yyyy"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Travel Radius (Miles)</label>
              <input 
                type="text" 
                defaultValue="50"
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">E&O Coverage Amount ($)</label>
              <input 
                type="text" 
                defaultValue="100,000"
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
          </div>
        </section>

        <hr className="border-zinc-50" />

        {/* Additional Information Section */}
        <section className="space-y-8 pb-8">
          <h2 className="text-xl font-bold text-zinc-900">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">RON Approval</label>
              <div className="relative">
                <select className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all">
                  <option>Select Option</option>
                  <option>Approved</option>
                  <option>Pending</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Background Check Date</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="mm/dd/yyyy"
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Specialties</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["RON", "HELOC", "Purchase", "Seller Pkg"].map((spec) => (
                <div key={spec} className="flex items-center gap-3 p-4 bg-zinc-50/50 border border-zinc-100 rounded-xl hover:border-blue-100 transition-all cursor-pointer group">
                  <div className="w-4 h-4 rounded border-2 border-zinc-200 bg-white group-hover:border-[#1a4fdb] transition-all flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#1a4fdb] rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest">{spec}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
