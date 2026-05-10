"use client";

import { 
  Mic, 
  Video, 
  ScreenShare, 
  MoreHorizontal, 
  PhoneOff, 
  ChevronLeft, 
  ChevronRight, 
  ZoomOut, 
  ZoomIn, 
  RotateCcw, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Maximize,
  Hand,
  CircleStop,
  Layout,
  Settings,
  X,
  FileText,
  User,
  Send,
  Paperclip
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function VideoSessionPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="h-screen bg-[#0a0a0b] text-white flex flex-col overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-[#0f0f11]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1a4fdb]/20 border border-[#1a4fdb]/30 rounded-lg">
            <div className="w-2 h-2 bg-[#1a4fdb] rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-[#1a4fdb] uppercase tracking-widest">Live Session</span>
          </div>
          <div className="h-4 w-px bg-white/10 mx-1"></div>
          <div>
            <h1 className="text-sm font-bold text-white/90">ORDER {id || "#RON-260427"}</h1>
            <p className="text-[10px] font-medium text-white/40">Remote Online Notarization</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Time Elapsed</span>
            <span className="text-sm font-mono font-bold text-white/90">12:45:02</span>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
            <Users className="w-4 h-4 text-white/60" />
            <span className="text-xs font-bold">2 Participants</span>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Pane - Shared Document */}
        <div className="flex-1 bg-[#050506] relative overflow-hidden flex flex-col items-center justify-center p-12">
          
          {/* Document Stage */}
          <div className="relative w-full max-w-2xl aspect-[8.5/11] bg-white shadow-2xl rounded-sm p-12 overflow-hidden border border-white/10 group cursor-default">
             <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-white -z-0"></div>
             
             {/* Document Content Simulation */}
             <div className="relative z-10 space-y-8 h-full flex flex-col">
                <div className="flex justify-between items-start border-b border-zinc-100 pb-8">
                   <div>
                      <h2 className="text-[#1a4fdb] text-xl font-bold tracking-tight mb-1">DEED OF TRUST</h2>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Security Instrument • Legal Form 422-A</p>
                   </div>
                   <div className="text-right">
                      <div className="w-16 h-16 border-2 border-dashed border-zinc-200 rounded flex items-center justify-center mb-1 ml-auto">
                         <span className="text-[8px] text-zinc-300 font-bold uppercase text-center leading-tight">Seal Area</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="h-2 bg-zinc-100 rounded w-full"></div>
                   <div className="h-2 bg-zinc-100 rounded w-11/12"></div>
                   <div className="h-2 bg-zinc-100 rounded w-full"></div>
                </div>

                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100">
                   <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest mb-3">1. DEFINITIONS</h3>
                   <p className="text-[11px] text-zinc-600 leading-relaxed">
                      Words used in multiple sections of this document are defined below and other words are defined in Sections 3, 11, 13, 18, 20 and 21. Certain rules regarding the usage of words used in this document are also provided in Section 16.
                   </p>
                </div>

                <div className="mt-auto space-y-6">
                   <div className="h-2 bg-zinc-100 rounded w-full opacity-40"></div>
                   <div className="h-2 bg-zinc-100 rounded w-10/12 opacity-40"></div>
                   
                   {/* Interactive Signature Area */}
                   <div className="relative pt-12 mt-12 border-t border-zinc-200">
                      <div className="absolute -top-12 left-0 right-0 flex justify-center">
                         <div className="bg-rose-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full shadow-lg shadow-rose-500/30 flex items-center gap-2 animate-bounce">
                            <ShieldCheck className="w-3 h-3" />
                            SIGN HERE
                         </div>
                      </div>
                      <div className="flex justify-between items-end gap-12">
                         <div className="flex-1 space-y-2">
                            <div className="h-px bg-zinc-900 w-full"></div>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Borrower's Signature</p>
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="h-px bg-zinc-300 w-full"></div>
                            <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">Date</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Document Overlays */}
             <div className="absolute top-4 left-4 p-2 bg-zinc-900/50 rounded-lg backdrop-blur-sm">
                <FileText className="w-4 h-4 text-white/40" />
             </div>
          </div>
        </div>

        {/* Right Sidebar - Video & Tools */}
        <div className="w-[400px] border-l border-white/5 bg-[#0f0f11] flex flex-col shrink-0">
          
          {/* Participant Videos */}
          <div className="p-4 grid grid-cols-1 gap-4 border-b border-white/5 bg-[#0a0a0b]/50">
             {/* Notary Feed */}
             <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden relative border border-white/5 shadow-xl group">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
                  alt="Robert Vance" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                   <div className="w-2 h-2 bg-[#1a4fdb] rounded-full"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">Robert Vance (Notary)</span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                   <button className="p-1.5 bg-black/40 hover:bg-[#1a4fdb] rounded-lg backdrop-blur-md transition-colors">
                      <Maximize className="w-3.5 h-3.5 text-white" />
                   </button>
                </div>
             </div>

             {/* My Feed */}
             <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden relative border border-white/5 shadow-xl group">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
                  alt="Jonathan Miller" 
                  className="w-full h-full object-cover grayscale brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">Jonathan Miller (You)</span>
                </div>
                <div className="absolute top-3 right-3">
                   <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                      <Mic className="w-3.5 h-3.5 text-white/60" />
                   </div>
                </div>
             </div>
          </div>

          {/* Panel Navigation */}
          <div className="px-6 flex items-center gap-6 border-b border-white/5">
             <button 
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 py-4 text-[10px] font-bold uppercase tracking-[2px] transition-all relative ${
                   activeTab === "chat" ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
             >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
                {activeTab === "chat" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a4fdb]"></div>}
             </button>
             <button 
                onClick={() => setActiveTab("participants")}
                className={`flex items-center gap-2 py-4 text-[10px] font-bold uppercase tracking-[2px] transition-all relative ${
                   activeTab === "participants" ? "text-white" : "text-white/40 hover:text-white/60"
                }`}
             >
                <Users className="w-3.5 h-3.5" />
                Participants
                {activeTab === "participants" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a4fdb]"></div>}
             </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
             {activeTab === "chat" ? (
                <div className="flex-1 flex flex-col min-h-0">
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="space-y-2">
                         <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Robert Vance • 02:30 PM</p>
                         <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none">
                            <p className="text-xs text-white/80 leading-relaxed">Hello Jonathan! Let's begin the review. I'll guide you to the signature area on page 3.</p>
                         </div>
                      </div>
                      <div className="space-y-2 flex flex-col items-end">
                         <p className="text-[9px] font-bold text-[#1a4fdb] uppercase tracking-widest">You • 02:31 PM</p>
                         <div className="bg-[#1a4fdb]/20 border border-[#1a4fdb]/30 p-3 rounded-2xl rounded-tr-none">
                            <p className="text-xs text-white/90 leading-relaxed">Perfect, I can see the document clearly. Ready when you are.</p>
                         </div>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 border-t border-white/5">
                      <div className="relative group">
                         <input 
                           type="text" 
                           placeholder="Type a message..." 
                           className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#1a4fdb]/50 transition-all pr-12"
                         />
                         <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#1a4fdb] text-white rounded-lg hover:bg-[#1541b8] transition-all">
                            <Send className="w-3.5 h-3.5" />
                         </button>
                      </div>
                      <div className="flex items-center gap-3 mt-3 px-1">
                         <button className="text-white/20 hover:text-white/60 transition-colors"><Paperclip className="w-4 h-4" /></button>
                         <button className="text-white/20 hover:text-white/60 transition-colors"><Settings className="w-4 h-4" /></button>
                      </div>
                   </div>
                </div>
             ) : (
                <div className="p-6 space-y-4">
                   <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 overflow-hidden">
                             <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="text-xs font-bold">Robert Vance</p>
                            <p className="text-[9px] font-bold text-[#1a4fdb] uppercase">Host • Notary</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="p-1.5 bg-emerald-500/20 rounded-md">
                            <Mic className="w-3 h-3 text-emerald-500" />
                         </div>
                      </div>
                   </div>
                   <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover grayscale" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white/90">Jonathan Miller</p>
                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">You • Borrower</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="p-1.5 bg-white/10 rounded-md">
                            <Mic className="w-3 h-3 text-white/40" />
                         </div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        </div>
      </main>

      {/* Bottom Control Bar */}
      <footer className="h-24 bg-[#0f0f11] border-t border-white/5 px-8 flex items-center justify-between relative shrink-0">
        {/* Call Controls */}
        <div className="flex items-center gap-3">
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60">
              <Mic className="w-5 h-5" />
           </button>
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60">
              <Video className="w-5 h-5" />
           </button>
           <div className="w-px h-8 bg-white/5 mx-1"></div>
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 group">
              <ScreenShare className="w-5 h-5 group-hover:text-[#1a4fdb]" />
           </button>
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60">
              <Hand className="w-5 h-5" />
           </button>
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60 group">
              <CircleStop className="w-5 h-5 group-hover:text-rose-500" />
           </button>
        </div>

        {/* Document Navigation */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-[#0a0a0b] border border-white/10 rounded-[20px] px-6 py-3 shadow-2xl">
           <div className="flex items-center gap-4">
              <button className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
              <div className="text-center w-32">
                 <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5 leading-none">Page</p>
                 <span className="text-xs font-bold text-[#1a4fdb]">3 of 12</span>
              </div>
              <button className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
           </div>
           <div className="w-px h-6 bg-white/10 mx-6"></div>
           <div className="flex items-center gap-4">
              <button className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-xs font-bold text-white/80 w-10 text-center">125%</span>
              <button className="p-1.5 hover:bg-white/5 rounded-lg transition-all text-white/40 hover:text-white"><ZoomIn className="w-4 h-4" /></button>
           </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60">
              <Layout className="w-5 h-5" />
           </button>
           <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/60">
              <Settings className="w-5 h-5" />
           </button>
           <div className="w-px h-8 bg-white/5 mx-1"></div>
           <Link href={`/dashboard-client/orders/${id}`}>
              <button className="h-12 px-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">
                 <PhoneOff className="w-4 h-4" />
                 Leave Session
              </button>
           </Link>
        </div>
      </footer>
    </div>
  );
}
