import { CheckCircle2, Eye, FileText, Phone, Search, Send, Shield, Video } from "lucide-react";

const conversations = [
  { name: "Sarah Jenkins", id: "RD-77291", preview: "I&apos;ve attached the property survey f...", time: "10:24 AM", active: true },
  { name: "Michael Chen", id: "RD-88420", preview: "Thank you for the quick session!", time: "Yesterday" },
  { name: "Elena Rodriguez", id: "RD-99124", preview: "Wait, I missed one page on the deed.", time: "Oct 12" },
];

export default function MessagesPage() {
  return (
    <div className="bg-white border border-indigo-100 rounded-[24px] shadow-sm flex h-[calc(100vh-13rem)] min-h-[760px] overflow-hidden">
      <div className="w-80 border-r border-zinc-100 bg-[#f5f5ff] shrink-0 flex flex-col">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-zinc-900">Messages</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-zinc-200 bg-white focus:outline-none focus:border-[#2c49df]"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-full bg-[#2c49df] text-white font-bold text-sm">All</button>
            <button className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-700 text-sm">Unread</button>
            <button className="px-4 py-2 rounded-full border border-zinc-200 text-zinc-700 text-sm">Active</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`px-6 py-4 border-l-4 ${conversation.active ? "bg-white border-l-[#2c49df]" : "border-l-transparent hover:bg-white/70"}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-zinc-100 overflow-hidden shrink-0">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${conversation.name}`}
                    alt={conversation.name}
                    className="w-full h-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-zinc-900 font-bold">{conversation.name}</p>
                    <p className="text-sm text-zinc-400">{conversation.time}</p>
                  </div>
                  <p className="text-[#2c49df] font-bold text-sm mt-1">#{conversation.id}</p>
                  <p className="text-zinc-500 text-sm mt-2 truncate">{conversation.preview}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-24 border-b border-zinc-100 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJenkins" alt="Sarah Jenkins" className="w-full h-full" />
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-900">Sarah Jenkins</p>
              <p className="text-emerald-500 font-medium mt-1">Online</p>
            </div>
          </div>
          <button className="px-6 py-4 rounded-2xl bg-[#eef2ff] text-[#2c49df] font-bold flex items-center gap-3">
            <Video className="w-5 h-5" />
            Request Video Session
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-center">
            <span className="px-4 py-2 rounded-full bg-zinc-50 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">Today</span>
          </div>
          <div className="max-w-2xl">
            <div className="bg-[#f1f0ff] rounded-[24px] rounded-tl-sm p-6">
              <p className="text-sm font-medium text-zinc-700 leading-relaxed">
                Good morning! I&apos;m ready for the notarization. I&apos;ve uploaded the property survey document for you to check first.
              </p>
            </div>
            <p className="text-zinc-400 mt-2 text-sm">10:21 AM</p>
          </div>

          <div className="max-w-2xl border border-dashed border-indigo-200 rounded-[24px] p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-bold text-zinc-900">Property_Survey.pdf</p>
                  <p className="text-sm font-medium text-zinc-500">2.4 MB • PDF Document</p>
                </div>
              </div>
              <button className="text-[#2c49df] font-bold">Download</button>
            </div>
          </div>

          <div className="ml-auto max-w-2xl">
            <div className="bg-[#2c49df] text-white rounded-[24px] rounded-tr-sm p-6">
              <p className="text-sm font-medium leading-relaxed">
                Received. I am reviewing the document now. It looks complete. Would you like to start the video verification session in 5 minutes?
              </p>
            </div>
            <p className="text-zinc-400 mt-2 text-sm text-right">10:24 AM • Read</p>
          </div>
        </div>

        <div className="p-4 border-t border-zinc-100">
          <div className="flex items-center gap-3 border border-zinc-200 rounded-2xl px-4 py-3">
            <Phone className="w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Type your message here..."
              className="flex-1 bg-transparent focus:outline-none text-zinc-700"
            />
            <button className="w-11 h-11 rounded-xl bg-[#2c49df] text-white flex items-center justify-center">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-80 border-l border-zinc-100 bg-zinc-50/60 shrink-0 p-6 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-400">Order Context</p>
          <div className="mt-5 bg-white border border-zinc-200 rounded-[24px] p-5 space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Order ID</p>
              <p className="text-3xl font-bold text-[#2c49df] mt-2">#RD-77291</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Client</p>
                <p className="text-zinc-900 font-semibold mt-2">Sarah J.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Notary</p>
                <p className="text-zinc-900 font-semibold mt-2">You</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Status</p>
              <span className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-50 text-[#2c49df] font-bold text-sm">
                <span className="w-2 h-2 rounded-full bg-[#2c49df]"></span>
                Assigned
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-zinc-400">Signing Date</p>
              <p className="text-zinc-900 font-semibold mt-2">Apr 24, 2026</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.25em] font-bold text-zinc-400">Quick Actions</p>
          <div className="mt-5 space-y-4">
            <button className="w-full px-5 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-800 font-semibold flex items-center gap-3">
              <Eye className="w-5 h-5 text-zinc-400" />
              View Order
            </button>
            <button className="w-full px-5 py-4 rounded-2xl bg-white border border-zinc-200 text-zinc-800 font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-zinc-400" />
              Mark Complete
            </button>
          </div>
        </div>

        <div className="pt-16 flex items-center gap-4 text-zinc-400">
          <Shield className="w-7 h-7 text-[#2c49df]" />
          <p className="text-xs uppercase tracking-[0.24em] font-bold">Secure Session Active</p>
        </div>
      </div>
    </div>
  );
}
