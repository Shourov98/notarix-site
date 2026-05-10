"use client";

import { 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  LogOut, 
  MapPin, 
  Monitor,
  CheckCircle2,
  XCircle
} from "lucide-react";

const activeSessions = [
  {
    device: "MacBook Pro - Chrome",
    location: "New York, USA",
    date: "Current Session",
    isCurrent: true
  },
  {
    device: "iPhone 15 - Safari",
    location: "California, USA",
    date: "Oct 24, 2023",
    isCurrent: false
  },
  {
    device: "Windows PC - Edge",
    location: "Austin, TX",
    date: "Oct 12, 2023",
    isCurrent: false
  }
];

export default function SecurityPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Section Header */}
      <div className="p-8 border-b border-zinc-50 bg-zinc-50/10">
        <h2 className="text-xl font-bold text-zinc-900">Security Settings</h2>
        <p className="text-zinc-500 font-medium text-xs mt-1">Manage your password and protect your account with extra security layers.</p>
      </div>

      <div className="p-8 space-y-12">
        
        {/* Password Management */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#1a4fdb]" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Password Management</h3>
              <p className="text-xs font-medium text-zinc-400">Change your password to keep your account secure.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl pt-2">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="hidden md:block"></div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4fdb]/10 focus:border-[#1a4fdb] transition-all"
              />
            </div>
          </div>
          <div className="flex justify-start">
            <button className="bg-[#1a4fdb] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#1541b8] shadow-lg shadow-blue-100 transition-all active:scale-95">
              Update Password
            </button>
          </div>
        </section>

        <hr className="border-zinc-50" />

        {/* Two-Factor Authentication */}
        <section className="space-y-6">
          <div className="flex items-center justify-between max-w-4xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs font-medium text-zinc-400">Add an extra layer of security to your account.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Status</p>
                <span className="text-xs font-bold text-rose-500 uppercase">Disabled</span>
              </div>
              <div className="w-12 h-6 bg-zinc-200 rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm"></div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-zinc-50" />

        {/* Device History */}
        <section className="space-y-6 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center">
              <Monitor className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">Device History</h3>
              <p className="text-xs font-medium text-zinc-400">Manage and revoke your active sessions on different devices.</p>
            </div>
          </div>

          <div className="space-y-3 max-w-4xl">
            {activeSessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-5 border border-zinc-100 rounded-2xl hover:border-blue-100 transition-colors bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                    {session.device.includes('iPhone') ? <Smartphone className="w-5 h-5 text-zinc-500" /> : <Monitor className="w-5 h-5 text-zinc-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">{session.device}</h4>
                      {session.isCurrent && (
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded uppercase tracking-widest">Active Now</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] font-medium uppercase tracking-wider">{session.location}</span>
                      </div>
                      <span className="text-[10px]">•</span>
                      <span className="text-[10px] font-medium uppercase tracking-wider">{session.date}</span>
                    </div>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button className="flex items-center gap-2 text-xs font-bold text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all">
                    Revoke
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
