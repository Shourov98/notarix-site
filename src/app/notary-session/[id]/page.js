import { Camera, CircleDot, Hand, Info, Mic, Shield, Video } from "lucide-react";
import Link from "next/link";

export default async function NotarySessionPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id || "RON-9402";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-16 px-6 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-4xl font-black tracking-tight text-[#2c49df]">NotaryLive Secure Session</p>
          <div className="w-px h-6 bg-zinc-200"></div>
          <div className="px-4 py-2 rounded-full bg-red-50 text-red-600 font-bold flex items-center gap-2">
            <CircleDot className="w-4 h-4 fill-current" />
            Recording in Progress
            <span>00:24:15</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-5 py-3 rounded-2xl border border-indigo-100 text-[#2c49df] font-bold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            End-to-End Encrypted
          </div>
          <Info className="w-6 h-6 text-zinc-500" />
          <Link href={`/dashboard-notary/assignments-orders/${id}`} className="px-6 py-3 rounded-2xl bg-[#2c49df] text-white font-bold">
            Complete Signing
          </Link>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 overflow-hidden">
        <div className="bg-[#f7f8ff] p-6 space-y-4">
          <div className="h-[600px] rounded-[24px] overflow-hidden relative bg-zinc-200">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200"
              alt="Notary session"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 px-4 py-3 rounded-2xl bg-zinc-900/60 text-white flex items-center gap-3">
              <span className="text-2xl font-bold">Michael Sterling</span>
              <span className="text-xs uppercase tracking-[0.18em] font-bold text-blue-200">Notary Public</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 rounded-[24px] overflow-hidden relative bg-zinc-200">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=900"
                alt="Borrower"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-2xl bg-zinc-900/60 text-white">
                Sarah Jenkins <span className="text-xs uppercase tracking-[0.15em] text-orange-200">Borrower</span>
              </div>
            </div>
            <div className="h-48 rounded-[24px] bg-[#dfe5f0] flex flex-col items-center justify-center text-zinc-500">
              <Hand className="w-8 h-8" />
              <p className="font-bold mt-4">Witness Participant</p>
              <p className="mt-3 px-4 py-2 rounded-xl bg-zinc-700 text-white text-sm">Witness Waiting</p>
            </div>
          </div>
        </div>

        <div className="bg-white border-l border-zinc-200 flex flex-col">
          <div className="h-12 px-6 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-3 text-zinc-700 font-bold">
              <span>Refinance_Agreement_V4.pdf</span>
            </div>
            <div className="flex items-center gap-6 text-zinc-500">
              <span>115%</span>
              <span>Page 4 of 28</span>
            </div>
          </div>
          <div className="flex-1 bg-[#eef2fb] p-8 relative">
            <div className="bg-white border border-zinc-200 w-full h-full max-w-4xl mx-auto p-12">
              <div className="space-y-4">
                <div className="h-10 w-1/2 bg-zinc-100 rounded"></div>
                <div className="h-4 w-full bg-zinc-50 rounded"></div>
                <div className="h-4 w-full bg-zinc-50 rounded"></div>
                <div className="h-4 w-3/4 bg-zinc-50 rounded"></div>
                <div className="mt-12 pt-10 border-t border-zinc-200">
                  <div className="border-2 border-dashed border-indigo-300 rounded-[24px] p-8 bg-[#f6f8ff]">
                    <div className="w-full h-24 border border-zinc-300 rounded-2xl flex items-center justify-center text-zinc-300 italic text-3xl">
                      Sign Here
                    </div>
                    <button className="block mx-auto mt-6 px-8 py-4 rounded-2xl bg-[#2c49df] text-white font-bold shadow-lg shadow-blue-100">
                      Sign Document
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-24 right-2 bg-white border border-zinc-200 rounded-[24px] shadow-sm overflow-hidden">
              {["Sign", "Initial", "Date"].map((item) => (
                <button key={item} className="block px-6 py-6 text-[#2c49df] font-bold border-b last:border-b-0 border-zinc-100">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="h-24 border-t border-zinc-200 bg-white flex items-center justify-center gap-8">
        {[
          [Mic, "Mute"],
          [Camera, "Camera"],
          [Video, "Share"],
          [CircleDot, "Record"],
        ].map(([Icon, label]) => (
          <button key={label} className="text-zinc-700 font-medium flex flex-col items-center gap-2">
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
        <button className="px-8 py-4 rounded-2xl bg-red-50 text-red-500 font-bold">End Session</button>
      </footer>
    </div>
  );
}
