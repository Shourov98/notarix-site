"use client";

import { 
  Video,
  MapPin,
  User,
  CheckCircle2,
  CreditCard,
  Info,
  FileText,
  Lock,
  Clock,
  Camera,
  Wifi,
  ShieldCheck,
  CreditCard as PaymentIcon,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export default function RONOrderView({ id }) {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">Your Notary Session</h1>
          <p className="text-gray-700 font-medium text-sm">Review details and complete your online notarization</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-sm font-bold border border-emerald-100">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          Ready
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hero Banner */}
          <div className="bg-[#1a4fdb] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-lg shadow-blue-100">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-32 -mb-16 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Your session is ready to start</h2>
              <p className="text-blue-100 font-medium text-sm leading-relaxed">
                Connect with Notary Robert Vance to finalize your documents. The session is secure and encrypted.
              </p>
            </div>
            
            <div className="relative z-10 shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <Link href={`/session/${id || 'RON-260427'}`}>
                <button className="w-full md:w-auto bg-white text-[#1a4fdb] px-8 py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-3 hover:bg-zinc-50 transition-all active:scale-95 shadow-xl shadow-[#1a4fdb]/20">
                  <Video className="w-5 h-5" />
                  Join Video Session
                </button>
              </Link>
              <a
                href="https://app.bluenotary.us/login"
                target="_blank"
                rel="noreferrer"
                className="w-full md:w-auto bg-transparent border border-white/40 text-white px-8 py-4 rounded-[20px] font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/10 transition-all active:scale-95"
              >
                <ExternalLink className="w-5 h-5" />
                Continue on BlueNotary
              </a>
              <p className="text-[10px] font-medium text-blue-100 max-w-xs text-center md:text-right">
                RON sessions are now hosted on BlueNotary. Open the link to start your secure video session there.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Details */}
            <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-[#1a4fdb]">
                <MapPin className="w-5 h-5" />
                <h3 className="font-bold text-[10px] uppercase tracking-widest">Property Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Address</p>
                  <p className="text-sm font-bold text-zinc-800">4522 West Maple Avenue</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">City</p>
                    <p className="text-sm font-bold text-zinc-800">Austin</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">State / ZIP</p>
                    <p className="text-sm font-bold text-zinc-800">Texas, 78701</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Notary */}
            <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="flex items-center gap-3 text-[#1a4fdb]">
                <User className="w-5 h-5" />
                <h3 className="font-bold text-[10px] uppercase tracking-widest">Your Notary</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0 flex items-center justify-center">
                   <User className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900">Robert Vance</p>
                  <p className="text-[10px] font-medium text-gray-700 mt-0.5">r.vance@notarix.com</p>
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Notary Status</span>
                <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest">Online</span>
              </div>
            </div>
          </div>

          {/* Identity Verification */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#1a4fdb]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-[10px] uppercase tracking-widest">Identity Verification</h3>
              </div>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-50/50 border border-zinc-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Step 1: Upload ID</p>
                  <p className="text-[10px] font-medium text-gray-700 mt-0.5">Driver&apos;s License Approved</p>
                </div>
              </div>
              <div className="bg-zinc-50/50 border border-zinc-100 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Step 2: Face Check</p>
                  <p className="text-[10px] font-medium text-gray-700 mt-0.5">Biometric Match Confirmed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Order Details */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
              <h3 className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Order {id || "#RON-260427"}</h3>
              <Info className="w-4 h-4 text-[#1a4fdb]" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Type</span>
                <span className="text-sm font-bold text-zinc-900">Remote Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Date</span>
                <span className="text-sm font-bold text-zinc-900">Oct 28, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-700">Time</span>
                <span className="text-sm font-bold text-[#1a4fdb]">2:00 PM EST</span>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
              <div className="flex items-center gap-2 text-[#1a4fdb]">
                <FileText className="w-4 h-4" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest">Documents</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">2 Files</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-zinc-800">Deed_of_Trust.pdf</span>
                </div>
                <button className="text-[10px] font-bold text-[#1a4fdb] hover:underline uppercase tracking-widest">Preview</button>
              </div>
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold text-zinc-800">Closing_Disclosure.pdf</span>
                </div>
                <button className="text-[10px] font-bold text-[#1a4fdb] hover:underline uppercase tracking-widest">Preview</button>
              </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center justify-center gap-2 text-blue-600">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-medium italic">Signing will be available during live session</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-[#1a4fdb] border-b border-zinc-50 pb-4">
              <PaymentIcon className="w-4 h-4" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest">Payment</h3>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest mb-1">Total Amount Paid</p>
                <p className="text-2xl font-bold text-zinc-900">$125.00</p>
              </div>
              <div className="text-right">
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest mb-1 inline-block">Paid</span>
                <p className="text-[10px] font-medium text-gray-700">via Visa **** 4242</p>
              </div>
            </div>
          </div>

          {/* Pre-Session Tips */}
          <div className="bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-[#1a4fdb] border-b border-zinc-50 pb-4">
              <Info className="w-4 h-4" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">Pre-Session Tips</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <Clock className="w-4 h-4 text-[#1a4fdb] shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-zinc-600 leading-relaxed">Please join your session on time to ensure all parties are present.</p>
              </div>
              <div className="flex gap-3">
                <Camera className="w-4 h-4 text-[#1a4fdb] shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-zinc-600 leading-relaxed">Make sure your camera is working and your face is clearly visible.</p>
              </div>
              <div className="flex gap-3">
                <Wifi className="w-4 h-4 text-[#1a4fdb] shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-zinc-600 leading-relaxed">A stable internet connection is required for high-quality video signing.</p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button className="text-xs font-bold text-[#1a4fdb] hover:underline">Need help? Contact Support</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
